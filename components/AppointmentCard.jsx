export default function AppointmentCard({ appointment, onStatusChange, onDelete, role }) {
    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        COMPLETED: "bg-blue-100 text-blue-800",
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
        <div className="border p-4 rounded shadow mb-4 bg-white text-gray-900">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{appointment.patientId?.name || "Unknown Patient"}</h3>
                    <p className="text-gray-600">Doctor: {appointment.doctorId?.name || "Unknown Doctor"}</p>
                    <p className="text-gray-600">Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Time: {appointment.appointmentTime}</p>
                    {appointment.tokenNumber && (
                        <p className="text-blue-600 font-bold text-lg">Token Number: {appointment.tokenNumber}</p>
                    )}
                    <p className="text-gray-600">Reason: {appointment.reason}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${statusColors[appointment.status]}`}>
                        {appointment.status}
                    </span>
                    {appointment.tokenNumber && (
                        <button onClick={handlePrint} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-colors">
                            Print Token
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                {role === 'receptionist' && appointment.status === 'PENDING' && (
                    <>
                        <button onClick={() => onStatusChange(appointment._id, 'APPROVED')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors">Approve</button>
                        <button onClick={() => onStatusChange(appointment._id, 'REJECTED')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors">Reject</button>
                    </>
                )}
                {role === 'doctor' && appointment.status === 'APPROVED' && (
                    <button onClick={() => onStatusChange(appointment._id, 'COMPLETED')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors">Mark Completed</button>
                )}
                {(role === 'receptionist' || role === 'admin') && (
                    <button onClick={() => onDelete(appointment._id)} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors">Delete</button>
                )}
            </div>
        </div>
    );
}
