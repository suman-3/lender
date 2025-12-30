import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, ArrowUp, ArrowDown, Truck } from "lucide-react";
import "./DeviceTableCard.css";

export default function DeviceTableCard() {
    const navigate = useNavigate();

    /* =====================
       DUMMY DEVICE DATA
       ===================== */
    const [devices, setDevices] = useState([
        {
            id: 1,
            imei: "867530912345678",
            qr: "QR-DEV-001",
            locationType: "PRODUCTION_FLOOR",
            currentLocation: "PF-1",
            status: "AVAILABLE",
        },
        {
            id: 2,
            imei: "867530912345679",
            qr: "QR-DEV-002",
            locationType: "WAREHOUSE",
            currentLocation: "Kolkata Warehouse",
            status: "IN_STOCK",
        },
        {
            id: 3,
            imei: "867530912345680",
            qr: "QR-DEV-003",
            locationType: "FIELD_ENGINEER",
            currentLocation: "Amit Kumar",
            status: "ASSIGNED",
        },
        {
            id: 4,
            imei: "867530912345681",
            qr: "QR-DEV-004",
            locationType: "VEHICLE",
            currentLocation: "WB02AB1234",
            status: "INSTALLED",
        },
    ]);

    /* =====================
       SORTING
       ===================== */
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                if (prev.direction === "asc") return { key, direction: "desc" };
                if (prev.direction === "desc") return { key: null, direction: null };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return devices;

        return [...devices].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [devices, sortConfig]);

    /* =====================
       PAGINATION
       ===================== */
    const rowsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = sortedData.slice(startIndex, startIndex + rowsPerPage);

    /* =====================
       SORT ICON
       ===================== */
    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === "asc" ? (
            <ArrowUp size={14} />
        ) : (
            <ArrowDown size={14} />
        );
    };

    return (
        <div className="device-table-wrapper">
            <div className="card device-table-card">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("imei")}>
                                IMEI <SortIcon column="imei" />
                            </th>
                            <th onClick={() => handleSort("qr")}>
                                QR Code <SortIcon column="qr" />
                            </th>
                            <th onClick={() => handleSort("locationType")}>
                                Location Type <SortIcon column="locationType" />
                            </th>
                            <th onClick={() => handleSort("currentLocation")}>
                                Current Location <SortIcon column="currentLocation" />
                            </th>
                            <th onClick={() => handleSort("status")}>
                                Status <SortIcon column="status" />
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentRows.map((dev) => (
                            <tr key={dev.id}>
                                <td>{dev.imei}</td>
                                <td>{dev.qr}</td>
                                <td>{dev.locationType}</td>
                                <td>{dev.currentLocation}</td>
                                <td>
                                    <span className={`status-chip ${dev.status.toLowerCase()}`}>
                                        {dev.status}
                                    </span>
                                </td>

                                <td>
                                    {/* VIEW */}
                                    <button
                                        className="icon-btn"
                                        onClick={() =>
                                            navigate(`/devices/view/${dev.id}`, { state: dev })
                                        }
                                    >
                                        <Eye size={16} />
                                    </button>

                                    {/* EDIT */}
                                    <button
                                        className="icon-btn"
                                        onClick={() =>
                                            navigate(`/devices/edit/${dev.id}`, { state: dev })
                                        }
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    {/* MOVE DEVICE */}
                                    <button
                                        className="icon-btn"
                                        title="Move Device"
                                        onClick={() =>
                                            navigate(`/devices/move/${dev.id}`, { state: dev })
                                        }
                                    >
                                        <Truck size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}