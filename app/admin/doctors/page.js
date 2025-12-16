"use client";
import { useState, useEffect } from "react";
import UserForm from "@/components/UserForm";

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        const res = await fetch("/api/users?role=doctor");
        const data = await res.json();
        setDoctors(data);
    };

    const handleCreateDoctor = async (formData) => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        setShowForm(false);
        fetchDoctors();
    };

    const handleDeleteDoctor = async (id) => {
        if (confirm("Are you sure?")) {
            await fetch(`/api/users/${id}`, { method: "DELETE" });
            fetchDoctors();
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase">Admin</p>
                    <h1 className="text-3xl font-bold">Manage Doctors</h1>
                    <p className="text-secondary">Add specialists, view credentials, and share IDs.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                >
                    {showForm ? "Close form" : "Add doctor"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 card p-6">
                    <UserForm onSubmit={handleCreateDoctor} roles={['doctor']} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                    <div key={doc._id} className="card p-6 text-on-card">
                        <h3 className="text-xl font-bold">{doc.name}</h3>
                        <p className="text-secondary">{doc.email}</p>
                        <p className="text-secondary">Specialization: {doc.specialization || "—"}</p>
                        <p className="text-secondary">License: {doc.licenseNumber || "—"}</p>
                        <div className="mt-2 p-2 surface-muted rounded subtle-border">
                            <p className="text-sm font-semibold text-primary">DOCTOR_ID:</p>
                            <p className="text-sm text-primary font-mono break-all">{doc._id}</p>
                        </div>
                        <button
                            onClick={() => handleDeleteDoctor(doc._id)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
