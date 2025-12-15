import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select("-password");
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        await dbConnect();

        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = new User({ ...body, password: hashedPassword });
        await newUser.save();

        return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
    }
}
