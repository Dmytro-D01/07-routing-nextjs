"use client";

import {
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import styles from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string | undefined;
}

export default function NotesClient({
  tag,
}: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] =
    useState("");
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery({
    queryKey: [
      "notes",
      page,
      search,
      tag,
    ],
    queryFn: () =>
      fetchNotes(page, search, tag),
    retry: false,
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({
      queryKey: ["notes"],
    });
  };

  const handleSearch = (
    query: string,
  ) => {
    setSearch(query);
    setPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <SearchBox
          value={search}
          onSearch={handleSearch}
        />
        <button
          className={styles.addButton}
          onClick={() =>
            setIsModalOpen(true)
          }
        >
          + Add note
        </button>
      </div>

      {data.notes.length > 0 ? (
        <>
          <NoteList
            notes={data.notes}
          />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p className={styles.noNotes}>
          No notes found.
        </p>
      )}

      {isModalOpen && (
        <Modal
          onClose={handleModalClose}
        >
          <NoteForm
            onClose={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
}
