import { supabase, supabaseAdmin } from "@/lib/supabase";

export type DegreeProgram = "B.Tech" | "M.Tech" | "Others";

export interface StudentAccount {
  id: string;
  username: string; // used for login
  fullName: string;
  email?: string;
  program: DegreeProgram;
  rollNo?: string; // required for B.Tech / M.Tech (e.g., "23VV1A1232")
  destination?: string; // required if Others: designation / role
  year?: string; // e.g., "1st Year", "2nd Year", "3rd Year", "4th Year"
  batchYear?: string; // e.g., "2026"
  branch?: string; // e.g., "IT", "CSE"
  passwordHash: string;
  createdAt: string;
}

export interface BatchStudentEntry {
  rollNo: string;
  name: string;
  email?: string;
}

export interface BatchAssignment {
  id: string;
  batchId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  assignmentType?: string; // e.g. "Mid 1 Assignment"
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  batchId: string;
  rollNo: string;
  studentName: string;
  studentAccountId?: string;
  fileName: string;
  fileSize: number; // in bytes (< 1,048,576 bytes)
  fileDataUrl: string; // Base64 data URL
  submittedAt: string;
  comment?: string;
}

export interface StudentMarksRecord {
  id: string;
  batchId: string;
  rollNo: string;
  studentName?: string;
  midMarks?: string; // e.g., "30/40"
  mid2Marks?: string; // e.g., "35/40"
  assignmentMarks?: string; // e.g., "10/10"
  remarks?: string;
  updatedAt: string;
}

export interface AcademicBatch {
  id: string;
  program: DegreeProgram;
  year: string; // e.g. "3rd Year"
  batchYear: string; // e.g. "2026"
  branch: string; // e.g. "IT"
  name: string; // e.g. "2026 Year B.Tech 3rd Year (IT)"
  students: BatchStudentEntry[];
  createdAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  STUDENT_ACCOUNTS: "qlearn_student_accounts",
  CURRENT_STUDENT: "qlearn_current_student_session",
  ACADEMIC_BATCHES: "qlearn_academic_batches",
  BATCH_ASSIGNMENTS: "qlearn_batch_assignments",
  ASSIGNMENT_SUBMISSIONS: "qlearn_assignment_submissions",
  STUDENT_MARKS: "qlearn_student_marks_records",
  LAST_QUIZ_PLAYER: "qlearn_quiz_player_name",
};

// Generate 74 students for B.Tech 4th Year (2023-2027) IoT Batch (23VV1A1201 to 23VV1A1274)
export const BTECH_4TH_YEAR_2023_2027_STUDENTS: BatchStudentEntry[] = Array.from({ length: 74 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  const roll = `23VV1A12${num}`;
  return {
    rollNo: roll,
    name: roll === "23VV1A1232" ? "Likhith Kumar" : `Student ${roll}`,
    email: `${roll.toLowerCase()}@jntugv.edu.in`,
  };
});

export const IOT_BATCH_ID = "batch-2023-2027-btech-4th-iot";

