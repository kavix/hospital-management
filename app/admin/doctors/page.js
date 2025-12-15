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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Doctors</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    {showForm ? "Cancel" : "Add Doctor"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8">
                    <UserForm onSubmit={handleCreateDoctor} roles={['doctor']} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                    <div key={doc._id} className="bg-white p-6 rounded shadow text-gray-900">
                        <h3 className="text-xl font-bold">{doc.name}</h3>
                        <p className="text-gray-600">{doc.email}</p>
                        <p className="text-gray-600">Specialization: {doc.specialization}</p>
                        <p className="text-gray-600">License: {doc.licenseNumber}</p>
                        <button
                            onClick={() => handleDeleteDoctor(doc._id)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
