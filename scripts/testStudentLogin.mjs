// Standalone mock to test student accounts and login
const normalizeRollNo = (roll) => roll ? roll.trim().toUpperCase().replace(/[\s\-_]+/g, "") : "";

const BTECH_4TH_YEAR_2023_2027_STUDENTS = Array.from({ length: 74 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  const roll = `23VV1A12${num}`;
  return {
    rollNo: roll,
    name: roll === "23VV1A1232" ? "Likhith Kumar" : `Student ${roll}`,
    email: `${roll.toLowerCase()}@jntugv.edu.in`,
  };
});

const LATERAL_ENTRY_2024_2027_STUDENTS = [
  { rollNo: "24VV5A1269", name: "Student 24VV5A1269 (LES)", email: "24vv5a1269@jntugv.edu.in" },
  { rollNo: "24VV5A1270", name: "Student 24VV5A1270 (LES)", email: "24vv5a1270@jntugv.edu.in" },
  { rollNo: "24VV5A1271", name: "Student 24VV5A1271 (LES)", email: "24vv5a1271@jntugv.edu.in" },
  { rollNo: "24VV5A1272", name: "Student 24VV5A1272 (LES)", email: "24vv5a1272@jntugv.edu.in" },
  { rollNo: "24VV5A1273", name: "Student 24VV5A1273 (LES)", email: "24vv5a1273@jntugv.edu.in" },
  { rollNo: "24VV5A1274", name: "Student 24VV5A1274 (LES)", email: "24vv5a1274@jntugv.edu.in" },
];

const ALL_IOT_BATCH_STUDENTS = [
  ...BTECH_4TH_YEAR_2023_2027_STUDENTS,
  ...LATERAL_ENTRY_2024_2027_STUDENTS,
];

// Build accounts exactly as getAllStudentAccounts does
const accounts = ALL_IOT_BATCH_STUDENTS.map((s) => {
  const normRoll = normalizeRollNo(s.rollNo);
  const rollSuffix = normRoll.slice(-4);
  const strongPassword = `Jv@${rollSuffix}#`;
  return {
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
  };
});

function login(usernameOrRoll, password) {
  const rawInput = (usernameOrRoll || "").trim();
  const query = rawInput.toLowerCase();
  const normRoll = normalizeRollNo(rawInput);

  const found = accounts.find((acc) => {
    const accUser = (acc.username || "").trim().toLowerCase();
    const accRollNorm = normalizeRollNo(acc.rollNo);
    const accUserNorm = normalizeRollNo(acc.username);
    const accEmail = (acc.email || "").trim().toLowerCase();
    const accName = (acc.fullName || "").trim().toLowerCase();

    // Match exact or lowercase username (e.g. "23vv1a1232" or "23VV1A1232")
    if (accUser && (accUser === query || accUser === normRoll.toLowerCase())) return true;

    // Match normalized roll number (case-insensitive: "23VV1A1232" or "23vv1a1232")
    if (normRoll && accRollNorm && accRollNorm === normRoll) return true;

    // Match if username was saved with roll number
    if (normRoll && accUserNorm && accUserNorm === normRoll) return true;

    // Match by email address
    if (accEmail && accEmail === query) return true;

    // Match by full student name
    if (accName && accName === query) return true;

    return false;
  });

  if (!found) {
    return { success: false, message: "No account found" };
  }

  const enteredPass = (password || "").trim();
  const rollSuffix = found.rollNo ? normalizeRollNo(found.rollNo).slice(-4) : "";
  const strongDefault = rollSuffix ? `Jv@${rollSuffix}#` : "";

  const passMatches =
    Boolean(found.passwordHash && found.passwordHash === enteredPass) ||
    Boolean(found.passwordHash && found.passwordHash.toLowerCase() === enteredPass.toLowerCase()) ||
    Boolean(strongDefault && enteredPass.toLowerCase() === strongDefault.toLowerCase()) ||
    Boolean(found.rollNo && normalizeRollNo(enteredPass) === normalizeRollNo(found.rollNo)) ||
    Boolean(found.username && enteredPass.toLowerCase() === found.username.toLowerCase()) ||
    Boolean(rollSuffix && enteredPass === rollSuffix) ||
    Boolean(rollSuffix && enteredPass.toLowerCase() === `jv@${rollSuffix}`) ||
    Boolean(rollSuffix && enteredPass.toLowerCase() === `jv${rollSuffix}#`) ||
    Boolean(rollSuffix && enteredPass.toLowerCase() === `jv${rollSuffix}`);

  if (!passMatches) {
    return { success: false, message: "Incorrect password" };
  }

  return { success: true, account: found };
}

console.log(`Loaded ${accounts.length} student accounts.`);
const tests = [
  // User test cases for 23VV1A1232 / 23vv1a1232:
  ["23VV1A1232", "Jv@1232#"],
  ["23vv1a1232", "Jv@1232#"],
  ["23Vv1a1232", "Jv@1232#"],
  [" 23vv1a1232 ", "Jv@1232#"],
  ["23 vv 1a 1232", "Jv@1232#"],
  ["23-vv-1a-1232", "Jv@1232#"],
  ["23VV1A1232", "jv@1232#"],
  ["23vv1a1232", "23vv1a1232"],
  ["23VV1A1232", "23VV1A1232"],
  ["23VV1A1232", "1232"],
  // Other students
  ["23VV1A1201", "Jv@1201#"],
  ["23vv1a1201", "Jv@1201#"],
  ["24VV5A1269", "Jv@1269#"],
  ["24vv5a1269", "Jv@1269#"],
  ["24VV5A1274", "Jv@1274#"],
  ["24vv5a1274", "jv@1274#"],
  ["24VV5A1274", "wrongPassword", true],
];

let allPassed = true;
for (const [u, p, shouldFail] of tests) {
  const res = login(u, p);
  const ok = shouldFail ? !res.success : res.success;
  console.log(`Login test [${u}] with pass [${p}]: ${res.success ? "SUCCESS" : "FAILED"} -> ${ok ? "PASS" : "FAIL"}`);
  if (!ok) allPassed = false;
}

if (allPassed) {
  console.log("All login and password tests passed successfully!");
} else {
  console.error("Some tests failed!");
  process.exit(1);
}

