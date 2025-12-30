import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LenderPageHeader from "../components/LenderPageHeader";
import "./DeviceForm.css";

export default function EditDevice() {
    const navigate = useNavigate();
    const location = useLocation();

    const [device, setDevice] = useState({
        imei: "",
        qr: "",
        productionWarehouse: "",
        remarks: "",
    });

    useEffect(() => {
        if (location.state) {
            setDevice(location.state);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setDevice({ ...device, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Device:", device);
        navigate("/devices");
    };

    return (
        <div className="lender-form-page">
            <LenderPageHeader
                title="Device Master"
                breadcrumbLabel="Device > Edit"
            />

            <div className="edit-lender-page">
                <div className="card device-card full-width">
                    <h2 className="edit-lender-title">Edit Device</h2>

                    <form className="device-form" onSubmit={handleSubmit}>
                        <section>
                            <h3>Device Details</h3>
                            <div className="device-grid">
                                <input
                                    name="imei"
                                    value={device.imei}
                                    readOnly
                                />
                                <input
                                    name="qr"
                                    value={device.qr}
                                    onChange={handleChange}
                                />
                                <input
                                    name="productionWarehouse"
                                    value={device.productionWarehouse}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        <section>
                            <h3>Remarks</h3>
                            <textarea
                                name="remarks"
                                value={device.remarks}
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
                                Update Device
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}