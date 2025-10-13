"use client";

export default function ErrorComponent({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-error mb-3">
          Oops… we couldn’t load your trips
        </h2>
        <p className="text-muted mb-6">
          {message ||
            "Looks like this journey took a little detour. Please try again in a moment."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
