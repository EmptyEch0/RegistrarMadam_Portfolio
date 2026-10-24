import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, FileText, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string; // base64 data URL or external URL
  fileName?: string;
  studentName?: string;
  rollNo?: string;
  submittedAt?: string;
}

export function PdfPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  fileName = "Assignment_Submission.pdf",
  studentName,
  rollNo,
  submittedAt,
}: PdfPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !pdfUrl) return null;

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      window.open(pdfUrl, "_blank");
    }
  };

  const modalTarget = typeof document !== "undefined"
    ? document.getElementById("modal-root") || document.body
    : null;

  if (!modalTarget) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border w-full max-w-4xl h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-muted/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-base sm:text-lg text-primary truncate max-w-[280px] sm:max-w-md">
                  {fileName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 uppercase tracking-wider">
                  PDF Document
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {studentName ? `${studentName} ` : ""}
                {rollNo ? `(${rollNo})` : ""}
                {submittedAt ? ` · Submitted: ${new Date(submittedAt).toLocaleString()}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs flex items-center gap-1.5 font-semibold"
            >
              <Download size={14} /> Download PDF
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close PDF Viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Frame / Embed */}
        <div className="flex-1 bg-slate-900 relative">
          <iframe
            src={pdfUrl}
            title={fileName}
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Official Assignment Submission Document</span>
          <button
            onClick={handleDownload}
            className="text-accent hover:underline font-medium inline-flex items-center gap-1"
          >
            Direct download link <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>,
    modalTarget
  );
}
