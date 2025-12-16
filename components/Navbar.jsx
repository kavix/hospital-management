"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

function NavLink({ href, label, isActive, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive
                ? "bg-white text-blue-700"
                : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
        >
            {label}
        </Link>
    );
}

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
        if (stored === "light" || stored === "dark") {
            setTheme(stored);
            document.documentElement.setAttribute("data-theme", stored);
            return;
        }
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    };

    const roleLinks = useMemo(() => {
        if (!session?.user?.role) return [];
        const role = session.user.role;
        if (role === "admin") {
            return [
                { href: "/admin/dashboard", label: "Dashboard" },
                { href: "/admin/doctors", label: "Doctors" },
            ];
        }
        if (role === "receptionist") {
            return [
                { href: "/receptionist/dashboard", label: "Dashboard" },
                { href: "/receptionist/appointments", label: "Appointments" },
                { href: "/receptionist/patients", label: "Patients" },
            ];
        }
        if (role === "doctor") {
            return [{ href: "/doctor/appointments", label: "Appointments" }];
        }
        return [
            { href: "/patient/dashboard", label: "Dashboard" },
            { href: "/patient/appointments", label: "Appointments" },
            { href: "/patient/profile", label: "Profile" },
        ];
    }, [session?.user?.role]);

    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-blue-700/90 shadow-lg shadow-blue-900/10">
            <div className="mx-auto flex items-center justify-between px-4 py-3" style={{ maxWidth: "1100px" }}>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold">
                        HM
                    </div>
                    <div className="flex flex-col">
                        <Link href="/" className="text-lg font-semibold text-white leading-tight">
                            Hospital Management
                        </Link>
                        <span className="text-xs text-white/75">Care, schedules, and teams in one place</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    {session ? (
                        <>
                            {roleLinks.map((item) => (
                                <NavLink
                                    key={item.href}
                                    href={item.href}
                                    label={item.label}
                                    isActive={pathname.startsWith(item.href)}
                                />
                            ))}
                            <div className="h-6 w-px bg-white/30 mx-1" />
                            <button
                                onClick={toggleTheme}
                                className="bg-white/15 border border-white/25 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/25"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? "☾ Dark" : "☀︎ Light"}
                            </button>
                            <div className="text-white/90 text-sm mr-2">
                                {session.user.name} · {session.user.role}
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="bg-white text-blue-700 font-semibold px-3 py-2 rounded-md shadow-sm hover:bg-blue-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={toggleTheme}
                                className="bg-white/15 border border-white/25 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/25"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? "☾ Dark" : "☀︎ Light"}
                            </button>
                            <NavLink href="/login" label="Login" isActive={pathname === "/login"} />
                            <NavLink href="/register" label="Register" isActive={pathname === "/register"} />
                        </>
                    )}
                </div>

                <button
                    className="md:hidden text-white/90 hover:text-white"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle navigation"
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {open && (
                <div className="md:hidden border-t border-white/15 bg-blue-800/95">
                    <div className="flex flex-col gap-1 px-4 py-3" style={{ maxWidth: "1100px" }}>
                        {session ? (
                            <>
                                <button
                                    onClick={toggleTheme}
                                    className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/20 mb-2 text-left"
                                    aria-label="Toggle theme"
                                >
                                    {theme === "light" ? "☾ Dark mode" : "☀︎ Light mode"}
                                </button>
                                {roleLinks.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        isActive={pathname.startsWith(item.href)}
                                        onClick={() => setOpen(false)}
                                    />
                                ))}
                                <div className="text-white/80 text-sm py-1">
                                    {session.user.name} · {session.user.role}
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-white text-blue-700 font-semibold px-3 py-2 rounded-md shadow-sm hover:bg-blue-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={toggleTheme}
                                    className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/20 mb-2 text-left"
                                    aria-label="Toggle theme"
                                >
                                    {theme === "light" ? "☾ Dark mode" : "☀︎ Light mode"}
                                </button>
                                <NavLink href="/login" label="Login" isActive={pathname === "/login"} onClick={() => setOpen(false)} />
                                <NavLink href="/register" label="Register" isActive={pathname === "/register"} onClick={() => setOpen(false)} />
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
