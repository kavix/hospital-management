export default function DashboardStats({ stats, role }) {
    if (!stats) return <div>Loading stats...</div>;

    const cards = [
        ...(role === 'admin' ? [{ title: "Total Doctors", value: stats.doctors, hint: "Active clinicians" }] : []),
        { title: "Total Patients", value: stats.patients, hint: "Registered profiles" },
        { title: "Total Appointments", value: stats.appointments, hint: "All time" },
        { title: "Pending Appointments", value: stats.pending, hint: "Awaiting review", color: "text-amber-600" },
        { title: "Approved Appointments", value: stats.approved, hint: "Ready to serve", color: "text-green-600" },
    ];

    return (
        <div className="status-grid mb-8">
            {cards.map((card) => (
                <div key={card.title} className="card p-5 text-on-card">
                    <p className="text-sm font-semibold text-secondary uppercase tracking-wide">{card.title}</p>
                    <p className={`text-3xl font-bold mt-2 ${card.color || ""}`}>{card.value}</p>
                    <p className="text-sm text-secondary mt-1">{card.hint}</p>
                </div>
            ))}
        </div>
    );
}
