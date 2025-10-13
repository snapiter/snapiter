"use client";

import { useState } from "react";
import { FaKey } from "react-icons/fa6";
import { useCreateDevice } from "@/hooks/dashboard/useCreateDevice";
import type { QuickCreateRes } from "@/store/atoms";
import Modal from "../layout/Modal";
import ActionCard from "./ActionCard";

interface AddTokenCardProps {
  trackableId: string;
}

export default function AddTokenCard({ trackableId }: AddTokenCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<QuickCreateRes | null>(null);

  const createDevice = useCreateDevice();

  async function addToken() {
    const res = await createDevice.mutateAsync({ trackableId });
    setModalContent(res);
    setModalOpen(true);
  }

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalContent?.deviceToken && (
          <div className="flex flex-col items-center gap-4 p-6">
            <h2 className="text-lg font-semibold">Your Device Token</h2>
            <p className="text-sm text-muted">
              Copy this token and share it with other devices to register them.
              It is only shown once
            </p>
            <code className="px-3 py-2 rounded bg-surface border border-border text-sm">
              {modalContent.deviceToken}
            </code>
          </div>
        )}
      </Modal>
      <ActionCard
        onClick={addToken}
        icon={<FaKey className="w-24 h-24" />}
        title="Create Token"
        description="Generate a token for other devices"
      />
    </>
  );
}