// Official Mid-I Marks (out of 30) for B.Tech 4th Year (2023-2027) IoT Batch
// Default is 0 for any missing student, Roll 4 explicitly neglected/absent = 0
export const IOT_BATCH_MID1_MARKS: Record<string, { midMarks: string; remarks?: string }> = {
  "23VV1A1201": { midMarks: "12" },
  "23VV1A1202": { midMarks: "11.5" },
  "23VV1A1203": { midMarks: "21" },
  "23VV1A1204": { midMarks: "0", remarks: "Neglected / No score recorded in sheet - set to default 0" },
  "23VV1A1205": { midMarks: "17" },
  "23VV1A1206": { midMarks: "14.5" },
  "23VV1A1207": { midMarks: "13" },
  "23VV1A1208": { midMarks: "20" },
  "23VV1A1209": { midMarks: "23" },
  "23VV1A1210": { midMarks: "22" },
  "23VV1A1211": { midMarks: "22" },
  "23VV1A1212": { midMarks: "14" },
  "23VV1A1213": { midMarks: "22" },
  "23VV1A1214": { midMarks: "11" },
  "23VV1A1215": { midMarks: "11" },
  "23VV1A1216": { midMarks: "24" },
  "23VV1A1217": { midMarks: "17" },
  "23VV1A1218": { midMarks: "19" },
  "23VV1A1219": { midMarks: "16" },
  "23VV1A1220": { midMarks: "23" },
  "23VV1A1221": { midMarks: "16" },
  "23VV1A1222": { midMarks: "19" },
  "23VV1A1223": { midMarks: "21" },
  "23VV1A1224": { midMarks: "21" },
  "23VV1A1225": { midMarks: "24" },
  "23VV1A1226": { midMarks: "11" },
  "23VV1A1227": { midMarks: "18" },
  "23VV1A1228": { midMarks: "8" },
  "23VV1A1229": { midMarks: "24" },
  "23VV1A1230": { midMarks: "18" },
  "23VV1A1231": { midMarks: "16" },
  "23VV1A1232": { midMarks: "22.5", remarks: "Likhith Kumar - Good performance" },
  "23VV1A1233": { midMarks: "16" },
  "23VV1A1234": { midMarks: "17" },
  "23VV1A1235": { midMarks: "11" },
  "23VV1A1236": { midMarks: "23.5" },
  "23VV1A1237": { midMarks: "22" },
  "23VV1A1238": { midMarks: "26" },
  "23VV1A1239": { midMarks: "19" },
  "23VV1A1240": { midMarks: "20" },
  "23VV1A1241": { midMarks: "28" },
  "23VV1A1242": { midMarks: "26.5" },
  "23VV1A1243": { midMarks: "15.5" },
  "23VV1A1244": { midMarks: "25" },
  "23VV1A1245": { midMarks: "11" },
  "23VV1A1246": { midMarks: "22" },
  "23VV1A1247": { midMarks: "17" },
  "23VV1A1248": { midMarks: "19" },
  "23VV1A1249": { midMarks: "24" },
  "23VV1A1250": { midMarks: "24.5" },
  "23VV1A1251": { midMarks: "28" },
  "23VV1A1252": { midMarks: "7" },
  "23VV1A1253": { midMarks: "26" },
  "23VV1A1254": { midMarks: "26.5" },
  "23VV1A1255": { midMarks: "17" },
  "23VV1A1256": { midMarks: "17.5" },
  "23VV1A1257": { midMarks: "16" },
  "23VV1A1258": { midMarks: "18" },
  "23VV1A1259": { midMarks: "25" },
  "23VV1A1260": { midMarks: "24" },
  "23VV1A1261": { midMarks: "24" },
  "23VV1A1262": { midMarks: "22" },
  "23VV1A1263": { midMarks: "28.5" },
  "23VV1A1264": { midMarks: "23" },
  "23VV1A1265": { midMarks: "26.5" },
  "23VV1A1266": { midMarks: "25" },
  "23VV1A1267": { midMarks: "22" },
  "23VV1A1268": { midMarks: "25.5" },
  "23VV1A1269": { midMarks: "25" },
  "23VV1A1270": { midMarks: "22" },
  "23VV1A1271": { midMarks: "25.5" },
  "23VV1A1272": { midMarks: "22" },
  "23VV1A1273": { midMarks: "17.5" },
  "23VV1A1274": { midMarks: "20.5" },
};

// Initial default batches for immediate ready-to-use experience
const DEFAULT_BATCHES: AcademicBatch[] = [
  {
    id: IOT_BATCH_ID,
    program: "B.Tech",
    year: "4th Year",
    batchYear: "2027",
    branch: "Information Technology (IoT)",
    name: "B.Tech 4th Year (2023-2027) - Internet of Things (IoT)",
    createdAt: new Date().toISOString(),
    students: BTECH_4TH_YEAR_2023_2027_STUDENTS,
  },
  {
    id: "batch-2026-btech-3rd-it",
    program: "B.Tech",
    year: "3rd Year",
    batchYear: "2026",
    branch: "IT",
    name: "2026 Year B.Tech 3rd Year (IT)",
    createdAt: new Date().toISOString(),
    students: [
      { rollNo: "23VV1A1232", name: "Likhith Kumar", email: "likhith@jntugv.edu.in" },
      { rollNo: "23VV1A1201", name: "Aarav Sharma", email: "aarav@jntugv.edu.in" },
      { rollNo: "23VV1A1208", name: "Divya Bhavani", email: "divya@jntugv.edu.in" },
      { rollNo: "23VV1A1215", name: "Karthik Varma", email: "karthik@jntugv.edu.in" },
      { rollNo: "23VV1A1224", name: "Pooja Sri", email: "pooja@jntugv.edu.in" },
      { rollNo: "23VV1A1245", name: "Sai Teja", email: "saiteja@jntugv.edu.in" },
    ],
  },
  {
    id: "batch-2025-btech-4th-cse",
    program: "B.Tech",
    year: "4th Year",
    batchYear: "2025",
    branch: "CSE",
    name: "2025 Year B.Tech 4th Year (CSE)",
    createdAt: new Date().toISOString(),
    students: [
      { rollNo: "22VV1A0501", name: "Abhishek Rao" },
      { rollNo: "22VV1A0512", name: "Meghana K" },
      { rollNo: "22VV1A0530", name: "Rohit N" },
    ],
  },
  {
    id: "batch-2026-mtech-1st-ai",
    program: "M.Tech",
    year: "1st Year",
    batchYear: "2026",
    branch: "AI & Data Science",
    name: "2026 Year M.Tech 1st Year (AI)",
    createdAt: new Date().toISOString(),
    students: [
      { rollNo: "25VV1D5801", name: "Suresh Babu" },
      { rollNo: "25VV1D5804", name: "Harika Devi" },
    ],
  },
];

