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
    <Image
      {...props}
      loading="lazy"
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
