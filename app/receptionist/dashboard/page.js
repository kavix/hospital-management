"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";

export default function ReceptionistDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => setStats(data));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Receptionist Dashboard</h1>

            <DashboardStats stats={stats} role="receptionist" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/receptionist/appointments" className="block p-6 bg-white rounded shadow hover:shadow-lg transition text-gray-900">
                    <h2 className="text-xl font-bold mb-2">Manage Appointments</h2>
                    <p>View, approve, reject, or create appointments.</p>
                </Link>
                <Link href="/receptionist/patients" className="block p-6 bg-white rounded shadow hover:shadow-lg transition text-gray-900">
                    <h2 className="text-xl font-bold mb-2">Manage Patients</h2>
                    <p>Register new patients or update details.</p>
                </Link>
            </div>
        </div>
    );
}
