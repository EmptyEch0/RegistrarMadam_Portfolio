import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, AlertCircle, Eye } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onView?: (row: T) => void;
  loading?: boolean;
}

export default function AdminTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  loading = false,
}: AdminTableProps<T>) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading data...</p>
        </div>
      </div>
    );
  }

  const handleDeleteClick = (row: T) => {
    if (deleteId === row.id) {
      // Confirm delete
      onDelete(row);
      setDeleteId(null);
    } else {
      // Show confirmation
      setDeleteId(row.id);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(null);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
            <tr>
              {columns.map((col, index) => (
                <motion.th
                  key={String(col.key)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={styles.th}
                >
                  {col.label}
                </motion.th>
              ))}
              <motion.th
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: columns.length * 0.05 }}
                style={{ ...styles.th, textAlign: "right" }}
              >
                Actions
              </motion.th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {data.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={columns.length + 1} style={styles.emptyCell}>
                    <AlertCircle size={24} style={{ marginBottom: "8px" }} />
                    <div>No records found ✨</div>
                    <p style={styles.emptySubtext}>
                      Start by adding your first entry
                    </p>
                  </td>
                </motion.tr>
              ) : (
                data.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: rowIndex * 0.03 }}
                    style={styles.tr}
                    className="table-row"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        style={styles.td}
                        data-label={col.label}
                      >
                        <span className="mobile-label">{col.label}:</span>
                        <span className="cell-content">
                          {col.render
                            ? col.render(row[col.key], row)
                            : String(row[col.key] ?? "")}
                        </span>
                      </td>
                    ))}
                    <td
                      style={{ ...styles.td, textAlign: "right" }}
                      data-label="Actions"
                    >
                      <AnimatePresence mode="wait">
                        {deleteId === row.id ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={styles.confirmContainer}
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteClick(row)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleDeleteClick(row);
                              }}
                              tabIndex={0}
                              style={styles.confirmBtn}
                              className="confirm-btn"
                            >
                              Confirm
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCancelDelete}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleCancelDelete(e as any);
                              }}
                              tabIndex={0}
                              style={styles.cancelBtn}
                              className="cancel-btn"
                            >
                              Cancel
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="actions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={styles.actionButtons}
                          >
                            {onView && (
                              <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onView(row)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") onView(row);
                                }}
                                tabIndex={0}
                                style={{
                                  ...styles.actionBtn,
                                  ...styles.viewBtn,
                                }}
                                className="action-btn view-btn"
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEdit(row)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") onEdit(row);
                              }}
                              tabIndex={0}
                              style={{ ...styles.actionBtn, ...styles.editBtn }}
                              className="action-btn edit-btn"
                            >
                              <Edit2 size={14} />
                              <span>Edit</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setDeleteId(row.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") setDeleteId(row.id);
                              }}
                              tabIndex={0}
                              style={{
                                ...styles.actionBtn,
                                ...styles.deleteBtn,
                              }}
                              className="action-btn delete-btn"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Inline styles with animations */}
      <style>{keyframes}</style>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    borderRadius: "16px",
    background: "#FFFFFF", /* White cards */
    boxShadow: "0 4px 20px -2px rgba(51, 65, 85, 0.05)",
    animation: "fadeUp 0.6s ease",
    border: "1px solid #E7E2D8", /* Subtle warm-grey borders */
    overflow: "hidden",
  },

  tableContainer: {
    overflowX: "auto",
    maxHeight: "70vh",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
    fontSize: "14px",
    color: "#334155", /* Slate main text */
  },

  th: {
    padding: "16px 18px",
    textAlign: "left",
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: "#FAF8F5", /* Ivory background */
    borderBottom: "1.5px solid #E7E2D8", /* Subtle warm-grey borders */
    color: "#0B132B", /* Navy headings */
  },

  tr: {
    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    cursor: "pointer",
  },

  td: {
    padding: "14px 18px",
    borderBottom: "1px solid #E7E2D8", /* Subtle warm-grey borders */
    color: "#334155", /* Slate main text */
    transition: "all 0.2s ease",
  },

  emptyCell: {
    padding: "48px 32px",
    textAlign: "center",
    color: "#64748B", /* Muted slate */
    fontWeight: 500,
    fontSize: "14px",
    animation: "fadeUp 0.5s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  emptySubtext: {
    fontSize: "13px",
    color: "#64748B", /* Muted slate */
    marginTop: "8px",
    opacity: 0.85,
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  confirmContainer: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  actionBtn: {
    padding: "7px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "12.5px",
    fontWeight: 600,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    position: "relative",
    overflow: "hidden",
  },

  viewBtn: {
    background: "#2563EB", /* Information / PDF Blue */
    color: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
  },

  editBtn: {
    background: "#C59B27", /* Gold primary button */
    color: "#0B132B", /* Navy text */
    boxShadow: "0 2px 8px rgba(197, 155, 39, 0.25)",
  },

  deleteBtn: {
    background: "#B42318", /* Error / delete Red */
    color: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(180, 35, 24, 0.25)",
  },

  confirmBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    background: "#B42318", /* Red */
    color: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(180, 35, 24, 0.35)",
    transition: "all 0.2s ease",
  },

  cancelBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1.5px solid #C59B27", /* Gold outline */
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    background: "#FFFFFF", /* White button */
    color: "#0B132B", /* Navy text */
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
  },

  loadingContainer: {
    padding: "48px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },

  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #E7E2D8",
    borderTopColor: "#C59B27", /* Gold spinner */
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    color: "#64748B", /* Muted slate */
    fontSize: "14px",
    fontWeight: 500,
  },
};

