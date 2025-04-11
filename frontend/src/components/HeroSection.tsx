"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Earth3D from "./Earth3D";
import { FaCamera, FaUpload, FaChrome } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UnauthorizedDialog from "./UnauthorizedDialog";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, remainingUploads, decrementUploads, canUpload } = useAuth();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);

  // State for tracking uploads and showing auth modals
  const [showUnauthorizedDialog, setShowUnauthorizedDialog] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Add useEffect to detect when video is ready
  useEffect(() => {
    if (videoRef.current && showCamera) {
      const handleVideoReady = () => {
        console.log("Video stream is ready for capture");
        setIsCameraReady(true);
      };

      videoRef.current.addEventListener("loadeddata", handleVideoReady);

      return () => {
        videoRef.current?.removeEventListener("loadeddata", handleVideoReady);
      };
    }
  }, [showCamera, videoRef.current]);

  // Add this useEffect for better camera readiness detection
  useEffect(() => {
    if (videoRef.current && showCamera) {
      const video = videoRef.current;

      // Multiple event listeners to detect readiness
      const events = ["loadeddata", "loadedmetadata", "playing"];

      const handleVideoReady = () => {
        // Only set ready if dimensions are available
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          console.log("Video stream is ready for capture", {
            width: video.videoWidth,
            height: video.videoHeight,
          });
          setIsCameraReady(true);
        }
      };

      // Add a play call to make sure video starts
      const attemptPlay = async () => {
        try {
          await video.play();
        } catch (err) {
          console.error("Error playing video", err);
        }
      };

      // Add fallback timeout to check if video is ready
      const readyTimeout = setTimeout(() => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          setIsCameraReady(true);
          console.log("Camera ready detected by timeout fallback");
        }
      }, 3000);

      // Add all event listeners
      events.forEach((event) =>
        video.addEventListener(event, handleVideoReady)
      );

      // Initial play attempt
      attemptPlay();

      return () => {
        events.forEach((event) =>
          video.removeEventListener(event, handleVideoReady)
        );
        clearTimeout(readyTimeout);
      };
    } else {
      // Reset when camera is turned off
      setIsCameraReady(false);
    }
  }, [showCamera, videoRef.current]);

  // Modify handleScanImage to use a two-step approach
  const handleScanImage = async () => {
    // Check if user can upload
    if (!canUpload()) {
      setShowUnauthorizedDialog(true);
      return;
    }

    // First, show the camera UI (this will render the video element)
    setShowCamera(true);
    setIsCameraInitializing(true);
    setIsCameraReady(false);
  };

  // Add a separate useEffect to handle camera initialization after the UI is rendered
  useEffect(() => {
    // Only run this effect when the camera UI is showing but stream hasn't been initialized
    if (showCamera && isCameraInitializing) {
      const initializeCamera = async () => {
        try {
          console.log("Initializing camera stream...");
          const constraints = {
            video: true,
            audio: false,
          };

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log("Camera stream obtained successfully");

          // Set the stream in state
          setCameraStream(stream);

          // Now we can safely access videoRef because the video element is in the DOM
          if (videoRef.current) {
            console.log("Setting video source object");
            videoRef.current.srcObject = stream;

            // Try to play the video
            try {
              await videoRef.current.play();
              console.log("Video playback started");
            } catch (e) {
              console.error("Error playing video:", e);
            }
          } else {
            console.warn("Video element not available after showing camera UI");
          }

          // Camera initialization complete
          setIsCameraInitializing(false);
        } catch (error) {
          console.error("Error accessing camera:", error);
          alert(
            "Unable to access camera. Please make sure you have granted camera permissions."
          );
          // Reset states on error
          setShowCamera(false);
          setIsCameraInitializing(false);
        }
      };

      initializeCamera();
    }
  }, [showCamera, isCameraInitializing]);

  // Add a separate function for capturing the image
  const captureImage = async () => {
    // Double-check permission before proceeding
    if (!canUpload()) {
      setShowUnauthorizedDialog(true);
      setShowCamera(false);
      stopCamera();
      return;
    }

    if (videoRef.current) {
      // Make sure video is playing and has dimensions
      if (
        videoRef.current.videoWidth === 0 ||
        videoRef.current.videoHeight === 0
      ) {
        alert(
          "Camera stream not ready yet. Please wait a moment and try again."
        );
        return;
      }

      const canvas = document.createElement("canvas");
      // Set canvas size to match video dimensions
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame to the canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        try {
          // Convert canvas to image data URL
          const imageData = canvas.toDataURL("image/jpeg");

          // First, set local state to show the image immediately
          setCapturedImage(imageData);
          setShowCamera(false);
          stopCamera();

          // Then, save the image to the server
          try {
            const response = await fetch("/api/save-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageData }),
            });

            if (!response.ok) {
              throw new Error("Failed to save image to server");
            }

            const data = await response.json();

            if (data.success) {
              // Update the image URL to the saved file path
              setCapturedImage(data.url);
              console.log("Image saved to:", data.url);
            }

            // Decrement uploads after successful capture
            decrementUploads();
          } catch (serverError) {
            console.error("Error saving image to server:", serverError);
            // The user can still see the captured image, but it wasn't saved to the server
            alert(
              "The image was captured but couldn't be saved to the server."
            );
          }
        } catch (e) {
          console.error("Error capturing image:", e);
          alert("Failed to capture image. Please try again.");
        }
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleUploadImage = () => {
    // Check if user can upload
    if (!canUpload()) {
      setShowUnauthorizedDialog(true);
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setCapturedImage(data.url);
        // Decrement uploads after successful upload
        decrementUploads();
        console.log("Image uploaded successfully:", data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleChromeExtension = () => {
    router.push("/extension");
  };

  return (
    <div
      id="hero"
      className="relative h-screen w-full backdrop-blur-lg bg-gradient-to-b from-green-900/10 via-teal-900/70 to-green-900/40 overflow-hidden pt-16"
    >
      {/* Background elements */}
      <div className="absolute mt-16 inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth3D scale={1.3} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Camera view */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <div className="relative w-full max-w-[640px] h-[480px] bg-gray-800 rounded-lg overflow-hidden">
            {/* Key changes: add key prop and explicit styles */}
            <video
              key="camera-video"
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              className="rounded-lg"
            />
            {(isCameraInitializing || !isCameraReady) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <p className="text-white ml-4">
                  {isCameraInitializing
                    ? "Initializing camera..."
                    : "Preparing stream..."}
                </p>
              </div>
            )}
          </div>
          {/* Button controls */}
          <div className="mt-4 flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowCamera(false);
                stopCamera();
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={isCameraReady ? { scale: 1.05 } : {}}
              whileTap={isCameraReady ? { scale: 0.95 } : {}}
              onClick={captureImage}
              disabled={!isCameraReady}
              className={`px-6 py-3 text-white rounded-lg transition-colors duration-200 shadow-lg ${isCameraReady
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 cursor-not-allowed"
                }`}
            >
              {isCameraReady ? "Capture" : "Waiting for camera..."}
            </motion.button>
          </div>
        </div>
      )}

      {/* Captured/Uploaded image preview */}
      {capturedImage && !showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-[70vh] rounded-lg"
          />
          <div className="mt-4 flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCapturedImage(null)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
            >
              Close
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
            >
              Analyze
            </motion.button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-2"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.h1 
              initial={{ 
                opacity: 0, 
                y: -50,
                scale: 0.5,
                rotate: -10
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
                rotate: 0
              }}
              transition={{ 
                duration: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.2
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-12 drop-shadow-lg relative z-10 tracking-tight"
              style={{ 
                fontFamily: "'Montserrat', 'Poppins', sans-serif",
                letterSpacing: "-0.02em"
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="inline-block"
                style={{ 
                  fontFamily: "'Montserrat', 'Poppins', sans-serif",
                  letterSpacing: "-0.03em"
                }}
              >
                Welcome to{" "}
                <motion.span
                  initial={{ color: "#ffffff" }}
                  animate={{ 
                    color: ["#ffffff", "#4ade80", "#ffffff"],
                    textShadow: [
                      "0 0 0px rgba(74, 222, 128, 0)",
                      "0 0 20px rgba(74, 222, 128, 0.8)",
                      "0 0 0px rgba(74, 222, 128, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-green-200 font-black"
                  style={{ 
                    fontFamily: "'Montserrat', 'Poppins', sans-serif",
                    letterSpacing: "-0.03em"
                  }}
                >
                  3RVision
                </motion.span>
                !
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ 
                duration: 1,
                delay: 0.5,
                type: "spring",
                stiffness: 50
              }}
              className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ 
                duration: 1.2,
                delay: 0.8,
                type: "spring",
                stiffness: 40
              }}
              className="absolute -inset-6 bg-blue-500/20 rounded-full blur-xl"
            />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg"
            style={{ 
              fontFamily: "'Montserrat', 'Poppins', sans-serif",
              letterSpacing: "-0.01em"
            }}
          >
            Redefining Resource Management
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-xl text-white mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-lg"
          >
            Empowering sustainable choices through AI-driven intelligence for
            <span className="font-semibold"> Reuse</span>, <span className="font-semibold">Recycle</span> and <span className="font-semibold">Resale</span>.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          {/* Buttons row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScanImage}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg text-sm sm:text-base"
            >
              <FaCamera className="text-lg sm:text-xl" />
              <span>{showCamera ? "Capture Image" : "Scan Item"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadImage}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg text-sm sm:text-base"
            >
              <FaUpload className="text-lg sm:text-xl" />
              <span>Upload Image</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChromeExtension}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg text-sm sm:text-base"
            >
              <FaChrome className="text-lg sm:text-xl" />
              <span>Chrome Extension</span>
            </motion.button>
          </div>

          {/* Keep only this message about remaining uploads */}
          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-white/20 backdrop-blur-md rounded-lg p-2 mt-3 text-white max-w-md shadow-lg mx-4 sm:mx-auto"
            >
              <p className="text-xs sm:text-sm md:text-base">
                You have <strong>{remainingUploads}</strong> free image
                operations remaining. <br />
                <span className="text-xs sm:text-sm">
                  (Combined limit for uploads and scans)
                </span>
                <br />
                Sign up or log in for unlimited access.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Unauthorized Access Dialog */}
      <UnauthorizedDialog
        isOpen={showUnauthorizedDialog}
        onClose={() => setShowUnauthorizedDialog(false)}
        onLogin={() => {
          setShowUnauthorizedDialog(false);
          setShowLoginModal(true);
        }}
        onSignup={() => {
          setShowUnauthorizedDialog(false);
          setShowSignupModal(true);
        }}
      />
    </div>
  );
};

export default HeroSection;
