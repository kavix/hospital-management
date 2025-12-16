"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppointmentCard from "@/components/AppointmentCard";

export default function DoctorAppointments() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchAppointments();
        }
    }, [session]);

    const fetchAppointments = async () => {
        const res = await fetch(`/api/appointments?doctorId=${session.user.id}`);
        const data = await res.json();
        setAppointments(data);
    };

    const handleStatusChange = async (id, status) => {
        await fetch(`/api/appointments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchAppointments();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase">Doctor view</p>
                    <h1 className="text-3xl font-bold">Scheduled patients</h1>
                </div>
                <span className="pill pill-info">{appointments.length} appointments</span>
            </div>
            <div className="list-shell">
                <div className="list-header">
                    <span className="text-primary font-semibold">Today & upcoming</span>
                </div>
                <div className="p-4">
                    {appointments.length === 0 && <div className="empty-state">No appointments found.</div>}
                    {appointments.map((app) => (
                        <AppointmentCard
                            key={app._id}
                            appointment={app}
                            onStatusChange={handleStatusChange}
                            role="doctor"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
