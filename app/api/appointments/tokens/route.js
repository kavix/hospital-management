import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("DOCTOR_ID");
        const date = searchParams.get("date");

        if (!doctorId || !date) {
            return NextResponse.json(
                { message: "DOCTOR_ID and date are required" },
                { status: 400 }
            );
        }

        // Create date range for the selected day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find approved appointments for the doctor on the specified date
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

        // Format response as array of objects with token and patient name
        const tokens = appointments.map(app => ({
            tokenNumber: app.tokenNumber,
            patientName: app.patientId?.name || "Unknown",
            appointmentTime: app.appointmentTime
        }));

        return NextResponse.json({
            doctorId,
            date,
            count: tokens.length,
            tokens
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching token information", error: error.message },
            { status: 500 }
        );
    }
}
