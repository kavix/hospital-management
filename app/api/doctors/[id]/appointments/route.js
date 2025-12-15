import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const appointments = await Appointment.find({ doctorId: id }).populate("patientId", "name");
        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching appointments", error: error.message }, { status: 500 });
    }
}
