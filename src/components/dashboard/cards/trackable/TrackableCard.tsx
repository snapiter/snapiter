import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import type { Trackable } from "@/store/atoms";

export default function TrackableCard({ t }: { t: Trackable }) {
  return (
    <li key={t.name}>
      <Link
        href={`/dashboard/trackables/${t.trackableId}`}
        className="flex items-center justify-between p-4 border border-border rounded-lg bg-background 
                   transition hover:border-primary"
      >
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="text-sm text-muted">{t.hostName}</p>
        </div>
        <FaArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-1" />
      </Link>
    </li>
  );
}
