"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>
        Something went wrong loading
        notes.
      </p>
      <button onClick={reset}>
        Try again
      </button>
    </div>
  );
}
