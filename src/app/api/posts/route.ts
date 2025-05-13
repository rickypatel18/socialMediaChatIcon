// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import { Post } from   "../../../types/index" // Adjust path if you created types/index.ts

// In-memory "database"
const posts: Post[] = [];
let nextId: number = 1;

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function GET(): Promise<NextResponse> {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return NextResponse.json(sortedPosts);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try { 
    const formData = await request.formData();
    const text = formData.get('text')?.toString() || '';
    const file = formData.get('file') as File | null; // Type assertion for File

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileType: string | null = null;

    if (file && file.name) {
      const originalFilename = file.name;
      const extension = path.extname(originalFilename);
      const baseName = path.basename(originalFilename, extension);
      const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const uniqueFilename = `${Date.now()}_${sanitizedBaseName}${extension}`;
      
      const publicFilePath = path.join(uploadDir, uniqueFilename);

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(publicFilePath, fileBuffer);

      fileUrl = `/uploads/${uniqueFilename}`;
      fileName = originalFilename;
      fileType = extension.toLowerCase();
    }

    const newPost: Post = {
      id: nextId++,
      user: 'DemoUser', // Mock user
      text: text,
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
      timestamp: new Date().toISOString(),
    };

    posts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error('Error processing POST request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Error processing upload', details: errorMessage }, { status: 500 });
  }
}