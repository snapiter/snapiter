"use client";
import ActionCard from "./ActionCard";
import { FaQrcode } from "react-icons/fa6";
import Modal from "../layout/Modal";
import { QuickCreateRes } from "@/store/atoms";
import { useState } from "react";
import { useCreateDevice } from "@/hooks/dashboard/useCreateDevice";
import { useQueryClient } from "@tanstack/react-query";

interface AddPhoneCardProps {
    trackableId: string;
}

export default function AddPhoneCard({ trackableId }: AddPhoneCardProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<QuickCreateRes | null>(null);
    const createDevice = useCreateDevice();

    const queryClient = useQueryClient();

    function handleClose() {
        setModalOpen(false);
        queryClient.invalidateQueries({
            queryKey: ["devices", trackableId],
        });
    }
    async function addPhone() {
        const res = await createDevice.mutateAsync({ trackableId });
        setModalContent(res);
        setModalOpen(true);
    }

    return (
        <>
            <Modal open={modalOpen} onClose={handleClose}>
                {modalContent && modalContent.qrDataUrl && (
                    <div className="flex flex-col items-center gap-4 p-6">
                        <h2 className="text-lg font-semibold">Scan this QR with your phone</h2>
                        <img
                            src={modalContent.qrDataUrl}
                            alt="QR code"
                            className="w-62 h-62"
                        />
                    </div>
                )}

            </Modal>
            <ActionCard
                onClick={addPhone}
                icon={<FaQrcode className="w-24 h-24" />}
                title="Add a Phone"
                description="Scan a QR code to register your phone instantly"
            />
        </>
    );
}
