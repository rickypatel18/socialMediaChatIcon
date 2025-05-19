import { JSX } from "react";
import { Post, MediaItem } from "../types";
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
    case ".aac":
    case ".opus":
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
      // Handle cases where extension might already have a dot or not
      const cleanExtension = extension.startsWith(".") ? extension.substring(1) : extension;
      return `${cleanExtension.toUpperCase()} File`;
  }
};

interface SingleMediaDisplayProps {
  mediaItem: MediaItem;
}

// This component now displays a single media item from the post's media array
const SingleMediaDisplay = ({
  mediaItem,
}: SingleMediaDisplayProps): JSX.Element | null => {
  const { type, name, url } = mediaItem;

  const commonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#858181",
    gap: "10px",
    marginTop: "10px",
  };

  if (!type || !url) return null;

  // Use the 'type' (extension) directly for the switch
  switch (type.toLowerCase()) {
    case ".pdf":
      return (
        <div style={commonStyle}>
          <span>
            <Image
              src="/sample-image/pdf-removebg-preview.png"
              alt="PDF icon"
              height={50}
              width={50}
              style={{
                height: "auto",
                width: "auto",
              }}
            />
          </span>
          <div>
            <strong>{getFileTypeDisplayName(type)}</strong>
            <br />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              download={name}
              style={{ color: "white" }}
            >
              {name}
            </a>
          </div>
        </div>
      );

    case ".mp3":
    case ".wav":
    case ".ogg":
    case ".aac":
    case ".opus":
      return (
        <div style={commonStyle}>
          <span>
            <Image
              src="/sample-image/Music_logo-removebg-preview.png"
              alt="Music icon"
              width={55}
              height={55}
            />
          </span>
          <div className="w-[100%]">
            <strong>{getFileTypeDisplayName(type)}</strong>
            <br />
            <span style={{ color: "white" }}>{name}</span>
            <audio
              controls
              src={url}
              style={{ width: "100%", marginTop: "5px", height: "50px" }}
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
        <div
          style={{
            ...commonStyle,
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span>
              <Image
                src="/sample-image/dummy-post-removebg-preview.png"
                alt="Image file icon"
                width={55}
                height={55}
              />
            </span>
            <div>
              <strong>{getFileTypeDisplayName(type)}</strong>
              <br />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download={name}
                style={{ color: "white" }}
              >
                {name}
              </a>
            </div>
          </div>
          {/* <Image
            src={url}
            alt={name || "Uploaded image"}
            width={200}
            height={300}
            style={{
              objectFit: "contain",
              marginTop: "10px",
              borderRadius: "4px",
              width:"auto",
              height:"auto",
              maxWidth: "100%",
              maxHeight: "300px",
            }}
          /> */}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={name || "Uploaded image"}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              objectFit: "contain",
              marginTop: "10px",
              borderRadius: "4px",
            }}
          />
        </div>
      );

    case ".mp4":
    case ".mov":
    case ".avi":
      return (
        <div
          style={{
            ...commonStyle,
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span>
              <Image
                src="/sample-image/video-removebg-preview.png"
                alt="Video file icon"
                width={55}
                height={55}
              />{" "}
              {/* Replace with a video icon */}
            </span>
            <div>
              <strong>{getFileTypeDisplayName(type)}</strong>
              <br />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download={name}
                style={{ color: "white" }}
              >
                {name}
              </a>
            </div>
          </div>
          <video
            controls
            src={url}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              marginTop: "10px",
              borderRadius: "4px",
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );

    default:
      return (
        <div style={commonStyle}>
          <span>
            <Image
              src="/sample-image/file-removebg-preview.png"
              alt="Generic file icon"
              width={55}
              height={55}
            />
          </span>
          <div>
            <strong>{getFileTypeDisplayName(type)}</strong>
            <br />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              download={name}
              style={{ color: "white" }}
            >
              {name}
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
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "5px",
        background: "#2c2929",
      }}
    >
      <p style={{ color: "white" }}>
        {" "}
        <strong>{post.user}</strong>{" "}
        <span style={{ fontSize: "0.8em", color: "#aaa" }}>
          {" "}
          - {new Date(post.timestamp).toLocaleString()}
        </span>
      </p>
      {post.text && <p className="text-[green]">{post.text}</p>}

      {/* Iterate over the media array and render SingleMediaDisplay for each item */}
      {post.media && post.media.length > 0 && (
        <div className="media-gallery" style={{ marginTop: "10px" }}>
          {post.media.map((mediaItem, index) => (
            <SingleMediaDisplay
              key={`${post.id}-media-${index}`}
              mediaItem={mediaItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
