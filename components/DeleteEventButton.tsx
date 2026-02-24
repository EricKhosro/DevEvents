"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BaseUrl } from "@/shared/utils/env.utils";
import Button from "@/components/base/Button";
import Image from "next/image";

interface DeleteEventButtonProps {
  slug: string;
}

const DeleteEventButton = ({ slug }: DeleteEventButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/api/events/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to delete event");
      }

      toast.success(data?.message ?? "Event deleted");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute right-3 top-3 z-10 w-10">
      <Button
        style="transparent"
        onClick={handleDelete}
        loading={isLoading}
        text={
          <Image
            src="/icons/delete.svg"
            alt="delete"
            width={16}
            height={16}
            className="h-8 w-8"
          />
        }
      />
    </div>
  );
};

export default DeleteEventButton;
