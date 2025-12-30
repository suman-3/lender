import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LenderPageHeader from "../components/LenderPageHeader";
import "./DeviceForm.css";

export default function AddDevice() {
    const navigate = useNavigate();

    const [device, setDevice] = useState({
        imei: "",
        qr: "",
        productionWarehouse: "",
        remarks: "",
    });

    const handleChange = (e) => {
        setDevice({ ...device, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Device Data:", device);
        navigate("/devices");
    };

    return (
        <div className="lender-form-page">
            <LenderPageHeader
                title="Device Master"
                breadcrumbLabel="Device"
            />

            <div className="edit-lender-page">
                <div className="card device-card full-width">
                    <h2 className="edit-lender-title">Add Device</h2>

                    <form className="device-form" onSubmit={handleSubmit}>
                        <section>
                            <h3>Device Details</h3>
                            <div className="device-grid">
                                <input
                                    name="imei"
                                    placeholder="IMEI"
                                    onChange={handleChange}
                                />
                                <input
                                    name="qr"
                                    placeholder="QR Code"
                                    onChange={handleChange}
                                />
                                <input
                                    name="productionWarehouse"
                                    placeholder="Production Warehouse"
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        <section>
                            <h3>Remarks</h3>
                            <textarea
                                name="remarks"
                                placeholder="Remarks"
                                onChange={handleChange}
                            />
                        </section>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="secondary"
                                onClick={() => navigate("/devices")}
                            >
                                Back
                            </button>
                            <button type="submit" className="submit-btn">
                                Save Device
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}