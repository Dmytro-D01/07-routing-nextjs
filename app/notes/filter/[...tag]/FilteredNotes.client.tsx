"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";

interface FilteredNotesClientProps {
  tag?: string;
}

export default function FilteredNotesClient({
  tag,
}: FilteredNotesClientProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } =
    useQuery({
      queryKey: [
        "notes",
        page,
        "",
        tag,
      ],
      queryFn: () =>
        fetchNotes(page, "", tag),
      placeholderData: (prev) => prev,
      refetchOnMount: false,
    });

  if (isLoading)
    return (
      <p>Loading, please wait...</p>
    );
  if (error)
    return (
      <p>
        Could not fetch the list of
        notes.{" "}
        {(error as Error).message}
      </p>
    );

  return (
    <div className={css.app}>
      {data && data.notes.length > 0 ? (
        <>
          <NoteList
            notes={data.notes}
          />
          {data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={
                data.totalPages
              }
              onPageChange={(newPage) =>
                setPage(newPage)
              }
            />
          )}
        </>
      ) : (
        <p>
          No notes found for this tag.
        </p>
      )}
    </div>
  );
}