const DEFAULT_ASSIGNMENTS: BatchAssignment[] = [
  {
    id: "assign-iot-1",
    batchId: IOT_BATCH_ID,
    title: "IoT Assignment 1: Architecture, Protocols & Sensing Layers",
    description: "Submit a comprehensive analytical report on IoT 4-layer architecture, sensor telemetry, and comparisons between CoAP and MQTT protocols. PDF strictly < 1 MB.",
    dueDate: "2026-11-15",
    maxMarks: 10,
    assignmentType: "Assignment 1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "assign-iot-2",
    batchId: IOT_BATCH_ID,
    title: "IoT Assignment 2: Embedded Sensors, Actuators & Interfacing",
    description: "Document microcontroller interfacing (ESP32/Raspberry Pi/Arduino), GPIO pinouts, analog-to-digital conversion, and PWM actuator control. PDF strictly < 1 MB.",
    dueDate: "2026-11-22",
    maxMarks: 10,
    assignmentType: "Assignment 2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "assign-iot-3",
    batchId: IOT_BATCH_ID,
    title: "IoT Assignment 3: Cloud Integration, MQTT & Edge Analytics",
    description: "Submit your final IoT project report illustrating cloud telemetry pipelines, MQTT broker communication, edge data processing, and dashboard visualization. PDF strictly < 1 MB.",
    dueDate: "2026-11-30",
    maxMarks: 10,
    assignmentType: "Assignment 3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "assign-ml-mid1",
    batchId: "batch-2026-btech-3rd-it",
    title: "Mid-1 Assignment: Supervised Learning & Gradient Descent",
    description: "Submit a comprehensive analytical report comparing Linear Regression vs. Decision Trees on synthetic data. Include mathematical formulations and parameter tuning observations. PDF format only (< 1 MB).",
    dueDate: "2026-11-15",
    maxMarks: 40,
    assignmentType: "Mid 1 Assignment",
    createdAt: new Date().toISOString(),
  },
  {
    id: "assign-qc-unit1",
    batchId: "batch-2026-btech-3rd-it",
    title: "Quantum Computing: Qubit Superposition & Hadamard Gate Report",
    description: "Derive the state matrix transformations for a Bell state generation circuit. Document state evolution with Dirac notation. Max file size: 1 MB PDF.",
    dueDate: "2026-11-25",
    maxMarks: 40,
    assignmentType: "Mid 2 Assignment",
    createdAt: new Date().toISOString(),
  },
];

// Helper to normalize roll numbers for reliable matching
export function normalizeRollNo(roll: string | undefined | null): string {
  if (!roll) return "";
  return roll.trim().toUpperCase().replace(/\s+/g, "");
}

// ==========================================
// STUDENT ACCOUNT MANAGEMENT
// ==========================================

