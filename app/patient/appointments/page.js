"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppointmentCard from "@/components/AppointmentCard";
import AppointmentForm from "@/components/AppointmentForm";

export default function PatientAppointments() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchAppointments();
        }
    }, [session]);

    const fetchAppointments = async () => {
        const res = await fetch(`/api/appointments?patientId=${session.user.id}`);
        const data = await res.json();
        setAppointments(data);
    };

    const handleCreateAppointment = async (formData) => {
        const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Appointment Booked Successfully! Your Token Number is: ${data.appointment.tokenNumber}`);
            setShowForm(false);
            fetchAppointments();
        } else {
            alert("Failed to book appointment: " + data.message);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                    <p className="text-sm text-secondary font-semibold uppercase">Appointments</p>
                    <h1 className="text-3xl font-bold">Your visits and tokens</h1>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                >
                    {showForm ? "Close form" : "Book appointment"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 card p-5">
                    <AppointmentForm onSubmit={handleCreateAppointment} patientId={session?.user?.id} />
                </div>
            )}

            <div className="list-shell">
                <div className="list-header">
                    <h2 className="text-lg font-semibold text-primary">Upcoming & past</h2>
                    <span className="pill pill-neutral">{appointments.length} total</span>
                </div>
                <div className="p-4">
                    {appointments.length === 0 && (
                        <div className="empty-state">
                            No appointments yet. Book your first visit to get a token.
                        </div>
                    )}
                    {appointments.map((app) => (
                        <AppointmentCard
                            key={app._id}
                            appointment={app}
                            role="patient"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
