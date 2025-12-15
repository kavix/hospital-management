export default function DashboardStats({ stats, role }) {
    if (!stats) return <div>Loading stats...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {role === 'admin' && (
                <div className="bg-white p-6 rounded shadow text-gray-900">
                    <h3 className="text-lg font-semibold text-gray-600">Total Doctors</h3>
                    <p className="text-3xl font-bold">{stats.doctors}</p>
                </div>
            )}
            <div className="bg-white p-6 rounded shadow text-gray-900">
                <h3 className="text-lg font-semibold text-gray-600">Total Patients</h3>
                <p className="text-3xl font-bold">{stats.patients}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-gray-900">
                <h3 className="text-lg font-semibold text-gray-600">Total Appointments</h3>
                <p className="text-3xl font-bold">{stats.appointments}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-gray-900">
                <h3 className="text-lg font-semibold text-gray-600">Pending Appointments</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-gray-900">
                <h3 className="text-lg font-semibold text-gray-600">Approved Appointments</h3>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
        </div>
    );
}
