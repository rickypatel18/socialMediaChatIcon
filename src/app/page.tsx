import { JSX } from "react";
import FileUploadForm from "../components/FileUploadForm";
import PostCard from "../components/PostCard";
import { Post } from "../types"; 

async function getPosts(): Promise<Post[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/posts`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch posts:",
        response.status,
        await response.text()
      );
      return [];
    }
    return response.json() as Promise<Post[]>; 
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
  }
}

export default async function HomePage(): Promise<JSX.Element> {
  const posts: Post[] = await getPosts();

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "0 15px" }}>
      <h1 className="text-2xl">Mini Social File Share (App Router - TS)</h1>

      <FileUploadForm />

      <h2>Feed</h2>
      {posts && posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts yet. Be the first!</p>
      )}
    </div>
  );
}
