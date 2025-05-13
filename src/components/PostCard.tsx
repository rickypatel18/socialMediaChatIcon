import { JSX } from "react";
import { Post } from "../types"; // Adjust path if you created types/index.ts
import Image from "next/image";

const getFileTypeDisplayName = (extension: string | null): string => {
  if (!extension) return "File";
  switch (extension.toLowerCase()) {
    case ".pdf":
      return "PDF Document";
    case ".doc":
    case ".docx":
      return "Word Document";
    case ".xls":
    case ".xlsx":
      return "Excel Spreadsheet";
    case ".ppt":
    case ".pptx":
      return "PowerPoint Presentation";
    case ".txt":
      return "Text File";
    case ".zip":
    case ".rar":
      return "Archive File";
    case ".mp3":
    case ".wav":
    case ".ogg":
      return "Audio File";
    case ".mp4":
    case ".mov":
    case ".avi":
      return "Video File";
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
      return "Image File";
    default:
      return `${extension.toUpperCase().substring(1)} File`;
  }
};

interface FileTypeDisplayProps {
  fileType: string;
  fileName: string;
  fileUrl: string;
}

const FileTypeDisplay = ({
  fileType,
  fileName,
  fileUrl,
}: FileTypeDisplayProps): JSX.Element | null => {
  const commonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "4px",
    backgroundColor: "#051042",
    gap: "10px",
    marginTop: "10px",
  };

  if (!fileType || !fileUrl) return null;

  switch (fileType.toLowerCase()) {
    case ".pdf":
      return (
        <div style={commonStyle}>
          <span>
            <Image src="/sample-image/pdf.jpg" alt="" height={50} width={50} />
          </span>
          <div>
            <strong>{getFileTypeDisplayName(fileType)}</strong>
            <br />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName}
            >
              {fileName}
            </a>
          </div>
        </div>
      );
    case ".mp3":
    case ".wav":
    case ".ogg":
      return (
        <div style={commonStyle}>
          <span>
            <Image
              src="/sample-image/Music_logo.png"
              alt=""
              width={55}
              height={55}
            />
          </span>
          <div>
            <strong>{getFileTypeDisplayName(fileType)}</strong>
            <br />
            <span>{fileName}</span>
            <audio
              controls
              src={fileUrl}
              style={{ width: "100%", marginTop: "5px" }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      );
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
      return (
        <div style={{ ...commonStyle, alignItems: "flex-start" }}>
          <span>
            <Image
              src="/sample-image/dummy-post.jpg"
              alt="image"
              width={55}
              height={55}
            />
          </span>
          <div>
            <strong>{getFileTypeDisplayName(fileType)}</strong>
            <br />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName}
            >
              {fileName}
            </a>
            <img
              src={fileUrl}
              alt={fileName || "Uploaded image"}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                backgroundSize: "cover",
                marginTop: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>
      );
    default:
      return (
        <div style={commonStyle}>
          <span>
             <Image
              src="/sample-image/folder.png"
              alt="image"
              width={55}
              height={55}
            />
          </span>
          <div>
            <strong>{getFileTypeDisplayName(fileType)}</strong>
            <br />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName}
            >
              {fileName}
            </a>
          </div>
        </div>
      );
  }
};

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps): JSX.Element | null {
  if (!post) return null;
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "5px",
        background: "#000",
      }}
    >
      <p>
        <strong>{post.user}</strong>{" "}
        <span style={{ fontSize: "0.8em", color: "#777" }}>
          {" "}
          - {new Date(post.timestamp).toLocaleString()}
        </span>
      </p>
      {post.text && <p className="text-[green]">{post.text}</p>}
      {post.fileUrl &&
        post.fileType &&
        post.fileName && ( // Ensure fileName is also present
          <FileTypeDisplay
            fileType={post.fileType}
            fileName={post.fileName}
            fileUrl={post.fileUrl}
          />
        )}
    </div>
  );
}
