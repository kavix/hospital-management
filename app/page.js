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
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="hero-shell w-full max-w-5xl p-10 md:p-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-blue-800 text-sm font-semibold">
              <span>Hospital OS</span>
              <span className="text-xs text-blue-600">Appointments · Teams · Patients</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Coordinate care, schedules, and patient journeys in one place.
            </h1>
            <p className="text-lg text-secondary">
              Secure role-based dashboards for admins, doctors, receptionists, and patients with live appointment tracking and tokens.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-md font-semibold shadow-sm">Login</Link>
              <Link href="/register" className="bg-white/90 hover:bg-white text-blue-700 px-5 py-3 rounded-md font-semibold shadow-sm border border-blue-100">Register as Patient</Link>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="pill pill-info">Role-aware navigation</div>
              <div className="pill pill-success">Fast token printing</div>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl text-on-card shadow-lg subtle-border">
            <h3 className="text-xl font-bold mb-4">What you can do</h3>
            <ul className="space-y-3 text-secondary list-disc list-inside">
              <li>Admins manage doctors and system stats.</li>
              <li>Receptionists approve and schedule appointments quickly.</li>
              <li>Doctors track daily slots and mark visits completed.</li>
              <li>Patients book, view tokens, and update their profile.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