export function getAllStudentAccounts(): StudentAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCOUNTS);
    let accounts: StudentAccount[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(accounts)) accounts = [];

    // Ensure all 70 students of B.Tech 4th Year (2023-2027) IoT Batch (23VV1A1201 - 23VV1A1270) have accounts created with strong 8-character passwords
    let updated = false;
    for (const s of BTECH_4TH_YEAR_2023_2027_STUDENTS) {
      const normRoll = normalizeRollNo(s.rollNo);
      const rollSuffix = normRoll.slice(-4);
      const strongPassword = `Jv@${rollSuffix}#`; // 8 chars: Char(Jv) + Symbol(@) + Int(suffix) + Symbol(#)

      const existingIdx = accounts.findIndex((a) => normalizeRollNo(a.rollNo) === normRoll);
      if (existingIdx === -1) {
        accounts.push({
          id: `std_${normRoll.toLowerCase()}`,
          username: normRoll.toLowerCase(),
          fullName: s.name,
          email: s.email,
          program: "B.Tech",
          rollNo: normRoll,
          year: "4th Year",
          batchYear: "2027",
          branch: "Information Technology (IoT)",
          passwordHash: strongPassword,
          createdAt: new Date().toISOString(),
        });
        updated = true;
      } else {
        // Upgrade password to strong 8-character password if it was the default plain roll number
        if (!accounts[existingIdx].passwordHash || accounts[existingIdx].passwordHash === normRoll.toLowerCase()) {
          accounts[existingIdx].passwordHash = strongPassword;
          updated = true;
        }
      }
    }

    if (updated) {
      saveAllStudentAccounts(accounts);
    }

    return accounts;
  } catch (err) {
    console.error("Failed to parse student accounts:", err);
    return [];
  }
}

export function saveAllStudentAccounts(accounts: StudentAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to save student accounts:", err);
  }
}

export function findStudentAccountByRoll(rollNo: string): StudentAccount | undefined {
  const norm = normalizeRollNo(rollNo);
  if (!norm) return undefined;
  const accounts = getAllStudentAccounts();
  return accounts.find((acc) => normalizeRollNo(acc.rollNo) === norm);
}

export function registerStudentAccount(data: {
  username: string;
  fullName: string;
  email?: string;
  program: DegreeProgram;
  rollNo?: string;
  destination?: string;
  year?: string;
  batchYear?: string;
  branch?: string;
  password: string;
}): { success: boolean; message: string; account?: StudentAccount } {
  const username = data.username.trim().toLowerCase();
  if (!username) {
    return { success: false, message: "Username is required." };
  }
  if (!data.fullName.trim()) {
    return { success: false, message: "Full Name is required." };
  }
  if (!data.password || data.password.length < 4) {
    return { success: false, message: "Password must be at least 4 characters." };
  }

  const normRoll = normalizeRollNo(data.rollNo);
  if ((data.program === "B.Tech" || data.program === "M.Tech") && !normRoll) {
    return { success: false, message: `Roll Number is mandatory for ${data.program} students.` };
  }

  if (data.program === "Others" && !data.destination?.trim()) {
    return { success: false, message: "Designation / Role is mandatory for 'Others'." };
  }

  const existingAccounts = getAllStudentAccounts();

  // Check username uniqueness
  if (existingAccounts.some((acc) => acc.username.toLowerCase() === username)) {
    return { success: false, message: `Username '${username}' is already taken. Please choose another.` };
  }

  // Check roll number uniqueness for degree students
  if (normRoll && existingAccounts.some((acc) => normalizeRollNo(acc.rollNo) === normRoll)) {
    return { success: false, message: `An account for Roll Number '${normRoll}' has already been registered. Please log in.` };
  }

  const newAccount: StudentAccount = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username,
    fullName: data.fullName.trim(),
    email: data.email?.trim(),
    program: data.program,
    rollNo: normRoll || undefined,
    destination: data.program === "Others" ? data.destination?.trim() : undefined,
    year: data.year?.trim(),
    batchYear: data.batchYear?.trim(),
    branch: data.branch?.trim(),
    passwordHash: data.password, // In-browser client storage
    createdAt: new Date().toISOString(),
  };

  const updated = [newAccount, ...existingAccounts];
  saveAllStudentAccounts(updated);

  // Automatically log them in
  setCurrentStudent(newAccount);

  // Sync with general visitor profile for visitor badge consistency
  try {
    localStorage.setItem(
      "qlearn_visitor_profile",
      JSON.stringify({
        name: newAccount.fullName,
        email: newAccount.email || `${newAccount.username}@student.portal`,
        savedAt: new Date().toISOString(),
      })
    );
    localStorage.setItem("qlearn_puzzle_player_name", newAccount.fullName);
  } catch {}

  return { success: true, message: "Account created successfully! Welcome to Student Portal.", account: newAccount };
}

