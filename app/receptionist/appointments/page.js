"use client";
import { useState, useEffect } from "react";
import AppointmentCard from "@/components/AppointmentCard";
import AppointmentForm from "@/components/AppointmentForm";

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("time");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        setAppointments(data);
    };

    const fetchPatients = async () => {
        const res = await fetch("/api/users?role=patient");
        const data = await res.json();
        setPatients(data);
    };

    const handleStatusChange = async (id, status) => {
        await fetch(`/api/appointments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchAppointments();
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await fetch(`/api/appointments/${id}`, { method: "DELETE" });
            fetchAppointments();
        }
    };

    const handleCreateAppointment = async (formData) => {
        const res = await fetch("/api/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Appointment Booked Successfully! Token Number: ${data.appointment.tokenNumber}`);
            setShowForm(false);
            fetchAppointments();
        } else {
            alert("Failed to book appointment: " + data.message);
        }
    };

    // Filter appointments by search term and status
    const filteredAppointments = appointments.filter((app) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
            app.patientId?.name?.toLowerCase().includes(searchLower) ||
            app.patientId?.email?.toLowerCase().includes(searchLower) ||
            app.doctorId?.name?.toLowerCase().includes(searchLower) ||
            app.reason?.toLowerCase().includes(searchLower) ||
            app.tokenNumber?.toString().includes(searchLower)
        );

        const matchesStatus =
            statusFilter === "all" ||
            app.status?.toUpperCase() === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    // Sort appointments
    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        if (sortBy === "time") {
            const dateA = new Date(a.appointmentDate);
            const dateB = new Date(b.appointmentDate);
            // If dates are equal, compare times
            if (dateA.getTime() === dateB.getTime()) {
                return (a.appointmentTime || "").localeCompare(b.appointmentTime || "");
            }
            return dateA - dateB;
        } else if (sortBy === "doctor") {
            const doctorA = a.doctorId?.name || "";
            const doctorB = b.doctorId?.name || "";
            return doctorA.localeCompare(doctorB);
        }
        return 0;
    });

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                    <p className="text-sm text-secondary font-semibold uppercase">Reception</p>
                    <h1 className="text-3xl font-bold">Manage Appointments</h1>
                    <p className="text-secondary">Create, approve, or adjust bookings with quick filters.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm"
                >
                    {showForm ? "Close form" : "New appointment"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 card p-6">
                    <h2 className="text-xl font-bold mb-4">Create Appointment for Patient</h2>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Select Patient</label>
                        <select
                            className="w-full p-3 shadowed-input"
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                        >
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                            ))}
                        </select>
                    </div>
                    {selectedPatient && (
                        <AppointmentForm onSubmit={handleCreateAppointment} patientId={selectedPatient} />
                    )}
                </div>
            )}

            {/* Search and Sort Controls */}
            <div className="mb-6 list-shell">
                <div className="list-header">
                    <span className="text-primary font-semibold">Filters</span>
                    <span className="pill pill-neutral">{sortedAppointments.length} results</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-primary">Search</label>
                        <input
                            type="text"
                            placeholder="Search by patient, doctor, token, reason..."
                            className="w-full p-3 shadowed-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-primary">Status</label>
                        <select
                            className="w-full p-3 shadowed-input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-primary">Sort By</label>
                        <select
                            className="w-full p-3 shadowed-input"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="time">Time</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="list-shell">
                <div className="list-header">
                    <span className="text-primary font-semibold">Appointments</span>
                </div>
                <div className="p-4">
                    {sortedAppointments.length === 0 && (
                        <div className="empty-state">No appointments found for the selected filters.</div>
                    )}
                    {sortedAppointments.map((app) => (
                        <AppointmentCard
                            key={app._id}
                            appointment={app}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            role="receptionist"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
