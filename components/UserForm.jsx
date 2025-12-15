"use client";
import { useState } from "react";

export default function UserForm({ onSubmit, initialData = {}, roles = [] }) {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || roles[0] || "patient",
        phone: initialData.phone || "",
        specialization: initialData.specialization || "",
        licenseNumber: initialData.licenseNumber || "",
        address: initialData.address || "",
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : "",
        gender: initialData.gender || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-bold mb-4">{initialData._id ? "Edit User" : "Add User"}</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded bg-white text-gray-900"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded bg-white text-gray-900"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                {!initialData._id && (
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <select
                        className="w-full border p-2 rounded bg-white text-gray-900"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Phone</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded bg-white text-gray-900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            {formData.role === 'doctor' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <label className="block mb-1 font-medium">Specialization</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">License Number</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {formData.role === 'patient' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <label className="block mb-1 font-medium">Address</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Gender</label>
                        <select
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            )}

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors">
                {initialData._id ? "Update User" : "Create User"}
            </button>
        </form>
    );
}
