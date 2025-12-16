"use client";
import { useState, useEffect } from "react";
import UserForm from "@/components/UserForm";

export default function ManageReceptionists() {
    const [receptionists, setReceptionists] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        const res = await fetch("/api/users?role=receptionist");
        const data = await res.json();
        setReceptionists(data);
    };

    const handleCreateReceptionist = async (formData) => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        setShowForm(false);
        fetchReceptionists();
    };

    const handleDeleteReceptionist = async (id) => {
        if (confirm("Are you sure?")) {
            await fetch(`/api/users/${id}`, { method: "DELETE" });
            fetchReceptionists();
        }
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase">Admin</p>
                    <h1 className="text-3xl font-bold">Manage Receptionists</h1>
                    <p className="text-secondary">Add receptionists, view details, and manage access.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                >
                    {showForm ? "Close form" : "Add receptionist"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 card p-6">
                    <UserForm onSubmit={handleCreateReceptionist} roles={['receptionist']} />
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b subtle-border bg-surface-muted text-secondary text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Created At</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y subtle-border">
                            {receptionists.map((receptionist) => (
                                <tr key={receptionist._id} className="hover:bg-surface-muted transition-colors">
                                    <td className="p-4 font-medium text-primary">{receptionist.name}</td>
                                    <td className="p-4 text-secondary">{receptionist.email}</td>
                                    <td className="p-4 text-secondary">{receptionist.phone || "N/A"}</td>
                                    <td className="p-4 text-secondary">
                                        {new Date(receptionist.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDeleteReceptionist(receptionist._id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {receptionists.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-secondary">
                                        No receptionists found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
