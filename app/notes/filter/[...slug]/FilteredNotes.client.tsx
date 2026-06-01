"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./NotesPage.module.css";

interface FilteredNotesClientProps {
  tagValue: string | undefined; // ← додати це поле
}

export default function FilteredNotesClient({
  tagValue,
}: FilteredNotesClientProps) {
  const [page, setPage] = useState(1);

  const { data } = useSuspenseQuery({
    queryKey: [
      "notes",
      page,
      "",
      tagValue,
    ],
    queryFn: () =>
      fetchNotes(page, "", tagValue),
  });

  return (
    <div className={styles.container}>
      <NoteList notes={data.notes} />
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
