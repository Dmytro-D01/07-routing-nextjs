"use client";

import {
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useState,
  useEffect,
} from "react";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
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
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data } = useSuspenseQuery({
    queryKey: [
      "notes",
      page,
      debouncedSearch,
      tag,
    ],
    queryFn: () =>
      fetchNotes(
        page,
        debouncedSearch,
        tag,
      ),
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({
      queryKey: ["notes"],
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search notes..."
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

      {data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />

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
