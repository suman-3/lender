import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import "./DeviceMovementTableCard.css";

export default function DeviceMovementTableCard({ movements = [] }) {
    const navigate = useNavigate();

    return (
        <div className="device-movement-table-wrapper">
            <div className="card device-movement-table-card">
                <table>
                    <thead>
                        <tr>
                            <th>IMEI</th>
                            <th>Movement Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                            <th>Dispatched At</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {movements.map((m) => (
                            <tr key={m.id}>
                                <td>{m.device?.imei}</td>
                                <td>{m.movementType}</td>
                                <td>{getFrom(m)}</td>
                                <td>{getTo(m)}</td>
                                <td>
                                    <span className={`status-chip ${m.movementStatus.toLowerCase()}`}>
                                        {m.movementStatus}
                                    </span>
                                </td>
                                <td>{m.dispatchedAt}</td>
                                <td>
                                    <button
                                        className="icon-btn"
                                        onClick={() =>
                                            navigate(`/device-movement/view/${m.id}`, { state: m })
                                        }
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* helpers */
const getFrom = (row) => {
    if (row.fromEntityWarehouse) return row.fromEntityWarehouse.warehouseCode;
    if (row.fromEntityFieldEngineer) return row.fromEntityFieldEngineer.engineerCode;
    if (row.fromEntityVehicle) return row.fromEntityVehicle.vehicleNo;
    return "-";
};

const getTo = (row) => {
    if (row.toEntityWarehouse) return row.toEntityWarehouse.warehouseCode;
    if (row.toEntityFieldEngineer) return row.toEntityFieldEngineer.engineerCode;
    if (row.toEntityVehicle) return row.toEntityVehicle.vehicleNo;
    return "-";
};