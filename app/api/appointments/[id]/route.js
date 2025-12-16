import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        await dbConnect();

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, body, { new: true }).populate('patientId');
        if (!updatedAppointment) {
            return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        // Send email if status is APPROVED
        if (body.status === 'APPROVED' && updatedAppointment.patientId?.email) {
            const patient = updatedAppointment.patientId;
            const subject = "Appointment Approved - Hospital Management System";
            const text = `Dear ${patient.name},

Your appointment has been approved.

Details:
Date: ${new Date(updatedAppointment.appointmentDate).toLocaleDateString()}
Time: ${updatedAppointment.appointmentTime}
Token Number: ${updatedAppointment.tokenNumber || 'Pending'}

Please arrive 10 minutes early.

Thank you,
Hospital Management Team`;

            await sendEmail(patient.email, subject, text);
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
