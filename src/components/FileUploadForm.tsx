"use client";

import { useState, ChangeEvent, FormEvent, JSX, useRef } from "react";
import { useRouter } from "next/navigation";

export default function FileUploadForm(): JSX.Element {
  const [text, setText] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files);

      // Merge new files with existing ones, preventing duplicates based on name, size, and lastModified
      setSelectedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles]; // Start with the current selection

        newFilesArray.forEach((newFile) => {
          if (
            !updatedFiles.some(
              (existingFile) =>
                existingFile.name === newFile.name &&
                existingFile.size === newFile.size &&
                existingFile.lastModified === newFile.lastModified
            )
          ) {
            updatedFiles.push(newFile);
          }
        });
        return updatedFiles;
      });
    }
    // IMPORTANT: Reset the input value.
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveFile = (fileNameToRemove: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileNameToRemove)
    );
    // If all files are removed, also clear the native input's value
    if (
      selectedFiles.filter((file) => file.name !== fileNameToRemove).length ===
        0 &&
      fileInputRef.current
    ) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !text.trim()) {
      setError("Please add some text or select at least one file.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("text", text);

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      setText("");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "20px", padding: "15px", background: "#111111" }}
    >
      <div>
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          rows={2}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            boxSizing: "border-box",
            color: "#ffffff",
            border: "1px solid white",
            borderRadius: "5px",
          }}
        />
      </div>
      <div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{
            marginBottom: "10px",
            color: "white",
            border: "1px solid white",
            borderRadius: "5px",
            padding: "2px",
            width: "100%",
          }}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div
          style={{
            marginBottom: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "0px",
          }}
        >
          <p className="text-[#0cc20c] font-bold mt-0 text-lg">
            Selected files:
          </p>
          <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0 }}>
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                style={{
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                  padding: "5px",
                  background: "#121456",
                  borderRadius: "3px",
                }}
              >
                <span>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  title={`Remove ${file.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sample-image/x.png"
                    alt="x"
                    width={20}
                    height={20}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full text-white text-lg rounded-md py-2 px-3 bg-[#198412] hover:bg-[green] font-bold  ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