/* ===================== KEYFRAMES ===================== */

const keyframes = `
/* Fade up animation */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spinner animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Row hover effects */
.table-row:hover td {
  background: #FAF8F5; /* Ivory hover */
}

/* Button hover effects */
.view-btn:hover {
  background: #1D4ED8;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.edit-btn:hover {
  background: #B58C1F;
  box-shadow: 0 4px 14px rgba(197, 155, 39, 0.35);
  transform: translateY(-1px);
}

.delete-btn:hover {
  background: #991B1B;
  box-shadow: 0 4px 14px rgba(180, 35, 24, 0.35);
  transform: translateY(-1px);
}

.confirm-btn:hover {
  background: #991B1B;
  box-shadow: 0 4px 12px rgba(180, 35, 24, 0.4);
  transform: scale(1.03);
}

.cancel-btn:hover {
  background: #FAF8F5;
  border-color: #B58C1F;
  transform: scale(1.03);
}

/* Focus states for accessibility */
.action-btn:focus,
.confirm-btn:focus,
.cancel-btn:focus {
  outline: 2px solid #C59B27;
  outline-offset: 2px;
}

.delete-btn:focus {
  outline: 2px solid #B42318;
}

.view-btn:focus {
  outline: 2px solid #2563EB;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .table-row {
    display: block;
    margin-bottom: 16px;
    border-radius: 12px;
    background: #FFFFFF;
    border: 1px solid #E7E2D8;
    box-shadow: 0 4px 16px rgba(51, 65, 85, 0.06);
    overflow: hidden;
  }

  .table-row:hover {
    transform: translateY(-2px);
  }

  thead {
    display: none;
  }

  table {
    min-width: unset !important;
  }

  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px !important;
    border-bottom: 1px solid #E7E2D8 !important;
    text-align: left !important;
  }

  td:last-child {
    border-bottom: none !important;
    background: #FAF8F5;
  }

  .mobile-label {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #0B132B; /* Navy headings */
    letter-spacing: 0.5px;
    display: block;
  }

  .cell-content {
    text-align: right;
    flex: 1;
    margin-left: 12px;
    color: #334155; /* Slate main text */
  }

  .action-buttons,
  .confirm-container {
    width: 100%;
    justify-content: stretch !important;
  }

  .action-btn,
  .confirm-btn,
  .cancel-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .action-btn span {
    display: none;
  }

  .action-btn {
    padding: 9px 12px;
  }

  .confirm-btn,
  .cancel-btn {
    padding: 8px 12px;
  }
}

/* Desktop: hide mobile labels */
@media (min-width: 769px) {
  .mobile-label {
    display: none;
  }
}

/* Smooth scrolling on mobile */
.tableContainer {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #E7E2D8 transparent;
}

.tableContainer::-webkit-scrollbar {
  height: 8px;
}

.tableContainer::-webkit-scrollbar-track {
  background: #FAF8F5;
  border-radius: 10px;
}

.tableContainer::-webkit-scrollbar-thumb {
  background: #E7E2D8;
  border-radius: 10px;
}

.tableContainer::-webkit-scrollbar-thumb:hover {
  background: #C59B27;
}
`;