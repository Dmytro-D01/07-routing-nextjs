import { redirect } from "next/navigation";

export default async function NotesPage() {
  redirect("/notes/filter/all");
}
