import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const url = new URL(req.url);
        const dateParam = url.searchParams.get('date');

        await dbConnect();

        const query = { doctorId: id };

        if (dateParam) {
            // Expecting date in YYYY-MM-DD format. Match any time on that day.
            const start = new Date(dateParam);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            query.appointmentDate = { $gte: start, $lt: end };
        }

        const appointments = await Appointment.find(query).populate("patientId", "name");
        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching appointments", error: error.message }, { status: 500 });
    }
}
