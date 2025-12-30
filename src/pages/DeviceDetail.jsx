import { useNavigate } from "react-router-dom";
import DeviceHeader from "../components/DeviceHeader";
import "./DeviceDetail.css";

export default function DeviceDetail() {
    const navigate = useNavigate();

    // Dummy data (later replace with router state / API)
    const device = {
        id: "dev-uuid-123",
        imei: "867530912345678",
        qr: "QR-DEV-001",
        locationType: "WAREHOUSE",
        currentLocation: "Kolkata Warehouse",
        status: "IN_STOCK",
        createdAt: "2024-12-15",
        remarks: "Ready for dispatch",

        // Optional movement summary (future use)
        lastMovement: {
            type: "PF_TO_WH",
            date: "2024-12-16",
        },
    };

    return (
        <div className="lender-page">
            {/* PAGE HEADER */}
            <DeviceHeader />

            {/* CONTENT WRAPPER */}
            <div className="device-detail-wrapper">
                {/* HEADER STRIP */}
                <div className="device-detail-top">
                    <h2>{device.imei}</h2>
                    <span className={`status active`}>{device.status}</span>
                </div>

                {/* INFO CARDS */}
                <div className="card-grid">
                    <div className="card">
                        <h4>Device Info</h4>
                        <p><b>IMEI:</b> {device.imei}</p>
                        <p><b>QR Code:</b> {device.qr}</p>
                        <p><b>Created At:</b> {device.createdAt}</p>
                    </div>

                    <div className="card">
                        <h4>Current Location</h4>
                        <p><b>Location Type:</b> {device.locationType}</p>
                        <p><b>Location:</b> {device.currentLocation}</p>
                    </div>
                </div>

                {/* MOVEMENT SUMMARY (OPTIONAL, FUTURE READY) */}
                <div className="card">
                    <h4>Last Movement</h4>
                    <p><b>Movement Type:</b> {device.lastMovement.type}</p>
                    <p><b>Date:</b> {device.lastMovement.date}</p>
                </div>

                {/* REMARKS */}
                <div className="card">
                    <h4>Remarks</h4>
                    <p>{device.remarks}</p>
                </div>

                {/* ACTIONS */}
                <div className="actions">
                    <button
                        className="secondary"
                        onClick={() => navigate("/devices")}
                    >
                        Back
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/devices/edit/${device.id}`, { state: device })
                        }
                    >
                        Edit Device
                    </button>
                </div>
            </div>
        </div>
    );
}