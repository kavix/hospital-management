"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else if (result.ok) {
            // Wait a moment for session to be established
            setTimeout(() => {
                setLoading(false);
                router.refresh();
            }, 500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Welcome back</p>
                    <h1 className="text-3xl font-bold mt-1 text-primary">Sign in to continue</h1>
                    <p className="text-secondary mt-2">Access your dashboard, appointments, and patients.</p>
                </div>

                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    {error && (
                        <div className="pill pill-danger w-full justify-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block mb-2 font-medium text-sm text-primary">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 shadowed-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="font-medium text-sm text-primary">Password</label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs text-blue-700 hover:text-blue-800 font-semibold"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 pr-12 shadowed-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white p-3 rounded-md font-semibold shadow-sm"
                    >
                        {loading ? "Signing in…" : "Login"}
                    </button>
                    <p className="text-sm text-center text-secondary">
                        New here? <a href="/register" className="text-blue-700 font-semibold">Create an account</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