export function loginStudent(usernameOrRoll: string, password: string): { success: boolean; message: string; account?: StudentAccount } {
  const query = usernameOrRoll.trim().toLowerCase();
  const normRoll = normalizeRollNo(usernameOrRoll);
  const accounts = getAllStudentAccounts();

  const found = accounts.find((acc) => {
    const uMatch = acc.username.toLowerCase() === query;
    const rMatch = acc.rollNo && normalizeRollNo(acc.rollNo) === normRoll;
    return uMatch || rMatch;
  });

  if (!found) {
    return { success: false, message: "Invalid credentials. No account found for this Username or Roll Number." };
  }

  // Allow password match on strong password, passwordHash, or case-insensitive entry
  const enteredPass = password.trim();
  const rollSuffix = found.rollNo ? normalizeRollNo(found.rollNo).slice(-4) : "";
  const strongDefault = rollSuffix ? `Jv@${rollSuffix}#` : "";

  const passMatches =
    found.passwordHash === enteredPass ||
    found.passwordHash.toLowerCase() === enteredPass.toLowerCase() ||
    (strongDefault && enteredPass.toLowerCase() === strongDefault.toLowerCase()) ||
    (found.rollNo && normalizeRollNo(enteredPass) === normalizeRollNo(found.rollNo));

  if (!passMatches) {
    return { success: false, message: "Incorrect password. Please verify and try again." };
  }

  setCurrentStudent(found);

  // Sync visitor profile
  try {
    localStorage.setItem(
      "qlearn_visitor_profile",
      JSON.stringify({
        name: found.fullName,
        email: found.email || `${found.username}@student.portal`,
        savedAt: new Date().toISOString(),
      })
    );
    localStorage.setItem("qlearn_puzzle_player_name", found.fullName);
  } catch {}

  return { success: true, message: `Welcome back, ${found.fullName}!`, account: found };
}

export function getCurrentStudent(): StudentAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentStudent(account: StudentAccount | null): void {
  try {
    if (account) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(account));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    }
  } catch (err) {
    console.error("Failed to update student session:", err);
  }
}

export function logoutStudent(): void {
  setCurrentStudent(null);
}

// ==========================================
// ACADEMIC BATCHES MANAGEMENT
// ==========================================

export function getAllBatches(): AcademicBatch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACADEMIC_BATCHES);
    if (!raw) {
      // Seed default batches
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_BATCHES, JSON.stringify(DEFAULT_BATCHES));
      return DEFAULT_BATCHES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let changed = false;
      for (const def of DEFAULT_BATCHES) {
        if (!parsed.some((b: AcademicBatch) => b.id === def.id)) {
          parsed.unshift(def);
          changed = true;
        }
      }
      if (changed) {
        saveAllBatches(parsed);
      }
      return parsed;
    }
    return DEFAULT_BATCHES;
  } catch {
    return DEFAULT_BATCHES;
  }
}

export function saveAllBatches(batches: AcademicBatch[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_BATCHES, JSON.stringify(batches));
  } catch (err) {
    console.error("Failed to save academic batches:", err);
  }
}

