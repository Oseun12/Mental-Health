"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

interface SignInForm {
  email: string;
  password: string;
}

export default function SigninPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard/dashboard",
      });

      if (res?.error) {
        throw new Error("Invalid email or password");
      }

      router.push("/dashboard/dashboard"); 
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-screen-md p-6 bg-white rounded-lg shadow-md">
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
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-2 border rounded-md mb-4"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full p-2 border rounded-md mb-4"
              />
              {errors.password?.message && (
                <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 p-2 bg-rose-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Don’t have an account? <Link href="/signup" className="text-blue-600">Sign up</Link>
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
