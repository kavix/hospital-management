"use client";
import { useState, useEffect } from "react";
import UserForm from "@/components/UserForm";
import AppointmentForm from "@/components/AppointmentForm";

export default function ManagePatients() {
    const [patients, setPatients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [bookingPatient, setBookingPatient] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const res = await fetch("/api/users?role=patient");
        const data = await res.json();
        setPatients(data);
    };

    const handleCreatePatient = async (formData) => {
        const url = editingPatient ? `/api/users/${editingPatient._id}` : "/api/users";
        const method = editingPatient ? "PUT" : "POST";

        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        setShowForm(false);
        setEditingPatient(null);
        fetchPatients();
    };

    const handleDeletePatient = async (id) => {
        if (confirm("Are you sure?")) {
            await fetch(`/api/users/${id}`, { method: "DELETE" });
            fetchPatients();
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setShowForm(true);
        setBookingPatient(null);
    };

    const handleBookAppointment = async (formData) => {
        const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Appointment Booked Successfully! Token Number: ${data.appointment.tokenNumber}`);
            setBookingPatient(null);
        } else {
            alert("Failed to book appointment: " + data.message);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase">Reception</p>
                    <h1 className="text-3xl font-bold">Manage Patients</h1>
                    <p className="text-secondary">Register, edit, or book on behalf of patients.</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingPatient(null); setBookingPatient(null); }}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                >
                    {showForm ? "Close form" : "Add patient"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 card p-6">
                    <UserForm onSubmit={handleCreatePatient} initialData={editingPatient || {}} roles={['patient']} />
                </div>
            )}

            {bookingPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-primary">Book for {bookingPatient.name}</h2>
                            <button
                                onClick={() => setBookingPatient(null)}
                                className="text-secondary hover:text-primary"
                            >
                                ✕
                            </button>
                        </div>
                        <AppointmentForm onSubmit={handleBookAppointment} patientId={bookingPatient._id} />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((p) => (
                    <div key={p._id} className="card p-6 text-on-card">
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <p className="text-secondary">{p.email}</p>
                        <p className="text-secondary">Phone: {p.phone || "—"}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button onClick={() => handleEdit(p)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold">Edit</button>
                            <button onClick={() => handleDeletePatient(p._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-semibold">Delete</button>
                            <button onClick={() => setBookingPatient(p)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md font-semibold">Book Appointment</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