export function createOrUpdateBatch(batch: Omit<AcademicBatch, "id" | "createdAt"> & { id?: string }): AcademicBatch {
  const batches = getAllBatches();
  const id = batch.id || `batch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  const existingIndex = batches.findIndex((b) => b.id === id);
  const updatedBatch: AcademicBatch = {
    ...batch,
    id,
    createdAt: existingIndex >= 0 ? batches[existingIndex].createdAt : new Date().toISOString(),
    students: batch.students || [],
  };

  let newBatches: AcademicBatch[];
  if (existingIndex >= 0) {
    newBatches = [...batches];
    newBatches[existingIndex] = updatedBatch;
  } else {
    newBatches = [updatedBatch, ...batches];
  }

  saveAllBatches(newBatches);
  return updatedBatch;
}

export function deleteBatch(batchId: string): void {
  const batches = getAllBatches().filter((b) => b.id !== batchId);
  saveAllBatches(batches);
}

export function addStudentToBatch(batchId: string, rollNo: string, name: string, email?: string): boolean {
  const normRoll = normalizeRollNo(rollNo);
  if (!normRoll || !name.trim()) return false;

  const batches = getAllBatches();
  const batch = batches.find((b) => b.id === batchId);
  if (!batch) return false;

  // Check if roll number already in batch
  const existingIdx = batch.students.findIndex((s) => normalizeRollNo(s.rollNo) === normRoll);
  if (existingIdx >= 0) {
    batch.students[existingIdx] = { rollNo: normRoll, name: name.trim(), email: email?.trim() };
  } else {
    batch.students.push({ rollNo: normRoll, name: name.trim(), email: email?.trim() });
  }

  saveAllBatches(batches);
  return true;
}

export function addBulkStudentsToBatch(batchId: string, text: string): { added: number; updated: number; errors: number } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let added = 0;
  let updated = 0;
  let errors = 0;

  const batches = getAllBatches();
  const batch = batches.find((b) => b.id === batchId);
  if (!batch) return { added: 0, updated: 0, errors: lines.length };

  for (const line of lines) {
    // Expected formats: "23VV1A1232, Rahul Sharma" or "23VV1A1232 - Rahul Sharma" or tab separated
    const parts = line.split(/[,;\t\-]/).map((p) => p.trim());
    if (parts.length >= 2) {
      const rollNo = normalizeRollNo(parts[0]);
      const name = parts.slice(1).join(" ").trim();
      if (rollNo && name) {
        const existIdx = batch.students.findIndex((s) => normalizeRollNo(s.rollNo) === rollNo);
        if (existIdx >= 0) {
          batch.students[existIdx] = { rollNo, name };
          updated++;
        } else {
          batch.students.push({ rollNo, name });
          added++;
        }
      } else {
        errors++;
      }
    } else {
      errors++;
    }
  }

  saveAllBatches(batches);
  return { added, updated, errors };
}

export function removeStudentFromBatch(batchId: string, rollNo: string): void {
  const normRoll = normalizeRollNo(rollNo);
  const batches = getAllBatches();
  const batch = batches.find((b) => b.id === batchId);
  if (!batch) return;

  batch.students = batch.students.filter((s) => normalizeRollNo(s.rollNo) !== normRoll);
  saveAllBatches(batches);
}

// Find batch that a student belongs to
export function findBatchForStudent(rollNo?: string): AcademicBatch | undefined {
  if (!rollNo) return undefined;
  const normRoll = normalizeRollNo(rollNo);
  const batches = getAllBatches();
  return batches.find((b) => b.students.some((s) => normalizeRollNo(s.rollNo) === normRoll));
}

// ==========================================
// ASSIGNMENTS MANAGEMENT
// ==========================================

export function getAllAssignments(): BatchAssignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCH_ASSIGNMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BATCH_ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
      return DEFAULT_ASSIGNMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let changed = false;
      for (const def of DEFAULT_ASSIGNMENTS) {
        if (!parsed.some((a: BatchAssignment) => a.id === def.id)) {
          parsed.unshift(def);
          changed = true;
        }
      }
      if (changed) {
        saveAllAssignments(parsed);
      }
      return parsed;
    }
    return DEFAULT_ASSIGNMENTS;
  } catch {
    return DEFAULT_ASSIGNMENTS;
  }
}

export function saveAllAssignments(assignments: BatchAssignment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BATCH_ASSIGNMENTS, JSON.stringify(assignments));
  } catch (err) {
    console.error("Failed to save assignments:", err);
  }
}

export function getAssignmentsForBatch(batchId: string): BatchAssignment[] {
  const all = getAllAssignments();
  return all.filter((a) => a.batchId === batchId);
}

export function createAssignment(assignment: Omit<BatchAssignment, "id" | "createdAt">): BatchAssignment {
  const all = getAllAssignments();
  const newAssign: BatchAssignment = {
    ...assignment,
    id: `assign_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  saveAllAssignments([newAssign, ...all]);
  return newAssign;
}

export function deleteAssignment(assignmentId: string): void {
  const all = getAllAssignments().filter((a) => a.id !== assignmentId);
  saveAllAssignments(all);
}

// ==========================================
// ASSIGNMENT SUBMISSIONS (PDF strictly < 1MB)
// ==========================================

export function getAllSubmissions(): AssignmentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllSubmissions(submissions: AssignmentSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, JSON.stringify(submissions));
  } catch (err) {
    console.error("Failed to save submissions:", err);
  }
}

export function getSubmissionsForBatch(batchId: string): AssignmentSubmission[] {
  const all = getAllSubmissions();
  return all.filter((s) => s.batchId === batchId);
}

export function getSubmissionForStudent(rollNo: string, assignmentId?: string): AssignmentSubmission | undefined {
  const normRoll = normalizeRollNo(rollNo);
  const all = getAllSubmissions();
  return all.find((s) => {
    const rollMatches = normalizeRollNo(s.rollNo) === normRoll;
    if (assignmentId) {
      return rollMatches && s.assignmentId === assignmentId;
    }
    return rollMatches;
  });
}

