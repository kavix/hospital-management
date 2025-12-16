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
        <form onSubmit={handleSubmit} className="space-y-5 text-on-card">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">{initialData._id ? "Edit User" : "Add User"}</h2>
                    <p className="text-sm text-secondary">Provide the basic details to get started.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-sm text-primary">Name</label>
                    <input
                        type="text"
                        className="w-full p-3 shadowed-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-sm text-primary">Email</label>
                    <input
                        type="email"
                        className="w-full p-3 shadowed-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                {!initialData._id && (
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="font-medium text-sm text-primary">Password</label>
                            <span className="text-xs text-secondary">Min 8 characters</span>
                        </div>
                        <input
                            type="password"
                            className="w-full p-3 shadowed-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="block mb-1 font-medium text-sm text-primary">Role</label>
                    <select
                        className="w-full p-3 shadowed-input"
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
                    <label className="block mb-1 font-medium text-sm text-primary">Phone</label>
                    <input
                        type="text"
                        className="w-full p-3 shadowed-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            {formData.role === 'doctor' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4 surface-muted p-4 rounded-lg subtle-border">
                    <div>
                        <label className="block mb-1 font-medium text-sm text-primary">Specialization</label>
                        <input
                            type="text"
                            className="w-full p-3 shadowed-input"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm text-primary">License Number</label>
                        <input
                            type="text"
                            className="w-full p-3 shadowed-input"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {formData.role === 'patient' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4 surface-muted p-4 rounded-lg subtle-border">
                    <div>
                        <label className="block mb-1 font-medium text-sm text-primary">Address</label>
                        <input
                            type="text"
                            className="w-full p-3 shadowed-input"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm text-primary">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full p-3 shadowed-input"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-sm text-primary">Gender</label>
                        <select
                            className="w-full p-3 shadowed-input"
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

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-semibold shadow-sm w-full">
                {initialData._id ? "Update User" : "Create User"}
            </button>
        </form>
    );
}
