"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => setStats(data));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <DashboardStats stats={stats} role="admin" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/doctors" className="block p-6 bg-white rounded shadow hover:shadow-lg transition text-gray-900">
                    <h2 className="text-xl font-bold mb-2">Manage Doctors</h2>
                    <p>Add, edit, or remove doctors.</p>
                </Link>
                {/* Add more admin links if needed, e.g. Manage Receptionists */}
            </div>
        </div>
    );
}
