"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center">
      {session ? (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => signOut()}
        >
          Logout
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-rose-600 text-white rounded"
          onClick={() => signIn("google")}
        >
          Get Started!
        </button>
      )}
    </div>
  );
}
