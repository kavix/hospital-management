"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PatientDashboard() {
    const { data: session } = useSession();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/patient/appointments" className="block p-6 bg-white rounded shadow hover:shadow-lg transition text-gray-900">
                    <h2 className="text-xl font-bold mb-2">My Appointments</h2>
                    <p>Book new appointments or view history.</p>
                </Link>
                <Link href="/patient/profile" className="block p-6 bg-white rounded shadow hover:shadow-lg transition text-gray-900">
                    <h2 className="text-xl font-bold mb-2">My Profile</h2>
                    <p>Edit your personal details.</p>
                </Link>
            </div>
        </div>
    );
}
