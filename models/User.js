import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient', 'receptionist'], required: true },
    name: { type: String, required: true },
    phone: { type: String },
    specialization: { type: String }, // doctors only
    licenseNumber: { type: String }, // doctors only
    address: { type: String }, // patients only
    dateOfBirth: { type: Date }, // patients only
    gender: { type: String }, // patients only
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
