import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";

export async function GET() {
    try {
        await dbConnect();

        const doctorsCount = await User.countDocuments({ role: 'doctor' });
        const patientsCount = await User.countDocuments({ role: 'patient' });
        const appointmentsCount = await Appointment.countDocuments();
        const pendingAppointmentsCount = await Appointment.countDocuments({ status: 'PENDING' });
        const approvedAppointmentsCount = await Appointment.countDocuments({ status: 'APPROVED' });

        return NextResponse.json({
            doctors: doctorsCount,
            patients: patientsCount,
            appointments: appointmentsCount,
            pending: pendingAppointmentsCount,
            approved: approvedAppointmentsCount
        });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching stats", error: error.message }, { status: 500 });
    }
}
