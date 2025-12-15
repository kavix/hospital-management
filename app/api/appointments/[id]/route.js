import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        await dbConnect();

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, body, { new: true });
        if (!updatedAppointment) {
            return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        return NextResponse.json(updatedAppointment);
    } catch (error) {
        return NextResponse.json({ message: "Error updating appointment", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await dbConnect();

        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting appointment", error: error.message }, { status: 500 });
    }
}
