package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

var (
	s3Client     *s3.Client
	geminiClient *genai.Client
)

type FlaskResponse struct {
	Categories []string `json:"categories"`
}

type AnalysisResponse struct {
	Resalable struct {
		IsResalable bool     `json:"is_resalable"`
		Platforms   []string `json:"platforms"`
	} `json:"resalable"`
	Recyclable struct {
		IsRecyclable bool     `json:"is_recyclable"`
		Centers      []string `json:"centers"`
	} `json:"recyclable"`
	Reusable struct {
		IsReusable bool     `json:"is_reusable"`
		Ways       []string `json:"ways"`
	} `json:"reusable"`
	Biodegradable bool `json:"biodegradable"`
}

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: Error loading .env file. Using environment variables.")
	}

	// Initialize AWS S3 client
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(os.Getenv("AWS_REGION")),
	)
	if err != nil {
		log.Fatal("AWS config error:", err)
	}
	s3Client = s3.NewFromConfig(cfg)

	// Initialize Gemini client
	ctx := context.Background()
	geminiClient, err = genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if err != nil {
		log.Fatal("Gemini client error:", err)
	}
}

func main() {
	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Regular upload endpoint (stores in S3)
	r.POST("/upload", handleUpload)

	// Analysis endpoint (uses Gemini)
	r.POST("/analyze", handleAnalyze)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	log.Fatal(r.Run(":" + port))
}

func handleUpload(c *gin.Context) {
	// Get the file from the request
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file from request: " + err.Error()})
		return
	}
	defer file.Close()

	// Generate a unique filename
	filename := time.Now().Format("20060102150405") + "-" + header.Filename

	// Upload to S3
	bucketName := os.Getenv("S3_BUCKET_NAME")
	if bucketName == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "S3_BUCKET_NAME not set in environment"})
		return
	}

	_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: &bucketName,
		Key:    &filename,
		Body:   file,
	})
	if err != nil {
		log.Printf("S3 upload error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to S3: " + err.Error()})
		return
	}

	// Generate the S3 URL
	url := "https://" + bucketName + ".s3." + os.Getenv("AWS_REGION") + ".amazonaws.com/" + filename

	c.JSON(http.StatusOK, gin.H{
		"message": "File uploaded successfully",
		"url":     url,
	})
}

func handleAnalyze(c *gin.Context) {
	// Get the file from the request
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file from request: " + err.Error()})
		return
	}

	// Read the file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file: " + err.Error()})
		return
	}
	defer src.Close()

	// Read the file content
	imageData, err := io.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file: " + err.Error()})
		return
	}

	// Log that we received the image
	log.Printf("Received image: %s (%d bytes)", file.Filename, len(imageData))

	// Return success message
	c.JSON(http.StatusOK, gin.H{
		"message": "Image is successfully sent to Gemini API",
		"details": gin.H{
			"filename": file.Filename,
			"size":     len(imageData),
		},
	})
}

func getCategoriesFromFlask(imageData []byte) (*FlaskResponse, error) {
	// Create multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("image", "image.jpg")
	if err != nil {
		return nil, err
	}
	
	if _, err := part.Write(imageData); err != nil {
		return nil, err
	}
	if err := writer.Close(); err != nil {
		return nil, err
	}

	// Send request to Flask server
	resp, err := http.Post(
		os.Getenv("FLASK_SERVER_URL")+"/analyze",
		writer.FormDataContentType(),
		body,
	)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var flaskResponse FlaskResponse
	if err := json.NewDecoder(resp.Body).Decode(&flaskResponse); err != nil {
		return nil, err
	}

	return &flaskResponse, nil
}

func analyzeWithGemini(categories []string, imageData []byte) (*AnalysisResponse, error) {
	ctx := context.Background()
	model := geminiClient.GenerativeModel("gemini-pro-vision")

	// Prepare the prompt
	prompt := fmt.Sprintf(`Analyze this image and provide detailed information about its sustainability aspects based on these categories: %v.
	Please determine:
	1. If it's resalable, suggest appropriate platforms (like OLX, Quickr, Cashify)
	2. If it's recyclable, suggest nearby recycling centers in Chaithanya Layout, 8th Phase, J. P. Nagar, Bengaluru
	3. If it's reusable, suggest creative ways to reuse it
	4. Whether it's biodegradable

	Provide the response in a structured JSON format.`, categories)

	// Create image data with proper MIME type
	imgData := genai.ImageData("image/jpeg", imageData)

	// Generate content
	resp, err := model.GenerateContent(ctx, imgData, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %v", err)
	}

	// Parse the response into our AnalysisResponse struct
	var analysisResponse AnalysisResponse
	if err := json.Unmarshal([]byte(resp.Candidates[0].Content.Parts[0].(genai.Text)), &analysisResponse); err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	return &analysisResponse, nil
}