import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;

  const tagValue =
    slug?.[0] === "all"
      ? undefined
      : slug?.[0];

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: [
      "notes",
      1,
      "",
      tagValue,
    ],
    queryFn: () =>
      fetchNotes(1, "", tagValue),
  });

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <NotesClient
        key={tagValue ?? "all"}
        tag={tagValue}
      />
    </HydrationBoundary>
  );
}
