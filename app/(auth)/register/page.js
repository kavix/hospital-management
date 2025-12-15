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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
            <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Patient Registration</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <UserForm onSubmit={handleRegister} roles={['patient']} />
            </div>
        </div>
    );
}
