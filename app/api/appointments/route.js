import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("doctorId");
        const patientId = searchParams.get("patientId");

        let query = {};
        if (doctorId) query.doctorId = doctorId;
        if (patientId) query.patientId = patientId;

        const appointments = await Appointment.find(query)
            .populate("patientId", "name email")
            .populate("doctorId", "name specialization")
            .sort({ appointmentDate: 1 });

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching appointments", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        await dbConnect();

        const patient = await User.findById(body.patientId);
        const doctor = await User.findById(body.doctorId);

        if (!patient || !doctor) {
            return NextResponse.json({ message: "Patient or Doctor not found" }, { status: 404 });
        }

        // Calculate token number
        const startOfDay = new Date(body.appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(body.appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find the last token number used for this doctor on this day
        const lastAppointment = await Appointment.findOne({
            doctorId: body.doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ tokenNumber: -1 });

        const tokenNumber = lastAppointment && lastAppointment.tokenNumber ? lastAppointment.tokenNumber + 1 : 1;

        const newAppointment = new Appointment({
            ...body,
            tokenNumber
        });

        await newAppointment.save();

        return NextResponse.json({ message: "Appointment created successfully", appointment: newAppointment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating appointment", error: error.message }, { status: 500 });
    }
}
