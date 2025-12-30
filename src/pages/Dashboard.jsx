import { useState, useMemo } from "react";
import "./Dashboard.css";

const TICKETS = [
  { id: 201, title: "Login issue", createdBy: "Pineapple Inc.", assignedTo: "Support A", cost: 90, status: "Accepted" },
  { id: 202, title: "Payment failure", createdBy: "ME Inc.", assignedTo: "Support B", cost: 120, status: "Pending" },
  { id: 203, title: "UI bug", createdBy: "Redq Inc.", assignedTo: "Support C", cost: 70, status: "Closed" },
  { id: 204, title: "API timeout", createdBy: "Acme Corp.", assignedTo: "Support A", cost: 150, status: "Rejected" },
  { id: 205, title: "Report issue", createdBy: "Globex", assignedTo: "Support B", cost: 60, status: "Accepted" },
];

export default function Dashboard() {
  const [filter, setFilter] = useState("ALL");

  const filteredTickets = useMemo(() => {
    if (filter === "ALL") return TICKETS;
    return TICKETS.filter((t) => t.status === filter);
  }, [filter]);

  const counts = useMemo(() => {
    return {
      total: TICKETS.length,
      accepted: TICKETS.filter(t => t.status === "Accepted").length,
      pending: TICKETS.filter(t => t.status === "Pending").length,
      closed: TICKETS.filter(t => t.status === "Closed").length,
      rejected: TICKETS.filter(t => t.status === "Rejected").length,
    };
  }, []);

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>All Tickets</h2>
          <p className="breadcrumb">Home • Tickets</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <SummaryCard title="Total" value={counts.total} color="blue" />
        <SummaryCard title="Accepted" value={counts.accepted} color="green" />
        <SummaryCard title="Pending" value={counts.pending} color="orange" />
        <SummaryCard title="Closed" value={counts.closed} color="teal" />
        <SummaryCard title="Rejected" value={counts.rejected} color="red" />
      </div>

      {/* FILTERS */}
      <div className="dashboard-filters">
        {["ALL", "Accepted", "Pending", "Closed", "Rejected"].map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TICKET TABLE */}
      <div className="ticket-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Created By</th>
              <th>Assigned To</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.createdBy}</td>
                <td>{t.assignedTo}</td>
                <td>{t.cost}</td>
                <td>
                  <span className={`status-pill ${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <div className="empty">No tickets found</div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`summary-card ${color}`}>
      <h4>{title}</h4>
      <p>{value} Tickets</p>
    </div>
  );
}
