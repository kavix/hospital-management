"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { signIn } from "next-auth/react";

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleRegister = async (formData) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                // Auto login
                const result = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });
                if (!result.error) {
                    router.push("/");
                }
            } else {
                const data = await res.json();
                setError(data.message);
            }
        } catch (err) {
            setError("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center">
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Get started</p>
                    <h1 className="text-3xl font-bold mt-1 text-primary">Create your patient account</h1>
                    <p className="text-secondary mt-2">Book appointments, manage your details, and stay informed.</p>
                </div>
                <div className="card p-6">
                    {error && <div className="pill pill-danger w-full justify-center mb-4">{error}</div>}
                    <UserForm onSubmit={handleRegister} roles={['patient']} />
                    <p className="text-sm text-center text-secondary mt-4">
                        Already registered? <a href="/login" className="text-blue-700 font-semibold">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
