"use client";
import { OutlineButton } from "@snapiter/designsystem";
import { useRouter } from "next/navigation";
import { FaRightFromBracket } from "react-icons/fa6";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/dashboard/api/auth/logout", { method: "POST" });
    router.push("/dashboard/auth");
  };

  return (
    <OutlineButton icon={<FaRightFromBracket className="w-4 h-4" />} text="Logout" onClick={handleLogout} />
  );
}
