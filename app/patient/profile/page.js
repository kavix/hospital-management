"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import UserForm from "@/components/UserForm";

export default function PatientProfile() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchUser();
        }
    }, [session]);

    const fetchUser = async () => {
        // We need an endpoint to get a single user by ID. 
        // Currently /api/users/[id] exists.
        const res = await fetch(`/api/users/${session.user.id}`);
        if (res.ok) {
            const data = await res.json();
            setUser(data);
        }
    };

    const handleUpdate = async (formData) => {
        const res = await fetch(`/api/users/${session.user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("Profile updated successfully");
            fetchUser();
        } else {
            alert("Error updating profile");
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <UserForm onSubmit={handleUpdate} initialData={user} roles={['patient']} />
        </div>
    );
}