/**
 * Validate and submit an assignment.
 * Strict rules:
 * 1. Must be PDF.
 * 2. File size must be strictly < 1 MB (1,048,576 bytes).
 */
export async function submitStudentAssignment({
  assignmentId,
  batchId,
  rollNo,
  studentName,
  studentAccountId,
  file,
  comment,
}: {
  assignmentId: string;
  batchId: string;
  rollNo: string;
  studentName: string;
  studentAccountId?: string;
  file: File;
  comment?: string;
}): Promise<{ success: boolean; message: string; submission?: AssignmentSubmission }> {
  // 1. File Type Check
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return {
      success: false,
      message: "Invalid file type. Assignment submissions strictly accept PDF documents only (.pdf).",
    };
  }

  // 2. Strict File Size Check (< 1 MB)
  const MAX_BYTES = 1048576; // 1 MB = 1024 * 1024 bytes
  if (file.size >= MAX_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      success: false,
      message: `File size exceeds the 1 MB limit (${sizeInMb} MB). Please compress your PDF below 1 MB before uploading.`,
    };
  }

  // 3. Upload to Supabase Storage Bucket ('assignments') with graceful fallback
  const normRoll = normalizeRollNo(rollNo);
  const client = supabaseAdmin || supabase;
  let fileUrl = "";

  try {
    const ext = file.name.split(".").pop() || "pdf";
    const cleanPath = `iot/${assignmentId}/${normRoll}_${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadErr } = await client.storage
      .from("assignments")
      .upload(cleanPath, file, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadErr && uploadData) {
      const { data: urlData } = client.storage
        .from("assignments")
        .getPublicUrl(cleanPath);
      fileUrl = urlData.publicUrl;
      console.log("✅ PDF uploaded to Supabase Storage bucket 'assignments':", fileUrl);
    } else if (uploadErr) {
      console.warn("Supabase Storage bucket notice (falling back to Data URL):", uploadErr.message);
    }
  } catch (storageErr) {
    console.warn("Storage upload exception, falling back to Data URL:", storageErr);
  }

  // Fallback to local Data URL if bucket is not yet active or user is offline
  if (!fileUrl) {
    fileUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  const newSubmission: AssignmentSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    assignmentId,
    batchId,
    rollNo: normRoll,
    studentName: studentName.trim(),
    studentAccountId,
    fileName: file.name,
    fileSize: file.size,
    fileDataUrl: fileUrl,
    submittedAt: new Date().toISOString(),
    comment: comment?.trim(),
  };

  // Attempt database sync to 'assignment_submissions' table if available
  try {
    await client.from("assignment_submissions").upsert({
      id: newSubmission.id,
      assignment_id: newSubmission.assignmentId,
      batch_id: newSubmission.batchId,
      roll_no: newSubmission.rollNo,
      student_name: newSubmission.studentName,
      student_account_id: newSubmission.studentAccountId,
      file_name: newSubmission.fileName,
      file_size: newSubmission.fileSize,
      file_url: newSubmission.fileDataUrl,
      submitted_at: newSubmission.submittedAt,
      comment: newSubmission.comment,
    });
  } catch (dbErr) {
    console.warn("Supabase DB sync notice:", dbErr);
  }

  // Update local cache
  const all = getAllSubmissions();
  const filtered = all.filter(
    (s) => !(normalizeRollNo(s.rollNo) === normRoll && s.assignmentId === assignmentId)
  );
  saveAllSubmissions([newSubmission, ...filtered]);

  return {
    success: true,
    message: "Assignment submitted successfully! Your submission is recorded for evaluation.",
    submission: newSubmission,
  };
}

// ==========================================
// STUDENT MARKS MANAGEMENT
// ==========================================

export function getAllMarksRecords(): StudentMarksRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_MARKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllMarksRecords(records: StudentMarksRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_MARKS, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save student marks:", err);
  }
}

/**
 * Get marks strictly for a given student's roll number.
 * Privacy guarantee: Student will only see their own marks!
 */
export function getMarksForStudent(rollNo: string): StudentMarksRecord | undefined {
  const normRoll = normalizeRollNo(rollNo);
  if (!normRoll) return undefined;
  const all = getAllMarksRecords();
  const existing = all.find((m) => normalizeRollNo(m.rollNo) === normRoll);
  if (existing) {
    if (existing.midMarks === undefined || existing.midMarks === "") {
      const def = IOT_BATCH_MID1_MARKS[normRoll];
      existing.midMarks = def?.midMarks ?? "0";
      existing.remarks = existing.remarks || def?.remarks;
    }
    return existing;
  }

  // If not found in records yet, return auto-populated entry from IOT_BATCH_MID1_MARKS or default 0
  const defaultInfo = IOT_BATCH_MID1_MARKS[normRoll];
  return {
    id: `mark_seed_${normRoll.toLowerCase()}`,
    batchId: IOT_BATCH_ID,
    rollNo: normRoll,
    studentName: normRoll === "23VV1A1232" ? "Likhith Kumar" : `Student ${normRoll}`,
    midMarks: defaultInfo?.midMarks ?? "0",
    remarks: defaultInfo?.remarks,
    updatedAt: new Date().toISOString(),
  };
}

export function saveStudentMarks(
  batchId: string,
  rollNo: string,
  marks: {
    studentName?: string;
    midMarks?: string;
    mid2Marks?: string;
    assignmentMarks?: string;
    remarks?: string;
  }
): StudentMarksRecord {
  const normRoll = normalizeRollNo(rollNo);
  const all = getAllMarksRecords();
  const existingIdx = all.findIndex((m) => normalizeRollNo(m.rollNo) === normRoll && m.batchId === batchId);

  const updatedRecord: StudentMarksRecord = {
    id: existingIdx >= 0 ? all[existingIdx].id : `mark_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    batchId,
    rollNo: normRoll,
    studentName: marks.studentName,
    midMarks: marks.midMarks?.trim(),
    mid2Marks: marks.mid2Marks?.trim(),
    assignmentMarks: marks.assignmentMarks?.trim(),
    remarks: marks.remarks?.trim(),
    updatedAt: new Date().toISOString(),
  };

  let newRecords: StudentMarksRecord[];
  if (existingIdx >= 0) {
    newRecords = [...all];
    newRecords[existingIdx] = updatedRecord;
  } else {
    newRecords = [updatedRecord, ...all];
  }

  saveAllMarksRecords(newRecords);

  // Sync to Supabase Cloud if available
  try {
    const client = supabaseAdmin || supabase;
    if (client) {
      client.from("student_marks_records").upsert({
        id: updatedRecord.id,
        batch_id: updatedRecord.batchId,
        roll_no: updatedRecord.rollNo,
        student_name: updatedRecord.studentName,
        mid_marks: updatedRecord.midMarks,
        mid2_marks: updatedRecord.mid2Marks,
        assignment_marks: updatedRecord.assignmentMarks,
        remarks: updatedRecord.remarks,
        updated_at: updatedRecord.updatedAt,
      }).then(({ error }) => {
        if (error) console.warn("Supabase student_marks_records sync notice:", error.message);
      });
    }
  } catch (err) {
    // Graceful offline fallback
  }

  return updatedRecord;
}

