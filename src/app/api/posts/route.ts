import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import { Post, MediaItem } from "../../../types"; 

// In-memory "database"
const posts: Post[] = [];
let nextId: number = 1;

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function GET(): Promise<NextResponse> {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return NextResponse.json(sortedPosts);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const text = formData.get("text")?.toString() || "";

    // Get all files. The client will send them under the name 'files[]' or multiple 'files' entries.
    // formData.getAll() is crucial here.
    const files = formData.getAll("files") as File[]; // Use 'files' (plural) as the field name

    const uploadedMedia: MediaItem[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        // Ensure it's a valid file object with a name and size
        if (file instanceof File && file.name && file.size > 0) {
          const originalFilename = file.name;
          const extension = path.extname(originalFilename);
          const baseName = path.basename(originalFilename, extension);

          const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_.-]/g, "_");
          // Ensure unique filenames even if multiple files are uploaded in the same millisecond
          const uniqueFilename = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 7)}_${sanitizedBaseName}${extension}`;

          const publicFilePath = path.join(uploadDir, uniqueFilename);

          const fileBuffer = Buffer.from(await file.arrayBuffer());
          await fs.promises.writeFile(publicFilePath, fileBuffer);

          uploadedMedia.push({
            url: `/uploads/${uniqueFilename}`,
            name: originalFilename,
            type: extension.toLowerCase(), // Store the extension (e.g., ".jpg")
          });
        }
      }
    }

    // A post must have either text or at least one media item
    if (!text.trim() && uploadedMedia.length === 0) {
      return NextResponse.json(
        { error: "Post cannot be empty. Please add text or select files." },
        { status: 400 }
      );
    }

    const newPost: Post = {
      id: nextId++,
      user: "DemoUser", 
      text: text,
      media: uploadedMedia, // Assign the array of MediaItem
      timestamp: new Date().toISOString(),
    };

    posts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error processing POST request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error processing upload", details: errorMessage },
      { status: 500 }
    );
  }
}
