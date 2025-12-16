"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PatientDashboard() {
    const { data: session } = useSession();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/patient/appointments" className="card block p-6 hover-lift text-on-card">
                    <h2 className="text-xl font-bold mb-2">My Appointments</h2>
                    <p className="text-secondary">Book new appointments or view history.</p>
                </Link>
                <Link href="/patient/profile" className="card block p-6 hover-lift text-on-card">
                    <h2 className="text-xl font-bold mb-2">My Profile</h2>
                    <p className="text-secondary">Edit your personal details.</p>
                </Link>
            </div>
        </div>
    );
}
