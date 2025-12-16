"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");
    const { data: session } = useSession();

    // Redirect if already logged in
    useEffect(() => {
        if (session?.user) {
            const role = session.user.role;
            if (role === "admin") {
                router.push("/admin/dashboard");
            } else if (role === "doctor") {
                router.push("/doctor/appointments");
            } else if (role === "receptionist") {
                router.push("/receptionist/appointments");
            } else if (role === "patient") {
                router.push("/patient/dashboard");
            }
        }
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result.error) {
            setError(result.error);
        } else if (result.ok) {
            // Wait a moment for session to be established
            setTimeout(() => {
                router.refresh();
            }, 500);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 text-gray-900">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded bg-white text-gray-900"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded bg-white text-gray-900"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors">
                    Login
                </button>
            </form>
        </div>
    );
}
