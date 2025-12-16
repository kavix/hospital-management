"use client";
import { useState, useEffect } from "react";

export default function AppointmentForm({ onSubmit, patientId }) {
    const [doctors, setDoctors] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState("");
    const [formData, setFormData] = useState({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    useEffect(() => {
        fetch("/api/doctors")
            .then((res) => res.json())
            .then((data) => setDoctors(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, patientId });
    };

    const filteredDoctors = doctors.filter((doc) => {
        const q = doctorSearch.toLowerCase();
        return (
            doc.name?.toLowerCase().includes(q) ||
            doc.specialization?.toLowerCase().includes(q) ||
            doc.email?.toLowerCase().includes(q)
        );
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-on-card">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Book Appointment</h2>
                <span className="pill pill-info">Token auto-assigned</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Doctor</label>
                    <select
                        className="w-full p-3 shadowed-input"
                        value={formData.doctorId}
                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                        required
                    >
                        <option value="">Select Doctor</option>
                        {filteredDoctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                                {doc.name} ({doc.specialization})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Search</label>
                    <input
                        type="text"
                        className="w-full p-3 shadowed-input"
                        placeholder="Search doctor or specialty"
                        value={doctorSearch}
                        onChange={(e) => setDoctorSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
                <div>
                    <label className="block mb-1 font-medium">Date</label>
                    <input
                        type="date"
                        className="w-full p-3 shadowed-input"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Time</label>
                    <input
                        type="time"
                        className="w-full p-3 shadowed-input"
                        value={formData.appointmentTime}
                        onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="font-medium">Reason</label>
                    <span className="text-xs text-secondary">Share a brief note</span>
                </div>
                <textarea
                    className="w-full p-3 shadowed-input"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                />
            </div>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-md font-semibold shadow-sm w-full">
                Book Appointment
            </button>
        </form>
    );
}
