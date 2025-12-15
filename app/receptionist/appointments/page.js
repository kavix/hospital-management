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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Appointments</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    {showForm ? "Cancel" : "New Appointment"}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white p-6 rounded shadow text-gray-900">
                    <h2 className="text-xl font-bold mb-4">Create Appointment for Patient</h2>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Select Patient</label>
                        <select
                            className="w-full border p-2 rounded bg-white text-gray-900"
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
            <div className="mb-6 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-900">Search</label>
                        <input
                            type="text"
                            placeholder="Search by patient, doctor, token, reason..."
                            className="w-full border p-2 rounded text-gray-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-900">Status</label>
                        <select
                            className="w-full border p-2 rounded bg-white text-gray-900"
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
                        <label className="block mb-1 font-medium text-gray-900">Sort By</label>
                        <select
                            className="w-full border p-2 rounded bg-white text-gray-900"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="time">Time</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
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
    );
}
