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
            <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
            <div>
                {appointments.map((app) => (
                    <AppointmentCard
                        key={app._id}
                        appointment={app}
                        onStatusChange={handleStatusChange}
                        role="doctor"
                    />
                ))}
                {appointments.length === 0 && <p>No appointments found.</p>}
            </div>
        </div>
    );
}
