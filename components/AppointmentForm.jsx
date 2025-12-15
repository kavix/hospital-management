"use client";
import { useState, useEffect } from "react";

export default function AppointmentForm({ onSubmit, patientId }) {
    const [doctors, setDoctors] = useState([]);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
            <div>
                <label className="block mb-1 font-medium">Doctor</label>
                <select
                    className="w-full border p-2 rounded bg-white text-gray-900"
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    required
                >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                            {doc.name} ({doc.specialization})
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                    type="date"
                    className="w-full border p-2 rounded bg-white text-gray-900"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Time</label>
                <input
                    type="time"
                    className="w-full border p-2 rounded bg-white text-gray-900"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Reason</label>
                <textarea
                    className="w-full border p-2 rounded bg-white text-gray-900"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors">
                Book Appointment
            </button>
        </form>
    );
}
