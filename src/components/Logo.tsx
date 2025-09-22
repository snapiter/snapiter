import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

const sizeMap: Record<LogoSize, { w: number; h: number; className: string }> = {
  sm: { w: 24, h: 24, className: "w-6 h-6" },
  md: { w: 32, h: 32, className: "w-8 h-8" },
  lg: { w: 40, h: 40, className: "w-10 h-10" },
};

export default function Logo({ size = "sm" }: { size?: LogoSize }) {
  const { w, h, className } = sizeMap[size];

  return (
    <Image
      src="/logo.svg"
      alt="SnapIter Logo"
      width={w}
      height={h}
      className={className}
    />
  );
}
