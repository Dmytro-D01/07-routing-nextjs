import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "Simple and efficient application for managing personal notes",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <div className="app-wrapper">
            <Header />
            <main className="main-content">
              {children}
            </main>
            {modal}
            <Footer />
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}
