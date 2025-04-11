#  3RVision - See Your Products' Sustainable Future 🌱

> "Every product tells a story of sustainability. With 3RVision, we help you write its next chapter via reuse, recycling and resale."

**Team Name:** Quaternary  
**Hackathon:** FANTOMCODE '25  
**Date:** 11th and 12th April 2025



## 📖 Table of Contents

1. Introduction
2. Problem Statement
3. Solution Overview
4. Tech Stack
5. Architecture / Diagram
6. Installation & Usage
7. Team Members



## 🧠 Introduction

3RVision is a comprehensive sustainability analysis platform that helps users make informed decisions about product lifecycle management. By analyzing product images, our platform provides detailed insights into how you can extend a product's life through three key sustainability pillars: reuse, recycle, and resale. Whether you're looking to dispose of items responsibly or make sustainable purchasing decisions, 3RVision guides you towards environmentally conscious choices.



## 🔍 Problem Statement

In today's consumer-driven world, we face several critical challenges:
- Lack of awareness about proper product disposal methods
- Difficulty in identifying recycling and reuse opportunities
- Limited access to local sustainability resources
- Environmental impact of improper product disposal
- Complex decision-making process for sustainable product lifecycle management



## ✅ Solution Overview

3RVision addresses these challenges through:

### 1. Image-Based Analysis
- **Smart Capture**: Take photos or upload product images
- **Material Recognition**: Advanced ML models identify product composition
- **Lifecycle Analysis**: Get detailed insights on:
  - Reuse potential and creative repurposing ideas
  - Recycling options and local facilities
  - Resale value and market opportunities
  - Biodegradability assessment

### 2. Browser Extension
- **Quick Analysis**: Get instant sustainability insights while browsing
- **Seamless Integration**: Works alongside your browsing experience
- **Consistent Experience**: Same analysis quality as the web platform
- **Easy Access**: One-click access to detailed sustainability information

### 3. Community Forum
- Share sustainability experiences
- Discuss eco-friendly practices
- Create and participate in polls
- Share images and tips
- Connect with like-minded individuals



## 🛠️ Tech Stack

### Frontend
- Next.js 15.2.4
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- Three.js

### Backend
- Go (Golang)
- Gin Web Framework
- AWS S3
- MongoDB

### Extension
- JavaScript
- Chrome Extension Manifest V3
- Content Scripts

### ML Component
- Python
- Computer Vision models
- Flask server



## 🧩 Architecture

<img width="393" alt="Screenshot 2025-04-12 at 5 05 08 AM" src="https://github.com/user-attachments/assets/557866d7-6757-4354-8843-7f55b74c1d39" />




## ☘️ Installation & Usage

### Prerequisites
- Node.js 18+
- Go 1.21+
- Python 3.8+
- Chrome/Edge browser
- AWS account
- MongoDB

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
go mod download
go run main.go
```

### Extension Setup
1. Open Chrome/Edge
2. Go to Extensions page
3. Enable Developer mode
4. Load unpacked extension from the `extension` directory

### Environment Variables
Create `.env` files in respective directories:

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
MONGODB_URI=your_mongodb_uri
```

#### Backend (.env)
```
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
FLASK_SERVER_URL=http://localhost:5000
```


## 👥 Team Members

[Khushi Agarawal](https://github.com/khushiiagrawal)<br/>
[Arpit Srivastava](https://github.com/Arpit529Srivastava)<br/>
[Naman Raj](https://github.com/Denyme24)<br/>
[Shreyansh Pathak](https://github.com/Shrey327?tab=following)<br/>

## 🔒 Security Features
- Protected routes for authenticated users
- Secure image processing
- Environment variable protection
- CORS enabled
- Secure API endpoints








