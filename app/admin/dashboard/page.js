"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => setStats(data));
    }, []);

    // Prepare data for charts
    const appointmentData = stats?.graphData?.appointmentsByDate?.map(item => ({
        date: item._id,
        count: item.count
    })) || [];

    const userData = stats?.graphData?.userDistribution?.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count
    })) || [];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <DashboardStats stats={stats} role="admin" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4 text-on-card">Appointments (Last 7 Days)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={appointmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="date" stroke="var(--color-ink)" />
                                <YAxis stroke="var(--color-ink)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                                />
                                <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4 text-on-card">User Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {userData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/doctors" className="card block p-6 hover-lift text-on-card">
                    <h2 className="text-xl font-bold mb-2">Manage Doctors</h2>
                    <p className="text-secondary">Add, edit, or remove doctors.</p>
                </Link>
                <Link href="/admin/receptionists" className="card block p-6 hover-lift text-on-card">
                    <h2 className="text-xl font-bold mb-2">Manage Receptionists</h2>
                    <p className="text-secondary">Add, edit, or remove receptionists.</p>
                </Link>
            </div>
        </div>
    );
}
