"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      router.push("/signin");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: 6 })}
              className="w-full p-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account? <Link href="/signin" className="text-blue-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
