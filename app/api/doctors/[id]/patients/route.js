import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await dbConnect();

        // Find all unique patients who have appointments with this doctor
        const appointments = await Appointment.find({ doctorId: id })
            .populate("patientId", "name email phone address gender dateOfBirth")
            .sort({ appointmentDate: -1 });

        // Extract unique patients
        const patientsMap = new Map();
        appointments.forEach((app) => {
            if (app.patientId && !patientsMap.has(app.patientId._id.toString())) {
                patientsMap.set(app.patientId._id.toString(), {
                    _id: app.patientId._id,
                    name: app.patientId.name,
                    email: app.patientId.email,
                    phone: app.patientId.phone,
                    address: app.patientId.address,
                    gender: app.patientId.gender,
                    dateOfBirth: app.patientId.dateOfBirth,
                });
            }
        });

        const patients = Array.from(patientsMap.values());

        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching patients", error: error.message }, { status: 500 });
    }
}
