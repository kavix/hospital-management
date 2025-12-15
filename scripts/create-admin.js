const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://kavindusachinthe_db_user:OL55jLr96QNDvxms@creative.vixh1ok.mongodb.net/?appName=creative';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'doctor', 'patient', 'receptionist'], required: true },
    name: { type: String, required: true },
    phone: { type: String },
    specialization: { type: String },
    licenseNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'hospital_management',
        });
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@hospital.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('Admin password updated to: admin123');
            console.log('Email:', adminEmail);
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const newAdmin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                phone: '0000000000'
            });

            await newAdmin.save();
            console.log('Admin user created successfully');
            console.log('Email:', adminEmail);
            console.log('Password: admin123');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
