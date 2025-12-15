"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Hospital Management</Link>
                <div>
                    {session ? (
                        <div className="flex gap-4 items-center">
                            <span>Welcome, {session.user.name} ({session.user.role})</span>
                            <button onClick={() => signOut()} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors">Logout</button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link href="/login" className="hover:underline">Login</Link>
                            <Link href="/register" className="hover:underline">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
