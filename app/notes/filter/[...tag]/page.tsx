import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import FilteredNotesClient from "./FilteredNotes.client";

interface FilteredNotesPageProps {
  params: Promise<{ tag: string[] }>;
}

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { tag } = await params;

  // "all" means no tag filter — don't pass tag to the backend
  const tagValue =
    tag?.[0] === "all"
      ? undefined
      : tag?.[0];

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
        tag={tagValue}
      />
    </HydrationBoundary>
  );
}
