import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, X } from "lucide-react";
import { getInstallationRequisitions } from "../api/installationRequisitionApi";
import "./Dashboard.css";

const formatDate = (isoDateString) => {
  if (!isoDateString) return "N/A";
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "N/A";
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return "N/A";
  }
};

const formatDateTime = (isoDateString) => {
  if (!isoDateString) return "N/A";
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "N/A";
    
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "N/A";
  }
};

const getStatusBadgeStyle = (status) => {
  const styles = {
    NEW: { backgroundColor: "#e3f2fd", color: "#1976d2" },
    ASSIGNED: { backgroundColor: "#fff3e0", color: "#f57c00" },
    IN_PROGRESS: { backgroundColor: "#fff9c4", color: "#f57f17" },
    COMPLETED: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    VERIFIED: { backgroundColor: "#e0f2f1", color: "#00796b" },
    CLOSED: { backgroundColor: "#f3e5f5", color: "#7b1fa2" },
    CANCELLED: { backgroundColor: "#ffebee", color: "#c62828" },
  };
  return styles[status] || { backgroundColor: "#f5f5f5", color: "#666" };
};

const getPriorityBadge = (priority) => {
  const styles = {
    LOW: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    NORMAL: { backgroundColor: "#e3f2fd", color: "#1976d2" },
    HIGH: { backgroundColor: "#fff3e0", color: "#f57c00" },
    URGENT: { backgroundColor: "#ffebee", color: "#c62828" },
  };
  return styles[priority] || { backgroundColor: "#f5f5f5", color: "#666" };
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    setLoading(true);
    setError(null);

    const params = {
      limit: 1000,
    };

    const result = await getInstallationRequisitions(params);

    if (result.success) {
      setRequisitions(result.data);
    } else {
      setError(result.error);
      setRequisitions([]);
    }

    setLoading(false);
  };

  const filteredRequisitions = useMemo(() => {
    let filtered = requisitions;

    if (filter !== "ALL") {
      filtered = filtered.filter((r) => r.status === filter);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.requisitionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customerMobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.branchId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [requisitions, filter, searchTerm]);

  const counts = useMemo(() => {
    return {
      total: requisitions.length,
      new: requisitions.filter((r) => r.status === "NEW").length,
      assigned: requisitions.filter((r) => r.status === "ASSIGNED").length,
      inProgress: requisitions.filter((r) => r.status === "IN_PROGRESS").length,
      completed: requisitions.filter((r) => r.status === "COMPLETED").length,
      verified: requisitions.filter((r) => r.status === "VERIFIED").length,
      closed: requisitions.filter((r) => r.status === "CLOSED").length,
      cancelled: requisitions.filter((r) => r.status === "CANCELLED").length,
    };
  }, [requisitions]);

  const handleViewDetails = (requisition) => {
    setSelectedRequisition(requisition);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequisition(null);
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>Installation Requisitions</h2>
          <p className="breadcrumb">Home • Dashboard • Requisitions</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <SummaryCard title="Total" value={counts.total} color="blue" onClick={() => setFilter("ALL")} active={filter === "ALL"} />
        <SummaryCard title="New" value={counts.new} color="sky" onClick={() => setFilter("NEW")} active={filter === "NEW"} />
        <SummaryCard title="Assigned" value={counts.assigned} color="orange" onClick={() => setFilter("ASSIGNED")} active={filter === "ASSIGNED"} />
        <SummaryCard title="In Progress" value={counts.inProgress} color="yellow" onClick={() => setFilter("IN_PROGRESS")} active={filter === "IN_PROGRESS"} />
        <SummaryCard title="Completed" value={counts.completed} color="green" onClick={() => setFilter("COMPLETED")} active={filter === "COMPLETED"} />
        <SummaryCard title="Verified" value={counts.verified} color="teal" onClick={() => setFilter("VERIFIED")} active={filter === "VERIFIED"} />
        <SummaryCard title="Closed" value={counts.closed} color="purple" onClick={() => setFilter("CLOSED")} active={filter === "CLOSED"} />
        <SummaryCard title="Cancelled" value={counts.cancelled} color="red" onClick={() => setFilter("CANCELLED")} active={filter === "CANCELLED"} />
      </div>

      {/* SEARCH */}
      <div style={{ padding: "0 1.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by requisition no, vehicle no, customer name, mobile, or branch ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          style={{
            margin: "0 1.5rem 1rem 1.5rem",
            padding: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {/* REQUISITION TABLE */}
      <div className="ticket-card">
        <table>
          <thead>
            <tr>
              <th>Requisition No</th>
              <th>Branch ID</th>
              <th>Vehicle No</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Device Type</th>
              <th>Priority</th>
              <th>Requested At</th>
              <th>Preferred Date</th>
              <th>Status</th>
              <th>Completed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  {[...Array(12)].map((_, colIndex) => (
                    <td key={colIndex}>
                      <div className="skeleton-line" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredRequisitions.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", padding: "2rem" }}>
                  No requisitions found
                </td>
              </tr>
            ) : (
              filteredRequisitions.map((req) => (
                <tr key={req.id}>
                  <td>
                    <strong>{req.requisitionNo}</strong>
                  </td>
                  <td>{req.branchId || "N/A"}</td>
                  <td>{req.vehicleNo}</td>
                  <td>{req.customerName}</td>
                  <td>{req.customerMobile}</td>
                  <td>{req.deviceType}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        ...getPriorityBadge(req.priority),
                      }}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.9rem" }}>{formatDate(req.requestedAt)}</td>
                  <td style={{ fontSize: "0.9rem" }}>{formatDate(req.preferredInstallationDate)}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        ...getStatusBadgeStyle(req.status),
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        backgroundColor: req.completedAt != null ? "#e8f5e9" : "#ffebee",
                        color: req.completedAt != null ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {req.completedAt != null ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleViewDetails(req)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && selectedRequisition && (
        <RequisitionModal requisition={selectedRequisition} onClose={handleCloseModal} />
      )}
    </div>
  );
}

function SummaryCard({ title, value, color, onClick, active }) {
  return (
    <div 
      className={`summary-card ${color} ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer', border: active ? '2px solid #1976d2' : 'none' }}
    >
      <h4>{title}</h4>
      <p>{value} Requisitions</p>
    </div>
  );
}

function RequisitionModal({ requisition, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2 style={{ margin: 0 }}>{requisition.requisitionNo}</h2>
            <p style={{ margin: "0.5rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
              ID: {requisition.id} | Branch ID: {requisition.branchId || "N/A"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="modal-body">
          {/* STATUS & PRIORITY */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.9rem",
                fontWeight: "500",
                ...getStatusBadgeStyle(requisition.status),
              }}
            >
              {requisition.status}
            </span>
            <span
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.9rem",
                fontWeight: "500",
                ...getPriorityBadge(requisition.priority),
              }}
            >
              {requisition.priority} Priority
            </span>
            <span
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.9rem",
                fontWeight: "500",
                backgroundColor: requisition.completedAt != null ? "#e8f5e9" : "#ffebee",
                color: requisition.completedAt != null ? "#2e7d32" : "#c62828",
              }}
            >
              {requisition.completedAt != null ? "Completed" : "Not Completed"}
            </span>
          </div>

          {/* VEHICLE & CUSTOMER INFO */}
          <div className="modal-section">
            <h4>Vehicle & Customer Information</h4>
            <div className="info-grid">
              <div>
                <label>Branch ID</label>
                <p>{requisition.branchId || "N/A"}</p>
              </div>
              <div>
                <label>Vehicle Number</label>
                <p>{requisition.vehicleNo}</p>
              </div>
              <div>
                <label>Customer Name</label>
                <p>{requisition.customerName}</p>
              </div>
              <div>
                <label>Customer Mobile</label>
                <p>{requisition.customerMobile}</p>
              </div>
              <div>
                <label>Aadhaar Number</label>
                <p>{requisition.customerAadhaarNo || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* INSTALLATION ADDRESS */}
          <div className="modal-section">
            <h4>Installation Address</h4>
            <p><strong>Address:</strong> {requisition.installationAddress}</p>
            <div className="info-grid">
              <div>
                <label>State</label>
                <p>{requisition.state}</p>
              </div>
              <div>
                <label>District</label>
                <p>{requisition.district}</p>
              </div>
              <div>
                <label>Pincode</label>
                <p>{requisition.pincode}</p>
              </div>
            </div>
            {requisition.latitude && requisition.longitude && (
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Coordinates:</strong> {requisition.latitude}, {requisition.longitude}
              </p>
            )}
          </div>

          {/* DEVICE INFO */}
          <div className="modal-section">
            <h4>Device Information</h4>
            <div className="info-grid">
              <div>
                <label>Device Type</label>
                <p>{requisition.deviceType}</p>
              </div>
              <div>
                <label>Quantity</label>
                <p>{requisition.quantity || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="modal-section">
            <h4>Timeline</h4>
            <div className="info-grid">
              <div>
                <label>Requested At</label>
                <p>{formatDateTime(requisition.requestedAt)}</p>
              </div>
              <div>
                <label>Preferred Installation Date</label>
                <p>{formatDate(requisition.preferredInstallationDate)}</p>
              </div>
              <div>
                <label>TAT Hours</label>
                <p>{requisition.tatHours} hours</p>
              </div>
              <div>
                <label>Installation Finish Time</label>
                <p>{formatDateTime(requisition.installationFinishTimeAssigned)}</p>
              </div>
              <div>
                <label>Completed At</label>
                <p>{requisition.completedAt != null ? formatDateTime(requisition.completedAt) : "Not Completed"}</p>
              </div>
            </div>
          </div>

          {/* AADHAAR VERIFICATION */}
          <div className="modal-section">
            <h4>Aadhaar Verification</h4>
            <div className="info-grid">
              <div>
                <label>Verification Status</label>
                <p>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      backgroundColor: requisition.aadhaarVerificationStatus === "VERIFIED" ? "#e8f5e9" : "#ffebee",
                      color: requisition.aadhaarVerificationStatus === "VERIFIED" ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {requisition.aadhaarVerificationStatus || "N/A"}
                  </span>
                </p>
              </div>
              {requisition.aadhaarVerifiedAt && (
                <div>
                  <label>Verified At</label>
                  <p>{formatDateTime(requisition.aadhaarVerifiedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* CHECKLIST */}
          <div className="modal-section">
            <h4>Installation Checklist</h4>
            <div className="info-grid">
              <div>
                <label>GSM Checklist</label>
                <p>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      backgroundColor: requisition.gsmChecklist === "PASS" ? "#e8f5e9" : "#ffebee",
                      color: requisition.gsmChecklist === "PASS" ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {requisition.gsmChecklist || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <label>GPS Checklist</label>
                <p>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      backgroundColor: requisition.gpsChecklist === "PASS" ? "#e8f5e9" : "#ffebee",
                      color: requisition.gpsChecklist === "PASS" ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {requisition.gpsChecklist || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <label>Main Power Checklist</label>
                <p>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      backgroundColor: requisition.mainPowerChecklist === "PASS" ? "#e8f5e9" : "#ffebee",
                      color: requisition.mainPowerChecklist === "PASS" ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {requisition.mainPowerChecklist || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <label>Battery Backup Status</label>
                <p>{requisition.batteryBackupStatus || "N/A"}</p>
              </div>
              {requisition.checklistVerifiedAt && (
                <div>
                  <label>Checklist Verified At</label>
                  <p>{formatDateTime(requisition.checklistVerifiedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* VALIDATION */}
          <div className="modal-section">
            <h4>Validation</h4>
            <p>
              <strong>Xconics Validation:</strong>{" "}
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  backgroundColor: requisition.xconicsValidation ? "#e8f5e9" : "#ffebee",
                  color: requisition.xconicsValidation ? "#2e7d32" : "#c62828",
                }}
              >
                {requisition.xconicsValidation ? "VALIDATED" : "NOT VALIDATED"}
              </span>
            </p>
          </div>

          {/* REMARKS */}
          {requisition.remarks && (
            <div className="modal-section">
              <h4>Remarks</h4>
              <p style={{ padding: "0.75rem", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
                {requisition.remarks}
              </p>
            </div>
          )}

          {/* TIMESTAMPS */}
          <div className="modal-section">
            <h4>Record Information</h4>
            <div className="info-grid">
              <div>
                <label>Created At</label>
                <p>{formatDateTime(requisition.createdAt)}</p>
              </div>
              <div>
                <label>Updated At</label>
                <p>{formatDateTime(requisition.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
