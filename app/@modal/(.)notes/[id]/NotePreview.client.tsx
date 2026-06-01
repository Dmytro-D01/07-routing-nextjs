"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import styles from "./NotePreview.module.css";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreview({
  id,
}: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note } =
    useSuspenseQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });

  return (
    <Modal
      onClose={() => router.back()}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>
          {note.title}
        </h2>
        <p className={styles.content}>
          {note.content}
        </p>
        {note.tag && (
          <span className={styles.tag}>
            {note.tag}
          </span>
        )}
      </div>
    </Modal>
  );
}