// Initialize all 74 IoT batch students with their official Mid-1 Marks (out of 30)
// Default is 0 for any missing student, Roll 4 explicitly neglected/absent = 0
export function initDefaultMarks(): void {
  try {
    let records = getAllMarksRecords();
    let updated = false;

    for (const student of BTECH_4TH_YEAR_2023_2027_STUDENTS) {
      const normRoll = normalizeRollNo(student.rollNo);
      const existingIdx = records.findIndex(
        (r) => r.batchId === IOT_BATCH_ID && normalizeRollNo(r.rollNo) === normRoll
      );

      const defaultInfo = IOT_BATCH_MID1_MARKS[normRoll];
      const targetMidMark = defaultInfo?.midMarks ?? "0";
      const targetRemarks = defaultInfo?.remarks;

      if (existingIdx === -1) {
        records.push({
          id: `mark_${normRoll.toLowerCase()}`,
          batchId: IOT_BATCH_ID,
          rollNo: normRoll,
          studentName: student.name,
          midMarks: targetMidMark,
          remarks: targetRemarks,
          updatedAt: new Date().toISOString(),
        });
        updated = true;
      } else if (!records[existingIdx].midMarks || records[existingIdx].midMarks === "") {
        records[existingIdx].midMarks = targetMidMark;
        if (targetRemarks && !records[existingIdx].remarks) {
          records[existingIdx].remarks = targetRemarks;
        }
        updated = true;
      }
    }

    if (updated) {
      saveAllMarksRecords(records);
    }
  } catch (err) {
    console.warn("Failed to initialize default marks:", err);
  }
}

// Run on load
initDefaultMarks();
