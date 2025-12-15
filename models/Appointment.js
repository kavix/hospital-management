import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], default: 'PENDING' },
    reason: { type: String },
    notes: { type: String },
    tokenNumber: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
