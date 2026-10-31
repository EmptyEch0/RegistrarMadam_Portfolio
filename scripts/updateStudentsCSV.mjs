import fs from "fs";

const marksData = {
  1: "12", 2: "11.5", 3: "21", 4: "0 (Neglected)", 5: "17", 6: "14.5", 7: "13", 8: "20", 9: "23", 10: "22",
  11: "22", 12: "14", 13: "22", 14: "11", 15: "11", 16: "24", 17: "17", 18: "19", 19: "16", 20: "23",
  21: "16", 22: "19", 23: "21", 24: "21", 25: "24", 26: "11", 27: "18", 28: "8", 29: "24", 30: "18",
  31: "16", 32: "22.5", 33: "16", 34: "17", 35: "11", 36: "23.5", 37: "22", 38: "26", 39: "19", 40: "20",
  41: "28", 42: "26.5", 43: "15.5", 44: "25", 45: "11", 46: "22", 47: "17", 48: "19", 49: "24", 50: "24.5",
  51: "28", 52: "7", 53: "26", 54: "26.5", 55: "17", 56: "17.5", 57: "16", 58: "18", 59: "25", 60: "24",
  61: "24", 62: "22", 63: "28.5", 64: "23", 65: "26.5", 66: "25", 67: "22", 68: "25.5", 69: "25", 70: "22",
  71: "25.5", 72: "22", 73: "17.5", 74: "20.5"
};

const rows = [
  ["S.No", "Roll Number", "Username", "Full Name", "Email Address", "Password (8 Chars)", "Password Structure", "Mid-1 Marks (/30)", "Batch", "Year", "Course"]
];

for (let i = 1; i <= 74; i++) {
  const num = String(i).padStart(2, "0");
  const roll = `23VV1A12${num}`;
  const username = roll.toLowerCase();
  const name = roll === "23VV1A1232" ? "Likhith Kumar" : `Student ${roll}`;
  const email = `${username}@jntugv.edu.in`;
  const pwd = `Jv@12${num}#`;
  const pwdStruct = `Char(Jv) + Symbol(@) + Int(12${num}) + Symbol(#)`;
  const mark = marksData[i] !== undefined ? marksData[i] : "0";

  rows.push([i, roll, username, name, email, pwd, pwdStruct, mark, "2023-2027", "4th Year", "Internet of Things (IoT)"]);
}

const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
fs.writeFileSync("students_credentials_2023_2027.csv", csvContent, "utf8");
console.log(`Successfully generated students_credentials_2023_2027.csv with ${rows.length - 1} student records.`);

