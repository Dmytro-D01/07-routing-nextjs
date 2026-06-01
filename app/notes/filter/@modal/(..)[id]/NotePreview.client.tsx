"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({
  id,
}: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  function handleClose() {
    router.back();
  }

  if (isLoading) return null;
  if (error || !note) return null;

  return (
    <Modal onClose={handleClose}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>
            {note.tag}
          </span>
        </div>
        <p className={css.content}>
          {note.content}
        </p>
        <p className={css.date}>
          {new Date(
            note.createdAt,
          ).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
        </p>
        <button
          className={css.backBtn}
          onClick={handleClose}
        >
          ← Back to notes
        </button>
      </div>
    </Modal>
  );
}
