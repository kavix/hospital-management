import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();
        const doctors = await User.find({ role: "doctor" }).select("-password");
        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching doctors", error: error.message }, { status: 500 });
    }
}
