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

const users = [
    {
        email: 'admin@hospital.com',
        password: 'admin123',
        role: 'admin',
        name: 'System Admin',
        phone: '0000000000'
    },
    {
        email: 'doctor@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. Smith',
        phone: '1111111111',
        specialization: 'Cardiology',
        licenseNumber: 'DOC12345'
    },
    {
        email: 'receptionist@hospital.com',
        password: 'receptionist123',
        role: 'receptionist',
        name: 'Front Desk',
        phone: '2222222222'
    },
    {
        email: 'patient@hospital.com',
        password: 'patient123',
        role: 'patient',
        name: 'John Doe',
        phone: '3333333333',
        address: '123 Main St',
        gender: 'Male',
        dateOfBirth: new Date('1990-01-01')
    }
];

async function seedUsers() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'hospital_management',
        });
        console.log('Connected to MongoDB');

        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            const hashedPassword = await bcrypt.hash(user.password, 10);

            if (existingUser) {
                console.log(`Updating existing user: ${user.role}`);
                existingUser.password = hashedPassword;
                existingUser.name = user.name;
                existingUser.phone = user.phone;
                if (user.specialization) existingUser.specialization = user.specialization;
                if (user.licenseNumber) existingUser.licenseNumber = user.licenseNumber;
                if (user.address) existingUser.address = user.address;
                if (user.gender) existingUser.gender = user.gender;
                if (user.dateOfBirth) existingUser.dateOfBirth = user.dateOfBirth;

                await existingUser.save();
                console.log(`Updated ${user.role} (${user.email})`);
            } else {
                console.log(`Creating new user: ${user.role}`);
                const newUser = new User({
                    ...user,
                    password: hashedPassword
                });
                await newUser.save();
                console.log(`Created ${user.role} (${user.email})`);
            }
        }

        console.log('All users seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
