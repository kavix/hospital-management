import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("doctorId");
        const date = searchParams.get("date");

        if (!doctorId || !date) {
            return NextResponse.json({ success: false, message: "Missing doctorId or date" }, { status: 400 });
        }

        // Create start and end of the day for the query
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            doctorId: doctorId,
            appointmentDate: { $gte: startDate, $lte: endDate },
            status: "APPROVED",
        })
            .populate("patientId", "name")
            .select("patientId appointmentTime reason");

        const formattedAppointments = appointments.map(app => ({
            id: app._id,
            patientName: app.patientId?.name || "Unknown",
            time: app.appointmentTime,
            reason: app.reason
        }));

        return NextResponse.json({
            success: true,
            appointments: formattedAppointments
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
