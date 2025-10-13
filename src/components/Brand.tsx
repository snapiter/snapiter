import Image from "next/image";
import Link from "next/link";

export default function Brand() {
  return (
    <Link
      href="https://snapiter.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center hover:opacity-80 transition-opacity duration-200"
    >
      <Image
        src="/logo.svg"
        alt="SnapIter Logo"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span className="text-xs font-semibold text-primary">SnapIter</span>
    </Link>
  );
}
