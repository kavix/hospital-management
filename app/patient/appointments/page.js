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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Appointments</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {showForm ? "Cancel" : "Book Appointment"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8">
                    <AppointmentForm onSubmit={handleCreateAppointment} patientId={session?.user?.id} />
                </div>
            )}

            <div>
                {appointments.map((app) => (
                    <AppointmentCard
                        key={app._id}
                        appointment={app}
                        role="patient"
                    />
                ))}
                {appointments.length === 0 && <p>No appointments found.</p>}
            </div>
        </div>
    );
}
