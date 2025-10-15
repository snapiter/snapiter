import Image from "next/image";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";

interface SafeImageProps extends React.ComponentProps<typeof Image> {
  src: string;
  alt: string;
  size?: "small" | "medium" | "large";
}

export function SafeImage({
  src,
  alt,
  size = "medium",
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const sizeClass =
    size === "small" ? "text-2xl" : size === "large" ? "text-6xl" : "text-4xl"; // default medium

  if (error) {
    return (
      <div className="absolute inset-0 flex border border-border items-center justify-center bg-background rounded-lg">
        <FaEyeSlash className={`${sizeClass} text-muted`} />
      </div>
    );
  }


  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-muted rounded-lg animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        {...props}
        loading="lazy"
        src={src}
        alt={alt}
        className={`${props.className} ${loading ? "opacity-0" : "opacity-100"}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </>

  );
}
