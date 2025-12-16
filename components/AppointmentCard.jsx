export default function AppointmentCard({ appointment, onStatusChange, onDelete, role }) {
    const statusStyles = {
        PENDING: "pill pill-warn",
        APPROVED: "pill pill-success",
        REJECTED: "pill pill-danger",
        COMPLETED: "pill pill-info",
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=600,height=400');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Token</title>
                    <style>
                        body { font-family: sans-serif; text-align: center; padding: 20px; }
                        .token-card { border: 2px solid #000; padding: 20px; max-width: 300px; margin: 0 auto; }
                        h1 { margin: 0; font-size: 24px; }
                        h2 { font-size: 48px; margin: 10px 0; }
                        p { margin: 5px 0; }
                    </style>
                </head>
                <body>
                    <div class="token-card">
                        <h1>Hospital Token</h1>
                        <p><strong>Doctor:</strong> ${appointment.doctorId?.name || "Unknown"}</p>
                        <p><strong>Patient:</strong> ${appointment.patientId?.name || "Unknown"}</p>
                        <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
                        <hr/>
                        <h2>#${appointment.tokenNumber}</h2>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="card mb-4 p-5 text-on-card">
            <div className="flex justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{appointment.patientId?.name || "Unknown Patient"}</h3>
                        <span className={statusStyles[appointment.status] || "pill pill-neutral"}>{appointment.status}</span>
                    </div>
                    <p className="text-secondary">Doctor: {appointment.doctorId?.name || "Unknown Doctor"}</p>
                    <p className="text-secondary">Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p className="text-secondary">Time: {appointment.appointmentTime}</p>
                    {appointment.reason && (
                        <p className="text-primary"><span className="font-semibold">Reason:</span> {appointment.reason}</p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    {appointment.tokenNumber && (
                        <div className="text-blue-700 font-bold text-xl">Token #{appointment.tokenNumber}</div>
                    )}
                    {appointment.tokenNumber && (
                        <button onClick={handlePrint} className="text-sm bg-surface subtle-border hover:opacity-80 text-primary px-3 py-2 rounded-md transition-colors shadow-sm">
                            Print Token
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {role === 'receptionist' && appointment.status === 'PENDING' && (
                    <>
                        <button onClick={() => onStatusChange(appointment._id, 'APPROVED')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md font-semibold">
                            Approve
                        </button>
                        <button onClick={() => onStatusChange(appointment._id, 'REJECTED')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-semibold">
                            Reject
                        </button>
                    </>
                )}
                {role === 'doctor' && appointment.status === 'APPROVED' && (
                    <button onClick={() => onStatusChange(appointment._id, 'COMPLETED')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-semibold">
                        Mark Completed
                    </button>
                )}
                {(role === 'receptionist' || role === 'admin') && (
                    <button onClick={() => onDelete(appointment._id)} className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md font-semibold">
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
