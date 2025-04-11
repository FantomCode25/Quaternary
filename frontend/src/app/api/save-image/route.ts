import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData } = body;
    
    // Generate a unique filename using timestamp
    const timestamp = new Date().getTime();
    const filename = `captured-image-${timestamp}.jpg`;
    
    // Convert base64 data to buffer
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Define the path to save the file
    const publicDir = path.join(process.cwd(), 'public', 'captured-images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write the file
    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);
    
    // Return the URL path to access the image
    const imageUrl = `/captured-images/${filename}`;
    
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save image' },
      { status: 500 }
    );
  }
}