import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("DOCTOR_ID");

        if (!doctorId) {
            return NextResponse.json(
                { message: "DOCTOR_ID is required" },
                { status: 400 }
            );
        }

        // Get today's date automatically
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Find approved appointments for the doctor on today's date
        const appointments = await Appointment.find({
            doctorId: doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: "APPROVED"
        })
            .populate("patientId", "name")
            .sort({ tokenNumber: 1 });

        // Format response as simple array with token and patient name only
        const tokens = appointments.map(app => ({
            tokenNumber: app.tokenNumber,
            patientName: app.patientId?.name || "Unknown"
        }));

        const dateString = today.toISOString().split('T')[0];

        return NextResponse.json({
            success: true,
            doctorId,
            date: dateString,
            count: tokens.length,
            data: tokens
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching token information", error: error.message },
            { status: 500 }
        );
    }
}
