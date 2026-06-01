import css from "./LayoutNotes.module.css";

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}

export default function FilterLayout({
  children,
  sidebar,
  modal,
}: FilterLayoutProps) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      <div className={css.notesWrapper}>
        {children}
      </div>
      {modal}
    </div>
  );
}
