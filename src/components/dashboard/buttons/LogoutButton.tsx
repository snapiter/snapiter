"use client";
import { useRouter } from "next/navigation";
import { FaRightFromBracket } from "react-icons/fa6";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/dashboard/api/auth/logout", { method: "POST" });
    router.push("/dashboard/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full  cursor-pointer gap-2 px-4 py-2 rounded-md bg-background text-foreground font-medium hover:bg-surface transition"
    >
      <FaRightFromBracket className="w-4 h-4" />
      <span className="hidden md:block">Logout</span>
    </button>
  );
}
