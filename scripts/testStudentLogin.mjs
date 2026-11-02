// Standalone mock to test student accounts and login
const normalizeRollNo = (roll) => roll ? roll.trim().toUpperCase().replace(/\s+/g, "") : "";

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
  const query = usernameOrRoll.trim().toLowerCase();
  const normRoll = normalizeRollNo(usernameOrRoll);

  const found = accounts.find((acc) => {
    const uMatch = acc.username.toLowerCase() === query;
    const rMatch = acc.rollNo && normalizeRollNo(acc.rollNo) === normRoll;
    return uMatch || rMatch;
  });

  if (!found) {
    return { success: false, message: "No account found" };
  }

  const enteredPass = password.trim();
  const rollSuffix = found.rollNo ? normalizeRollNo(found.rollNo).slice(-4) : "";
  const strongDefault = rollSuffix ? `Jv@${rollSuffix}#` : "";

  const passMatches =
    found.passwordHash === enteredPass ||
    found.passwordHash.toLowerCase() === enteredPass.toLowerCase() ||
    (strongDefault && enteredPass.toLowerCase() === strongDefault.toLowerCase()) ||
    (found.rollNo && normalizeRollNo(enteredPass) === normalizeRollNo(found.rollNo));

  if (!passMatches) {
    return { success: false, message: "Incorrect password" };
  }

  return { success: true, account: found };
}

console.log(`Loaded ${accounts.length} student accounts.`);
const tests = [
  ["23VV1A1201", "Jv@1201#"],
  ["23vv1a1201", "Jv@1201#"],
  ["23VV1A1232", "Jv@1232#"],
  ["24VV5A1269", "Jv@1269#"],
  ["24vv5a1269", "Jv@1269#"],
  ["24VV5A1274", "Jv@1274#"],
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
