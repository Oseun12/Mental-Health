"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import Image from "next/image";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-screen-sm p-6 bg-white rounded-lg shadow-md">
        <div className="max-w-md mx-auto py-10">
          <div className="flex justify-center">
            <Image
              src="/image/logo.PNG"
              alt="logo image"
              width={160}
              height={60}
              priority
              className="mx-auto"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="First name "
                className="w-full p-2 border rounded-md mb-4"
              />
              {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Surname"
                className="w-full p-2 border rounded-md mb-4"
              />
              {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className="w-full p-2 border rounded-md mb-4"
              />
              {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
            </div>

            {/* <div className="mt-3">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className="w-full p-2 border rounded-md mb-4"
              />
              {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
            </div> */}

            <button
              type="submit"
              className="w-full mt-4 p-2 bg-rose-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have an account? <Link href="/signin" className="text-blue-600">Sign in</Link>
          </p>

          <span className="flex items-center mt-6 text-gray-400">
            <span className="h-px flex-1 bg-gray-400"></span>
            <span className="shrink-0 px-6">OR</span>
            <span className="h-px flex-1 bg-gray-400"></span>
          </span>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard/dashboard" })}
              className="flex items-center gap-3 border p-3 rounded-md w-full justify-center hover:bg-gray-200 transition"
            >
              <FcGoogle size={24} /> 
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
