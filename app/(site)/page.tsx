import React from "react";

export default function Page() {
  return (
    <div>
      <nav className="flex justify-between items-center p-4">
        <div className="text-2xl font-bold">Logo</div>
        <div className="flex items-center space-x-4">
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
      </nav>

      <main className="p-4">
        <h1 className="text-4xl font-bold">Welcome to our site</h1>
        <p className="text-lg mt-4">
          This is a simple Next.js site with Firebase Authentication
        </p>
      </main>
    </div>
  );
}
