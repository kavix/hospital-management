import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";

export async function GET() {
    try {
        await dbConnect();

        const doctorsCount = await User.countDocuments({ role: 'doctor' });
        const patientsCount = await User.countDocuments({ role: 'patient' });
        const receptionistsCount = await User.countDocuments({ role: 'receptionist' });
        const appointmentsCount = await Appointment.countDocuments();
        const pendingAppointmentsCount = await Appointment.countDocuments({ status: 'PENDING' });
        const approvedAppointmentsCount = await Appointment.countDocuments({ status: 'APPROVED' });

        // Graph Data: Appointments by date (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const appointmentsByDate = await Appointment.aggregate([
            {
                $match: {
                    appointmentDate: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Graph Data: User distribution
        const userDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        return NextResponse.json({
            doctors: doctorsCount,
            patients: patientsCount,
            receptionists: receptionistsCount,
            appointments: appointmentsCount,
            pending: pendingAppointmentsCount,
            approved: approvedAppointmentsCount,
            graphData: {
                appointmentsByDate,
                userDistribution
            }
        });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching stats", error: error.message }, { status: 500 });
    }
}
