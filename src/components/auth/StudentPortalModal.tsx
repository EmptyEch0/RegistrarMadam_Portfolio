import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  X,
  GraduationCap,
  Lock,
  User,
  Hash,
  Briefcase,
  Calendar,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StudentAccount,
  DegreeProgram,
  getCurrentStudent,
  loginStudent,
  registerStudentAccount,
  logoutStudent,
  getMarksForStudent,
  getAllAssignments,
  getSubmissionForStudent,
  submitStudentAssignment,
  findBatchForStudent,
  BatchAssignment,
  AssignmentSubmission,
  StudentMarksRecord,
} from "@/lib/academicsStorage";
import { PdfPreviewModal } from "@/components/ui/PdfPreviewModal";

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export function StudentPortalModal({
  isOpen,
  onClose,
  initialTab = "login",
}: StudentPortalModalProps) {
  const [activeAuthTab, setActiveAuthTab] = useState<"login" | "signup">(initialTab);
  const [student, setStudent] = useState<StudentAccount | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [signupProgram, setSignupProgram] = useState<DegreeProgram>("B.Tech");
  const [signupRollNo, setSignupRollNo] = useState("");
  const [signupDestination, setSignupDestination] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupYear, setSignupYear] = useState("3rd Year");
  const [signupBatchYear, setSignupBatchYear] = useState("2026");
  const [signupBranch, setSignupBranch] = useState("Information Technology");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Dashboard active view
  const [dashboardTab, setDashboardTab] = useState<"marks" | "assignments" | "profile">("marks");

  // Assignment upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");

  // PDF Preview State
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState("");

  // Sync current student on modal open
  useEffect(() => {
    if (isOpen) {
      const current = getCurrentStudent();
      setStudent(current);
      setLoginError("");
      setSignupError("");
      setUploadError("");
      setUploadSuccess("");
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
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

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    setTimeout(() => {
      const res = loginStudent(loginIdentifier, loginPassword);
      setLoginLoading(false);
      if (res.success && res.account) {
        setStudent(res.account);
        setLoginPassword("");
      } else {
        setLoginError(res.message);
      }
    }, 300);
  };

  // Handle Signup
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match. Please re-enter.");
      return;
    }

    setSignupLoading(true);

    setTimeout(() => {
      const res = registerStudentAccount({
        username: signupUsername,
        fullName: signupFullName,
        email: signupEmail,
        program: signupProgram,
        rollNo: signupProgram === "Others" ? undefined : signupRollNo,
        destination: signupProgram === "Others" ? signupDestination : undefined,
        year: signupProgram === "Others" ? undefined : signupYear,
        batchYear: signupProgram === "Others" ? undefined : signupBatchYear,
        branch: signupProgram === "Others" ? undefined : signupBranch,
        password: signupPassword,
      });

      setSignupLoading(false);
      if (res.success && res.account) {
        setStudent(res.account);
        setSignupPassword("");
        setSignupConfirmPassword("");
      } else {
        setSignupError(res.message);
      }
    }, 350);
  };

  // Handle Logout
  const handleLogout = () => {
    logoutStudent();
    setStudent(null);
    setActiveAuthTab("login");
  };

  // Student Marks query strictly for this student
  const studentMarks: StudentMarksRecord | undefined = student?.rollNo
    ? getMarksForStudent(student.rollNo)
    : undefined;

  // Assignments query
  const allAssignments = getAllAssignments();
  const studentBatch = student?.rollNo ? findBatchForStudent(student.rollNo) : undefined;
  // If student is in a batch, show that batch's assignments; otherwise show available assignments
  const relevantAssignments = studentBatch
    ? allAssignments.filter((a) => a.batchId === studentBatch.id)
    : allAssignments;

  const currentAssignment =
    relevantAssignments.find((a) => a.id === selectedAssignmentId) || relevantAssignments[0];

  const studentSubmission = student?.rollNo && currentAssignment
    ? getSubmissionForStudent(student.rollNo, currentAssignment.id)
    : undefined;

  // Handle Assignment File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    setUploadSuccess("");
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // 1. Strict PDF Check
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setUploadError("Invalid file format. Please upload a PDF file only (.pdf).");
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    // 2. Strict < 1 MB Check (1024 * 1024 = 1,048,576 bytes)
    const MAX_SIZE = 1048576;
    if (file.size >= MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(
        `File is too large (${sizeMB} MB). Assignment submissions strictly require PDF files less than 1.0 MB. Please compress your PDF and try again.`
      );
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Handle Assignment Submission
  const handleAssignmentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !student || !currentAssignment) {
      setUploadError("Please select a PDF document to upload.");
      return;
    }

    if (!student.rollNo) {
      setUploadError("Assignment submission requires an official Student Roll Number.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const res = await submitStudentAssignment({
        assignmentId: currentAssignment.id,
        batchId: currentAssignment.batchId,
        rollNo: student.rollNo,
        studentName: student.fullName,
        studentAccountId: student.id,
        file: selectedFile,
      });

      setIsUploading(false);
      if (res.success) {
        setUploadSuccess(res.message);
        setSelectedFile(null);
      } else {
        setUploadError(res.message);
      }
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err?.message || "Upload failed. Please try again.");
    }
  };


  const modalTarget = typeof document !== "undefined"
    ? document.getElementById("modal-root") || document.body
    : null;

  if (!modalTarget) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-card border border-border w-full max-w-2xl max-h-[90vh] my-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ================= MODAL HEADER ================= */}
          <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-card via-card to-accent/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 shadow-xs">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-primary flex items-center gap-2">
                  Student Academics Portal
                  {student && (
                    <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Active Session
                    </span>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {student
                    ? `Logged in as ${student.fullName} · Roll: ${student.rollNo || student.destination || "Student"}`
                    : "Sign in to access your batch assignments, mid marks, and interactive roadmaps"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close portal modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* ================= MODAL BODY ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* If NOT logged in: Show Login / Signup forms */}
            {!student ? (
              <div className="space-y-5">
                {/* Auth Switcher Tabs */}
                <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border/70">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAuthTab("login");
                      setLoginError("");
                    }}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      activeAuthTab === "login"
                        ? "bg-card text-primary shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Student Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAuthTab("signup");
                      setSignupError("");
                    }}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      activeAuthTab === "signup"
                        ? "bg-card text-primary shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    New Student Sign Up
                  </button>
                </div>

                {/* ---------------- LOGIN TAB ---------------- */}
                {activeAuthTab === "login" && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-fade-in">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <User size={13} className="text-accent" /> Username or Roll Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 23VV1A1232 or your username"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:bg-card focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Lock size={13} className="text-accent" /> Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your account password"
                          className="w-full text-sm pl-3.5 pr-11 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:bg-card focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                          title={showLoginPassword ? "Hide password" : "Show password"}
                        >
                          {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="default"
                      disabled={loginLoading}
                      className="w-full font-semibold shadow-md py-2.5 text-sm"
                    >
                      {loginLoading ? "Authenticating..." : "Sign In to Student Portal"}
                    </Button>

                    <div className="pt-2 text-center text-xs text-muted-foreground">
                      Don't have a student account yet?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveAuthTab("signup")}
                        className="text-accent font-semibold hover:underline"
                      >
                        Sign up here
                      </button>
                    </div>
                  </form>
                )}

                {/* ---------------- SIGNUP TAB ---------------- */}
                {activeAuthTab === "signup" && (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    {signupError && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-fade-in">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{signupError}</span>
                      </div>
                    )}

                    {/* Degree Program Pill Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground block">
                        Select Academic Program / Category *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["B.Tech", "M.Tech", "Others"] as DegreeProgram[]).map((prog) => (
                          <button
                            key={prog}
                            type="button"
                            onClick={() => setSignupProgram(prog)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                              signupProgram === prog
                                ? "bg-accent/15 border-accent text-accent shadow-xs"
                                : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:bg-muted/70"
                            }`}
                          >
                            {prog}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Fields for B.Tech / M.Tech vs Others */}
                    {signupProgram === "Others" ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Briefcase size={13} className="text-accent" /> Designation / Affiliation Role *
                        </label>
                        <input
                          type="text"
                          required
                          value={signupDestination}
                          onChange={(e) => setSignupDestination(e.target.value)}
                          placeholder="e.g. Research Scholar, Visiting Faculty, Other Student"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:bg-card focus:outline-none"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Hash size={13} className="text-accent" /> Official Roll Number *
                            </span>
                            <span className="text-[10px] text-accent font-semibold">
                              (e.g. 23VV1A1232)
                            </span>
                          </label>
                          <input
                            type="text"
                            required
                            value={signupRollNo}
                            onChange={(e) => setSignupRollNo(e.target.value.toUpperCase())}
                            placeholder="e.g. 23VV1A1232"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:bg-card focus:outline-none uppercase font-mono font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                              Year of Study *
                            </label>
                            <select
                              value={signupYear}
                              onChange={(e) => setSignupYear(e.target.value)}
                              className="w-full text-xs px-3 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                            >
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                              Passout Batch *
                            </label>
                            <input
                              type="text"
                              required
                              value={signupBatchYear}
                              onChange={(e) => setSignupBatchYear(e.target.value)}
                              placeholder="e.g. 2026"
                              className="w-full text-xs px-3 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-foreground">
                              Branch / Dept *
                            </label>
                            <input
                              type="text"
                              required
                              value={signupBranch}
                              onChange={(e) => setSignupBranch(e.target.value)}
                              placeholder="e.g. IT, CSE, AI"
                              className="w-full text-xs px-3 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Common Account Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={signupFullName}
                          onChange={(e) => setSignupFullName(e.target.value)}
                          placeholder="e.g. Likhith Kumar"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Choose Username *
                        </label>
                        <input
                          type="text"
                          required
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                          placeholder="e.g. likhith23"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="e.g. student@jntugv.edu.in"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showSignupPassword ? "text" : "password"}
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="At least 4 characters"
                            className="w-full text-sm pl-3.5 pr-10 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            aria-label={showSignupPassword ? "Hide password" : "Show password"}
                            title={showSignupPassword ? "Hide password" : "Show password"}
                          >
                            {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showSignupConfirmPassword ? "text" : "password"}
                            required
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            placeholder="Re-type password"
                            className="w-full text-sm pl-3.5 pr-10 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-accent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            aria-label={showSignupConfirmPassword ? "Hide password" : "Show password"}
                            title={showSignupConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showSignupConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="default"
                      disabled={signupLoading}
                      className="w-full font-semibold shadow-md py-2.5 text-sm"
                    >
                      {signupLoading ? "Registering Account..." : "Create Account & Sign In"}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveAuthTab("login")}
                        className="text-accent font-semibold hover:underline"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* ================= LOGGED-IN STUDENT DASHBOARD ================= */
              <div className="space-y-6">
                {/* Student Profile Card Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-card via-card to-accent/10 border border-accent/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-amber-500 text-white font-bold font-serif text-xl flex items-center justify-center shadow-md">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-lg text-primary">
                          {student.fullName}
                        </h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                          {student.program}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {student.rollNo ? (
                          <span className="font-mono font-semibold text-foreground mr-2">
                            Roll No: {student.rollNo}
                          </span>
                        ) : null}
                        {student.destination ? (
                          <span className="font-medium mr-2">{student.destination}</span>
                        ) : null}
                        {student.year ? `· ${student.year} ` : ""}
                        {student.branch ? `· ${student.branch}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                    >
                      <LogOut size={13} /> Sign Out
                    </Button>
                  </div>
                </div>

                {/* Dashboard Nav Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 bg-muted/50 rounded-xl border border-border">
                  <button
                    onClick={() => setDashboardTab("marks")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      dashboardTab === "marks"
                        ? "bg-card text-primary shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Award size={14} className="text-amber-500" />
                    My Mid Marks
                  </button>
                  <button
                    onClick={() => setDashboardTab("assignments")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      dashboardTab === "assignments"
                        ? "bg-card text-primary shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Upload size={14} className="text-blue-500" />
                    Upload Assignment
                  </button>
                  <button
                    onClick={() => setDashboardTab("profile")}
                    className={`col-span-2 sm:col-span-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      dashboardTab === "profile"
                        ? "bg-card text-primary shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen size={14} className="text-purple-500" />
                    QLearn Hub
                  </button>
                </div>

                {/* ---------------- MARKS TAB (ONLY FOR LOGGED IN ROLL NO) ---------------- */}
                {dashboardTab === "marks" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-border/80">
                      <div>
                        <h4 className="font-serif font-bold text-base text-primary flex items-center gap-2">
                          Academic Performance & Mid Marks
                          <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                            <ShieldCheck size={11} /> Private to your Roll No
                          </span>
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Official internal assessment marks recorded by Dr. G. Jaya Suma
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Marks Grid (Mid-1 Marks space reserved and always visible) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Mid 1 Marks Card */}
                      <div className="p-4 rounded-xl border border-accent/30 bg-card shadow-xs flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                            Mid-1 Examination
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            IoT Core
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
                            {studentMarks?.midMarks !== undefined && studentMarks?.midMarks !== ""
                              ? studentMarks.midMarks
                              : "0"}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">/ 30</span>
                        </div>
                        {studentMarks?.midMarks !== undefined && studentMarks?.midMarks !== "" ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Evaluated & Published
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                            ⏳ Mid-1 marks will be updated soon
                          </span>
                        )}
                      </div>

                      {/* Mid 2 Marks Card */}
                      <div className="p-4 rounded-xl border border-border bg-card/70 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Mid-2 Examination
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Upcoming
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
                            {studentMarks?.mid2Marks || "—"}
                          </span>
                          {studentMarks?.mid2Marks && (
                            <span className="text-xs text-muted-foreground font-mono">/ 30</span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {studentMarks?.mid2Marks ? "Official score" : "Pending 2nd mid exam"}
                        </span>
                      </div>

                      {/* Assignment Marks Card */}
                      <div className="p-4 rounded-xl border border-border bg-card/70 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Assignments (3 Total)
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            PDF Uploads
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 my-1">
                          <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
                            {studentMarks?.assignmentMarks || "—"}
                          </span>
                          {studentMarks?.assignmentMarks && (
                            <span className="text-xs text-muted-foreground font-mono">/ 10</span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {studentMarks?.assignmentMarks ? "Evaluated by faculty" : "Calculated from 3 submissions"}
                        </span>
                      </div>

                      {/* Remarks if any */}
                      {studentMarks?.remarks && (
                        <div className="sm:col-span-3 p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs">
                          <span className="font-bold text-accent block mb-1">
                            Faculty Remarks:
                          </span>
                          <p className="text-muted-foreground leading-relaxed italic">
                            "{studentMarks.remarks}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ---------------- ASSIGNMENTS TAB (PDF STRICTLY < 1MB) ---------------- */}
                {dashboardTab === "assignments" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-border/80">
                      <div>
                        <h4 className="font-serif font-bold text-base text-primary">
                          Course Assignments & PDF Submission
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Submit your assignment PDF document (Strict limit: &lt; 1 MB)
                        </p>
                      </div>
                    </div>

                    {/* Active Assignment Selector for All Assignments */}
                    {relevantAssignments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pb-1">
                        {relevantAssignments.map((assign, idx) => {
                          const isSub = student?.rollNo ? Boolean(getSubmissionForStudent(student.rollNo, assign.id)) : false;
                          const isSelected = currentAssignment?.id === assign.id;
                          return (
                            <button
                              key={assign.id}
                              type="button"
                              onClick={() => {
                                setSelectedAssignmentId(assign.id);
                                setUploadError("");
                                setUploadSuccess("");
                              }}
                              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                isSelected
                                  ? "bg-accent/15 border-accent text-primary shadow-xs ring-1 ring-accent/30"
                                  : "bg-card/70 border-border text-muted-foreground hover:border-accent/40 hover:bg-card"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                                  {assign.assignmentType || `Assignment ${idx + 1}`}
                                </span>
                                {isSub ? (
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    <CheckCircle2 size={10} /> Done
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-foreground line-clamp-1">
                                {assign.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground mt-1 block">
                                Due: {assign.dueDate}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {currentAssignment ? (
                      <div className="card-institutional p-4 sm:p-5 space-y-4 border border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                              {currentAssignment.assignmentType || "Mid Assignment"}
                            </span>
                            <h5 className="font-serif font-bold text-base text-primary mt-1">
                              {currentAssignment.title}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                              Max Marks: {currentAssignment.maxMarks}
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium flex items-center gap-1">
                              <Calendar size={12} /> Due: {currentAssignment.dueDate}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {currentAssignment.description}
                        </p>

                        {/* Submission Status Display */}
                        {studentSubmission ? (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 size={16} /> Assignment Submitted Successfully
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {new Date(studentSubmission.submittedAt).toLocaleString()}
                              </span>
                            </div>

                            <div className="p-3 bg-card/80 rounded-lg border border-border flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText size={18} className="text-red-500 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-foreground truncate">
                                    {studentSubmission.fileName}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {(studentSubmission.fileSize / 1024).toFixed(1)} KB · PDF Document
                                  </p>
                                </div>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setPreviewPdfUrl(studentSubmission.fileDataUrl);
                                  setPreviewFileName(studentSubmission.fileName);
                                }}
                                className="text-xs shrink-0 flex items-center gap-1.5 font-semibold"
                              >
                                <Eye size={13} /> View PDF
                              </Button>
                            </div>

                            <p className="text-[11px] text-muted-foreground">
                              Want to re-submit before the deadline? Choose a new PDF below.
                            </p>
                          </div>
                        ) : null}

                        {/* Upload Form */}
                        <form onSubmit={handleAssignmentUpload} className="space-y-3 pt-1">
                          {uploadError && (
                            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-fade-in">
                              <AlertCircle size={16} className="shrink-0 mt-0.5" />
                              <span>{uploadError}</span>
                            </div>
                          )}

                          {uploadSuccess && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-start gap-2 animate-fade-in">
                              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                              <span>{uploadSuccess}</span>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                              <span>Select Assignment PDF File *</span>
                              <span className="text-[10px] text-accent font-bold">
                                Only PDF · Max Size 1.0 MB
                              </span>
                            </label>

                            <div className="border-2 border-dashed border-border hover:border-accent/60 rounded-xl p-4 text-center transition-colors bg-muted/20 hover:bg-accent/5">
                              <input
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handleFileChange}
                                className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground hover:file:opacity-90 cursor-pointer"
                              />
                              {selectedFile && (
                                <div className="mt-2 text-xs text-foreground font-medium flex items-center justify-center gap-2">
                                  <FileText size={14} className="text-red-500" />
                                  <span>{selectedFile.name}</span>
                                  <span className="text-muted-foreground">
                                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Button
                            type="submit"
                            variant="hero"
                            size="default"
                            disabled={!selectedFile || isUploading}
                            className="w-full font-semibold shadow-md py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                          >
                            <Upload size={15} />
                            {isUploading ? "Uploading Assignment..." : "Submit PDF Assignment"}
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No active assignments for your batch.</p>
                    )}
                  </div>
                )}

                {/* ---------------- QLEARN HUB / ROADMAP SHORTCUTS ---------------- */}
                {dashboardTab === "profile" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="pb-2 border-b border-border/80">
                      <h4 className="font-serif font-bold text-base text-primary">
                        Access QLearn Courses & Learning Modules
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        All domain video roadmaps and interactive word puzzles are fully unlocked
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link
                        to="/qlearn"
                        onClick={onClose}
                        className="p-4 rounded-xl border border-border hover:border-accent/60 bg-muted/20 hover:bg-accent/5 transition-all flex items-start gap-3 group"
                      >
                        <div className="p-2.5 rounded-lg bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors flex items-center gap-1">
                            Browse All 6 Courses <ArrowRight size={14} />
                          </h5>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Quantum Computing, Machine Learning, Data Science, IoT, Agentic AI, Deep Learning
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/qlearn?tab=puzzles"
                        onClick={onClose}
                        className="p-4 rounded-xl border border-border hover:border-amber-500/60 bg-muted/20 hover:bg-amber-500/5 transition-all flex items-start gap-3 group"
                      >
                        <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-500 group-hover:scale-105 transition-transform">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-foreground group-hover:text-amber-500 transition-colors flex items-center gap-1">
                            Play Word Connect Puzzles <ArrowRight size={14} />
                          </h5>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Solve subject-specific puzzles and rank on live top-10 leaderboards
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Document Preview Modal */}
      <PdfPreviewModal
        isOpen={Boolean(previewPdfUrl)}
        onClose={() => setPreviewPdfUrl(null)}
        pdfUrl={previewPdfUrl || undefined}
        fileName={previewFileName}
        studentName={student?.fullName}
        rollNo={student?.rollNo}
      />
    </>,
    modalTarget
  );
}
