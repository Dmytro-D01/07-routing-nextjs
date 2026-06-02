"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api/notes";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import css from "./Notes.client.module.css";

interface NotesClientProps {
  tag?: string;
  basePath?: string;
}

export default function NotesClient({
  tag,
  basePath = "/notes",
}: NotesClientProps) {
  const router = useRouter();
  const [search, setSearch] =
    useState("");
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const { data, isLoading, error } =
    useQuery({
      queryKey: [
        "notes",
        page,
        debouncedSearch,
        tag ?? "all",
      ],
      queryFn: () =>
        fetchNotes(
          page,
          debouncedSearch,
          tag,
        ),
      placeholderData: (prev) => prev,
      refetchOnMount: false,
    });

  const handleSearch =
    useDebouncedCallback(
      (query: string) => {
        if (query === debouncedSearch)
          return;
        setDebouncedSearch(query);
        setPage(1);
        router.push(
          `${basePath}?search=${encodeURIComponent(query)}&page=1`,
        );
      },
      500,
    );

  function handleSearchChange(
    query: string,
  ) {
    setSearch(query);
    handleSearch(query);
  }

  function handlePageChange(
    newPage: number,
  ) {
    setPage(newPage);
    router.push(
      `${basePath}?search=${encodeURIComponent(debouncedSearch)}&page=${newPage}`,
    );
  }

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
    <div className={css.page}>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onSearch={handleSearchChange}
        />
        <button
          className={css.addButton}
          onClick={() =>
            setIsFormOpen(true)
          }
        >
          + New Note
        </button>
      </div>

      {data &&
        data.notes.length > 0 && (
          <NoteList
            notes={data.notes}
          />
        )}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={
            handlePageChange
          }
        />
      )}

      {isFormOpen && (
        <Modal
          onClose={() =>
            setIsFormOpen(false)
          }
        >
          <NoteForm
            onClose={() =>
              setIsFormOpen(false)
            }
          />
        </Modal>
      )}
    </div>
  );
}
