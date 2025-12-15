import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { name, email, password, role, phone, address, dateOfBirth, gender, specialization, licenseNumber } = await req.json();
        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "patient",
            phone,
            address,
            dateOfBirth,
            gender,
            specialization,
            licenseNumber
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error registering user", error: error.message }, { status: 500 });
    }
}
