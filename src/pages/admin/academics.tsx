import { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  Save,
  Trash2,
  Calendar,
  AlertCircle,
  Download,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  AcademicBatch,
  BatchAssignment,
  AssignmentSubmission,
  StudentMarksRecord,
  DegreeProgram,
  getAllBatches,
  createOrUpdateBatch,
  deleteBatch,
  addStudentToBatch,
  addBulkStudentsToBatch,
  removeStudentFromBatch,
  getAllAssignments,
  createAssignment,
  deleteAssignment,
  getAllSubmissions,
  getAllMarksRecords,
  saveStudentMarks,
  getAllStudentAccounts,
  findStudentAccountByRoll,
  normalizeRollNo,
  IOT_BATCH_ID,
  IOT_BATCH_MID1_MARKS,
} from "@/lib/academicsStorage";
import { PdfPreviewModal } from "@/components/ui/PdfPreviewModal";

export default function AdminAcademics() {
  const [batches, setBatches] = useState<AcademicBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [assignments, setAssignments] = useState<BatchAssignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [marksRecords, setMarksRecords] = useState<StudentMarksRecord[]>([]);

  // Modals state
  const [newBatchModalOpen, setNewBatchModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [newAssignmentModalOpen, setNewAssignmentModalOpen] = useState(false);

  // New Batch Form State
  const [newProgram, setNewProgram] = useState<DegreeProgram>("B.Tech");
  const [newYear, setNewYear] = useState("3rd Year");
  const [newBatchYear, setNewBatchYear] = useState("2026");
  const [newBranch, setNewBranch] = useState("Information Technology");

  // Add Student Form State
  const [addStudentMode, setAddStudentMode] = useState<"single" | "bulk">("single");
  const [singleRollNo, setSingleRollNo] = useState("");
  const [singleName, setSingleName] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [bulkFeedback, setBulkFeedback] = useState("");

  // New Assignment Form State
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("2026-11-15");
  const [assignMaxMarks, setAssignMaxMarks] = useState<number>(40);
  const [assignType, setAssignType] = useState("Mid 1 Assignment");

  // Selected Assignment for viewing submissions
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");

  // Local table editable marks state: rollNo -> { midMarks, mid2Marks, assignmentMarks, remarks, saved }
  const [marksEdits, setMarksEdits] = useState<Record<string, {
    midMarks: string;
    mid2Marks: string;
    assignmentMarks: string;
    remarks: string;
    justSaved?: boolean;
  }>>({});

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "accounts_created" | "submitted" | "pending_marks">("all");

  // PDF Preview Modal
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState("");
  const [previewStudentName, setPreviewStudentName] = useState("");
  const [previewRollNo, setPreviewRollNo] = useState("");

  // Reload all data
  const loadData = () => {
    const allB = getAllBatches();
    setBatches(allB);
    if (!selectedBatchId && allB.length > 0) {
      setSelectedBatchId(allB[0].id);
    }
    setAssignments(getAllAssignments());
    setSubmissions(getAllSubmissions());
    setMarksRecords(getAllMarksRecords());
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const activeAssignments = activeBatch
    ? assignments.filter((a) => a.batchId === activeBatch.id)
    : [];
  const currentAssignment =
    activeAssignments.find((a) => a.id === selectedAssignmentId) || activeAssignments[0];

  // Initialize/sync marks edits whenever activeBatch or marksRecords change
  useEffect(() => {
    if (!activeBatch) return;
    const initialEdits: typeof marksEdits = {};
    for (const st of activeBatch.students) {
      const norm = normalizeRollNo(st.rollNo);
      const existing = marksRecords.find(
        (m) => normalizeRollNo(m.rollNo) === norm && m.batchId === activeBatch.id
      );
      const defaultMid = activeBatch.id === IOT_BATCH_ID
        ? (IOT_BATCH_MID1_MARKS[norm]?.midMarks ?? "0")
        : "";
      const defaultRemarks = activeBatch.id === IOT_BATCH_ID
        ? (IOT_BATCH_MID1_MARKS[norm]?.remarks ?? "")
        : "";

      initialEdits[norm] = {
        midMarks: existing?.midMarks !== undefined && existing?.midMarks !== "" ? existing.midMarks : defaultMid,
        mid2Marks: existing?.mid2Marks || "",
        assignmentMarks: existing?.assignmentMarks || "",
        remarks: existing?.remarks || defaultRemarks,
        justSaved: false,
      };
    }
    setMarksEdits(initialEdits);
  }, [activeBatch?.id, marksRecords]);

  // Handle Create Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batchLabel = `${newBatchYear} Year ${newProgram} ${newYear} (${newBranch})`;
    const created = createOrUpdateBatch({
      program: newProgram,
      year: newYear,
      batchYear: newBatchYear,
      branch: newBranch,
      name: batchLabel,
      students: [],
    });
    setNewBatchModalOpen(false);
    loadData();
    setSelectedBatchId(created.id);
  };

  // Handle Add Single Student
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !singleRollNo.trim() || !singleName.trim()) return;
    addStudentToBatch(activeBatch.id, singleRollNo, singleName, singleEmail);
    setSingleRollNo("");
    setSingleName("");
    setSingleEmail("");
    setAddStudentModalOpen(false);
    loadData();
  };

  // Handle Bulk Add Students
  const handleBulkAddStudents = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !bulkText.trim()) return;
    const res = addBulkStudentsToBatch(activeBatch.id, bulkText);
    setBulkFeedback(`Successfully added ${res.added} students and updated ${res.updated}.`);
    setTimeout(() => {
      setBulkFeedback("");
      setBulkText("");
      setAddStudentModalOpen(false);
      loadData();
    }, 1200);
  };

  // Handle Remove Student
  const handleRemoveStudent = (rollNo: string) => {
    if (!activeBatch) return;
    if (confirm(`Remove student ${rollNo} from this batch?`)) {
      removeStudentFromBatch(activeBatch.id, rollNo);
      loadData();
    }
  };

  // Handle Delete Batch
  const handleDeleteBatch = () => {
    if (!activeBatch) return;
    if (confirm(`Are you sure you want to delete batch "${activeBatch.name}"?`)) {
      deleteBatch(activeBatch.id);
      setSelectedBatchId("");
      loadData();
    }
  };

  // Handle Create Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch || !assignTitle.trim()) return;
    const newAss = createAssignment({
      batchId: activeBatch.id,
      title: assignTitle.trim(),
      description: assignDesc.trim(),
      dueDate: assignDueDate,
      maxMarks: Number(assignMaxMarks) || 40,
      assignmentType: assignType,
    });
    setNewAssignmentModalOpen(false);
    setAssignTitle("");
    setAssignDesc("");
    loadData();
    setSelectedAssignmentId(newAss.id);
  };

  // Handle Save Marks for a single student row
  const handleSaveMarks = (rollNo: string, studentName: string) => {
    if (!activeBatch) return;
    const norm = normalizeRollNo(rollNo);
    const rowEdit = marksEdits[norm] || {
      midMarks: "",
      mid2Marks: "",
      assignmentMarks: "",
      remarks: "",
    };

    saveStudentMarks(activeBatch.id, norm, {
      studentName,
      midMarks: rowEdit.midMarks,
      mid2Marks: rowEdit.mid2Marks,
      assignmentMarks: rowEdit.assignmentMarks,
      remarks: rowEdit.remarks,
    });

    setMarksEdits((prev) => ({
      ...prev,
      [norm]: {
        ...prev[norm],
        justSaved: true,
      },
    }));

    setTimeout(() => {
      setMarksEdits((prev) => ({
        ...prev,
        [norm]: {
          ...prev[norm],
          justSaved: false,
        },
      }));
    }, 2000);

    loadData();
  };

  // Handle Save All Marks for the entire active batch in one click
  const handleSaveAllMarks = () => {
    if (!activeBatch) return;
    for (const st of activeBatch.students) {
      const norm = normalizeRollNo(st.rollNo);
      const rowEdit = marksEdits[norm];
      if (rowEdit) {
        saveStudentMarks(activeBatch.id, norm, {
          studentName: st.name,
          midMarks: rowEdit.midMarks,
          mid2Marks: rowEdit.mid2Marks,
          assignmentMarks: rowEdit.assignmentMarks,
          remarks: rowEdit.remarks,
        });
      }
    }
    loadData();
    alert(`✅ Successfully saved and recorded marks for all ${activeBatch.students.length} students!`);
  };

  // Filter students
  const filteredStudents = (activeBatch?.students || []).filter((st) => {
    const norm = normalizeRollNo(st.rollNo);
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      norm.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const account = findStudentAccountByRoll(norm);
    const submission = submissions.find(
      (sub) => normalizeRollNo(sub.rollNo) === norm && (currentAssignment ? sub.assignmentId === currentAssignment.id : true)
    );
    const marks = marksRecords.find((m) => normalizeRollNo(m.rollNo) === norm && m.batchId === activeBatch.id);

    if (filterMode === "accounts_created") return Boolean(account);
    if (filterMode === "submitted") return Boolean(submission);
    if (filterMode === "pending_marks") return !marks?.midMarks;

    return true;
  });

  // Calculate Batch Summary Stats
  const totalStudents = activeBatch?.students.length || 0;
  const accountsCreatedCount = (activeBatch?.students || []).filter((s) =>
    Boolean(findStudentAccountByRoll(s.rollNo))
  ).length;
  const submissionsCount = (activeBatch?.students || []).filter((s) =>
    submissions.some(
      (sub) => normalizeRollNo(sub.rollNo) === normalizeRollNo(s.rollNo) && (currentAssignment ? sub.assignmentId === currentAssignment.id : true)
    )
  ).length;
  const evaluatedCount = (activeBatch?.students || []).filter((s) =>
    marksRecords.some(
      (m) => normalizeRollNo(m.rollNo) === normalizeRollNo(s.rollNo) && m.batchId === activeBatch.id && m.midMarks
    )
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-[#E7E2D8] rounded-2xl shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] text-[#C59B27] flex items-center justify-center shrink-0 border border-[#C59B27]/30">
              <GraduationCap size={26} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#0B132B] flex items-center gap-2">
                Academics Portal & Batch Management
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Manage B.Tech / M.Tech batches, monitor student account signups, evaluate assignment PDFs & publish mid marks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setNewAssignmentModalOpen(true)}
              disabled={!activeBatch}
              className="text-xs flex items-center gap-1.5 font-semibold px-3.5 py-2 rounded-xl bg-white border border-[#C59B27] text-[#0B132B] hover:bg-[#FAF8F5] transition-all disabled:opacity-50"
            >
              <FileText size={14} className="text-[#2563EB]" /> New Assignment
            </button>
            <button
              onClick={() => setNewBatchModalOpen(true)}
              className="text-xs flex items-center gap-1.5 font-semibold px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] shadow-xs transition-all"
            >
              <Plus size={15} /> Create Academic Batch
            </button>
          </div>
        </div>

        {/* ================= BATCH SELECTOR & TABS ================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B132B] flex items-center gap-1.5">
              <Users size={13} className="text-[#C59B27]" /> Active Batches ({batches.length})
            </h2>
            {activeBatch && (
              <button
                onClick={handleDeleteBatch}
                className="text-[11px] text-[#B42318] hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 size={12} /> Delete Current Batch
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {batches.map((batch) => {
              const isSelected = batch.id === activeBatch?.id;
              const stdCount = batch.students.length;
              const registered = batch.students.filter((s) => Boolean(findStudentAccountByRoll(s.rollNo))).length;

              return (
                <div
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "bg-[#FAF8F5] border-2 border-[#C59B27] shadow-sm"
                      : "bg-white border-[#E7E2D8] hover:border-[#C59B27]/50 hover:bg-[#FAF8F5]/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#C59B27] border border-[#C59B27]/30 uppercase tracking-wider">
                      {batch.program} · {batch.year}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#64748B]">
                      {batch.batchYear}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#0B132B] line-clamp-1">
                      {batch.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {batch.branch}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E7E2D8] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] font-medium">
                      {stdCount} Students
                    </span>
                    <span className="font-bold text-[#16845B]">
                      {registered} Signed Up
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= ACTIVE BATCH WORKBENCH ================= */}
        {activeBatch ? (
          <div className="space-y-5">
            {/* Batch Stats KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white border border-[#E7E2D8] shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Total Students
                </span>
                <p className="text-2xl font-bold font-mono text-[#0B132B] mt-1">
                  {totalStudents}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#16845B]/30 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16845B] flex items-center gap-1">
                  <CheckCircle2 size={12} /> Accounts Created
                </span>
                <p className="text-2xl font-bold font-mono text-[#16845B] mt-1">
                  {accountsCreatedCount} / {totalStudents}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#2563EB]/30 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1">
                  <FileText size={12} /> PDF Submissions
                </span>
                <p className="text-2xl font-bold font-mono text-[#2563EB] mt-1">
                  {submissionsCount} / {totalStudents}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#B86B00]/30 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86B00] flex items-center gap-1">
                  <Award size={12} /> Marks Evaluated
                </span>
                <p className="text-2xl font-bold font-mono text-[#B86B00] mt-1">
                  {evaluatedCount} / {totalStudents}
                </p>
              </div>
            </div>

            {/* Assignments Bar for Current Batch */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7E2D8] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#0B132B] uppercase tracking-wider">
                  Select Assignment:
                </span>
                {activeAssignments.length > 0 ? (
                  activeAssignments.map((ass) => (
                    <button
                      key={ass.id}
                      onClick={() => setSelectedAssignmentId(ass.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentAssignment?.id === ass.id
                          ? "bg-[#C59B27] text-[#0B132B] shadow-xs font-bold"
                          : "bg-[#FAF8F5] text-[#334155] border border-[#E7E2D8] hover:border-[#C59B27]"
                      }`}
                    >
                      {ass.title}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-[#64748B] italic">
                    No assignments created yet for this batch.
                  </span>
                )}
              </div>

              {currentAssignment && (
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <span>Due: {currentAssignment.dueDate}</span>
                  <span>·</span>
                  <span>Max Marks: {currentAssignment.maxMarks}</span>
                </div>
              )}
            </div>

            {/* Students Table Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by roll number or student name..."
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] text-[#334155] focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter Selector */}
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as any)}
                  className="text-xs py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] text-[#0B132B] focus:border-[#C59B27] focus:outline-none font-semibold"
                >
                  <option value="all">Show All Students</option>
                  <option value="accounts_created">Account Created Only</option>
                  <option value="submitted">Assignment Submitted Only</option>
                  <option value="pending_marks">Pending Marks Only</option>
                </select>

                <button
                  onClick={handleSaveAllMarks}
                  className="text-xs flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl bg-[#16845B] hover:bg-[#126B4A] text-white shadow-xs transition-all"
                  title="Save and publish all entered marks for this entire batch"
                >
                  <Check size={14} /> Save All Marks
                </button>

                <button
                  onClick={() => setAddStudentModalOpen(true)}
                  className="text-xs flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] shadow-xs transition-all"
                >
                  <Plus size={14} /> Add Students to Batch
                </button>
              </div>
            </div>

            {/* ================= STUDENT MANAGEMENT ROSTER TABLE ================= */}
            <div className="bg-white border border-[#E7E2D8] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E7E2D8] text-[#0B132B] font-bold">
                      <th className="py-3 px-3.5 w-10">#</th>
                      <th className="py-3 px-3.5">Roll Number</th>
                      <th className="py-3 px-3.5">Student Name</th>
                      <th className="py-3 px-3.5 text-center">Account Status</th>
                      <th className="py-3 px-3.5">Assignment PDF</th>
                      <th className="py-3 px-3.5 w-28">Mid-1 (Out of 30)</th>
                      <th className="py-3 px-3.5 w-28">Mid-2 (Out of 30)</th>
                      <th className="py-3 px-3.5 w-24">Assign Marks</th>
                      <th className="py-3 px-3.5">Remarks / Feedback</th>
                      <th className="py-3 px-3.5 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D8]">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, idx) => {
                        const norm = normalizeRollNo(student.rollNo);
                        const account = findStudentAccountByRoll(norm);
                        const submission = submissions.find(
                          (sub) =>
                            normalizeRollNo(sub.rollNo) === norm &&
                            (currentAssignment ? sub.assignmentId === currentAssignment.id : true)
                        );
                        const edit = marksEdits[norm] || {
                          midMarks: "",
                          mid2Marks: "",
                          assignmentMarks: "",
                          remarks: "",
                          justSaved: false,
                        };

                        return (
                          <tr
                            key={norm}
                            className="hover:bg-[#FAF8F5] transition-colors group"
                          >
                            <td className="py-3 px-3.5 text-[#64748B] font-mono">
                              {idx + 1}
                            </td>

                            {/* Roll Number */}
                            <td className="py-3 px-3.5 font-mono font-bold text-[#0B132B] whitespace-nowrap">
                              {norm}
                            </td>

                            {/* Student Name */}
                            <td className="py-3 px-3.5 font-semibold text-[#334155] whitespace-nowrap">
                              {student.name}
                              {student.email && (
                                <span className="block text-[10px] text-[#64748B] font-normal">
                                  {student.email}
                                </span>
                              )}
                            </td>

                            {/* Account Status Badge */}
                            <td className="py-3 px-3.5 text-center whitespace-nowrap">
                              {account ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/30 text-[11px] font-bold shadow-xs">
                                  <CheckCircle2 size={12} /> Account Created
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#B86B00]/10 text-[#B86B00] border border-[#B86B00]/30 text-[11px] font-medium">
                                  <Clock size={11} /> Pending Signup
                                </span>
                              )}
                            </td>

                            {/* Assignment PDF Submission View */}
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {submission ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-semibold text-[#2563EB] flex items-center gap-1">
                                    <FileText size={13} /> Submitted
                                  </span>
                                  <button
                                    onClick={() => {
                                      setPreviewPdfUrl(submission.fileDataUrl);
                                      setPreviewFileName(submission.fileName);
                                      setPreviewStudentName(student.name);
                                      setPreviewRollNo(norm);
                                    }}
                                    className="text-[10px] py-1 px-2.5 h-7 font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                                    title="View submitted PDF"
                                  >
                                    <Eye size={12} /> View PDF
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[#64748B] text-[11px] italic">
                                  Not submitted
                                </span>
                              )}
                            </td>

                            {/* Mid 1 Marks Input */}
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="Marks / 30"
                                value={edit.midMarks}
                                onChange={(e) =>
                                  setMarksEdits((prev) => ({
                                    ...prev,
                                    [norm]: {
                                      ...prev[norm],
                                      midMarks: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] text-[#334155] focus:border-[#C59B27] focus:bg-white focus:outline-none font-mono"
                              />
                            </td>

                            {/* Mid 2 Marks Input */}
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="Marks / 30"
                                value={edit.mid2Marks}
                                onChange={(e) =>
                                  setMarksEdits((prev) => ({
                                    ...prev,
                                    [norm]: {
                                      ...prev[norm],
                                      mid2Marks: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] text-[#334155] focus:border-[#C59B27] focus:bg-white focus:outline-none font-mono"
                              />
                            </td>

                            {/* Assignment Marks Input */}
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="e.g. 10/10"
                                value={edit.assignmentMarks}
                                onChange={(e) =>
                                  setMarksEdits((prev) => ({
                                    ...prev,
                                    [norm]: {
                                      ...prev[norm],
                                      assignmentMarks: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] text-[#334155] focus:border-[#C59B27] focus:bg-white focus:outline-none font-mono"
                              />
                            </td>

                            {/* Remarks Input */}
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                placeholder="Optional feedback..."
                                value={edit.remarks}
                                onChange={(e) =>
                                  setMarksEdits((prev) => ({
                                    ...prev,
                                    [norm]: {
                                      ...prev[norm],
                                      remarks: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] text-[#334155] focus:border-[#C59B27] focus:bg-white focus:outline-none"
                              />
                            </td>

                            {/* Save Action */}
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveMarks(norm, student.name)}
                                  className={`text-[10px] py-1 px-2.5 h-7 font-bold rounded-lg transition-all ${
                                    edit.justSaved
                                      ? "bg-[#16845B]/15 border border-[#16845B]/30 text-[#16845B]"
                                      : "bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] shadow-xs"
                                  }`}
                                  title="Save Marks for this student"
                                >
                                  {edit.justSaved ? (
                                    <span className="flex items-center">
                                      <Check size={11} className="mr-1" /> Saved!
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <Save size={11} className="mr-1" /> Save
                                    </span>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleRemoveStudent(norm)}
                                  className="p-1.5 text-[#B42318] hover:bg-[#B42318]/10 rounded-lg transition-colors"
                                  title="Remove from batch"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-muted-foreground">
                          No students found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-institutional p-12 text-center space-y-3">
            <h3 className="font-serif text-lg font-bold">No Batches Configured</h3>
            <p className="text-xs text-muted-foreground">
              Create your first academic batch to begin enrolling students and managing marks.
            </p>
            <Button variant="hero" size="sm" onClick={() => setNewBatchModalOpen(true)}>
              <Plus size={14} className="mr-1.5" /> Create Batch
            </Button>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE NEW BATCH ================= */}
      {newBatchModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNewBatchModalOpen(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <GraduationCap size={20} className="text-accent" /> Create New Academic Batch
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set up a course, batch year and academic level
              </p>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Program *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["B.Tech", "M.Tech", "Others"] as DegreeProgram[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewProgram(p)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        newProgram === p
                          ? "bg-accent/15 border-accent text-accent"
                          : "bg-muted/40 border-border text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Year *</label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Batch Year *</label>
                  <input
                    type="text"
                    required
                    value={newBatchYear}
                    onChange={(e) => setNewBatchYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Branch / Specialization *</label>
                <input
                  type="text"
                  required
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="e.g. Information Technology"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Preview Batch Name:</span>{" "}
                <span className="font-serif font-bold text-accent">
                  {newBatchYear} Year {newProgram} {newYear} ({newBranch})
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewBatchModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" size="sm">
                  Create Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD STUDENTS TO BATCH ================= */}
      {addStudentModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setAddStudentModalOpen(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-3 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                  <Users size={20} className="text-accent" /> Add Students to {activeBatch?.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enroll roll numbers individually or copy-paste batch lists
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-muted/50 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setAddStudentMode("single")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  addStudentMode === "single"
                    ? "bg-card text-primary shadow-xs font-bold"
                    : "text-muted-foreground"
                }`}
              >
                Single Student
              </button>
              <button
                type="button"
                onClick={() => setAddStudentMode("bulk")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  addStudentMode === "bulk"
                    ? "bg-card text-primary shadow-xs font-bold"
                    : "text-muted-foreground"
                }`}
              >
                Bulk Import (Paste List)
              </button>
            </div>

            {bulkFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} /> {bulkFeedback}
              </div>
            )}

            {addStudentMode === "single" ? (
              <form onSubmit={handleAddSingleStudent} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={singleRollNo}
                    onChange={(e) => setSingleRollNo(e.target.value.toUpperCase())}
                    placeholder="e.g. 23VV1A1232"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none uppercase font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Email (Optional)</label>
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="e.g. student@jntugv.edu.in"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddStudentModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero" size="sm">
                    Enroll Student
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBulkAddStudents} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Paste Students List (Roll Number, Name on each line) *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="23VV1A1232, Likhith Kumar&#10;23VV1A1233, Priya Rao&#10;23VV1A1234, Ananya Reddy"
                    className="w-full text-xs p-3 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Format: <code>RollNumber, Name</code> (or tab-separated from Excel/CSV)
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddStudentModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero" size="sm">
                    Import All Students
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE ASSIGNMENT ================= */}
      {newAssignmentModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setNewAssignmentModalOpen(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <FileText size={20} className="text-accent" /> Create Assignment for {activeBatch?.name}
              </h3>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Mid-1: Machine Learning Regression & Trees"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Type *</label>
                  <select
                    value={assignType}
                    onChange={(e) => setAssignType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                  >
                    <option value="Mid 1 Assignment">Mid 1 Assignment</option>
                    <option value="Mid 2 Assignment">Mid 2 Assignment</option>
                    <option value="Regular Assignment">Regular Assignment</option>
                    <option value="Lab Record">Lab Record</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Max Marks *</label>
                  <input
                    type="number"
                    required
                    value={assignMaxMarks}
                    onChange={(e) => setAssignMaxMarks(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Due Date *</label>
                <input
                  type="date"
                  required
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Instructions & Description</label>
                <textarea
                  rows={3}
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  placeholder="Instructions for students (e.g. PDF format only, max 1MB)..."
                  className="w-full text-xs p-3 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewAssignmentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" size="sm">
                  Publish Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PDF VIEWER ================= */}
      <PdfPreviewModal
        isOpen={Boolean(previewPdfUrl)}
        onClose={() => setPreviewPdfUrl(null)}
        pdfUrl={previewPdfUrl || undefined}
        fileName={previewFileName}
        studentName={previewStudentName}
        rollNo={previewRollNo}
      />
    </AdminLayout>
  );
}
