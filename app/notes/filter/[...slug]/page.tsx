import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import FilteredNotesClient from "./FilteredNotes.client";

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>; // ← було tag: string[]
}

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params; // ← було { tag }

  // "all" означає без фільтра — не передаємо tag у бекенд
  const tagValue =
    slug?.[0] === "all"
      ? undefined
      : slug?.[0];

  const queryClient = new QueryClient();

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
      <FilteredNotesClient
        tagValue={tagValue}
      />
    </HydrationBoundary>
  );
}
