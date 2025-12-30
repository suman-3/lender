import { useLocation, useNavigate } from "react-router-dom";
import LenderPageHeader from "../components/LenderPageHeader";
import "./DeviceMovement.css";

export default function DeviceMovementDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div className="lender-page">
            <LenderPageHeader
                title="Movement Detail"
                breadcrumbLabel="Device > Movement > View"
            />

            <div className="card movement-detail">
                <p><b>IMEI:</b> {state?.imei}</p>
                <p><b>Movement:</b> {state?.movementType}</p>
                <p><b>From:</b> {state?.from}</p>
                <p><b>To:</b> {state?.to}</p>
                <p><b>Status:</b> {state?.status}</p>
                <p><b>Dispatched:</b> {state?.dispatchedAt}</p>

                <button onClick={() => navigate("/device-movement")}>
                    Back
                </button>
            </div>
        </div>
    );
}