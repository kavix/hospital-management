"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PatientProfile() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: "",
    });

    useEffect(() => {
        if (session?.user?.id) {
            fetchUser();
        }
    }, [session]);

    const fetchUser = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/users/${session.user.id}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
                    gender: data.gender || "",
                });
            } else {
                setError("Failed to load profile");
            }
        } catch (err) {
            setError("Error loading profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch(`/api/users/${session.user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess("Profile updated successfully!");
                setEditing(false);
                await fetchUser();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const data = await res.json();
                setError(data.message || "Error updating profile");
            }
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setError("");
        setSuccess("");
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                gender: user.gender || "",
            });
        }
    };

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-secondary">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                    <p className="text-sm font-semibold text-secondary uppercase">My Account</p>
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 pill pill-danger w-full justify-center py-3">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 pill pill-success w-full justify-center py-3">
                    {success}
                </div>
            )}

            <div className="card p-6">
                {!editing ? (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                    Full Name
                                </label>
                                <p className="text-lg text-primary font-medium">{user?.name || "—"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                    Email
                                </label>
                                <p className="text-lg text-primary font-medium">{user?.email || "—"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                    Phone
                                </label>
                                <p className="text-lg text-primary font-medium">{user?.phone || "—"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                    Gender
                                </label>
                                <p className="text-lg text-primary font-medium">{user?.gender || "—"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                    Date of Birth
                                </label>
                                <p className="text-lg text-primary font-medium">
                                    {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                    Role
                                </label>
                                <span className="pill pill-info">{user?.role || "—"}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                Address
                            </label>
                            <p className="text-lg text-primary font-medium">{user?.address || "—"}</p>
                        </div>
                        <div className="pt-4 border-t subtle-border">
                            <label className="block text-sm font-semibold text-secondary uppercase tracking-wide mb-1">
                                Account Created
                            </label>
                            <p className="text-primary">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Edit Your Information</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
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
                            <div>
                                <label className="block mb-1 font-medium text-sm text-primary">Phone</label>
                                <input
                                    type="text"
                                    className="w-full p-3 shadowed-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                                <label className="block mb-1 font-medium text-sm text-primary">Address</label>
                                <input
                                    type="text"
                                    className="w-full p-3 shadowed-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-70 text-white px-6 py-3 rounded-md font-semibold shadow-sm"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
