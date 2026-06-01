import styles from "./LayoutNotes.module.css";

interface Props {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({
  children,
  sidebar,
}: Props) {
  return (
    <div className={styles.layout}>
      {sidebar}
      {children}
    </div>
  );
}
