"use client";

import { useQuery } from "@tanstack/react-query"; // ✅ useQuery замість useSuspenseQuery
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

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, // ✅ дані вже prefetch-нуті на сервері
  });

  // ✅ Стан завантаження
  if (isLoading) {
    return (
      <Modal
        onClose={() => router.back()}
      >
        <div
          className={styles.container}
        >
          <p className={styles.loading}>
            Loading note...
          </p>
        </div>
      </Modal>
    );
  }

  // ✅ Стан помилки
  if (isError || !note) {
    return (
      <Modal
        onClose={() => router.back()}
      >
        <div
          className={styles.container}
        >
          <p className={styles.error}>
            Failed to load note. Please
            try again.
          </p>
        </div>
      </Modal>
    );
  }

  // ✅ Формат дати
  const formattedDate = new Date(
    note.createdAt,
  ).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
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
        {/* ✅ Дата створення */}
        <p className={styles.date}>
          {formattedDate}
        </p>
      </div>
    </Modal>
  );
}
