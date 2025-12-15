"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") router.push("/admin/dashboard");
      else if (session.user.role === "receptionist") router.push("/receptionist/dashboard");
      else if (session.user.role === "doctor") router.push("/doctor/appointments");
      else if (session.user.role === "patient") router.push("/patient/dashboard");
    }
  }, [status, session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Hospital Management System</h1>
      <p className="text-xl mb-8">Please login to continue</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors">Login</Link>
        <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors">Register</Link>
      </div>
    </div>
  );
}
