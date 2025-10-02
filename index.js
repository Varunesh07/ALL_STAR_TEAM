require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL connected successfully!");
});


app.post("/add-student", (req, res) => {
  const { name, dept } = req.body;
  const sql = "INSERT INTO students (name, dept) VALUES (?, ?)";
  db.query(sql, [name, dept], (err, result) => {
    if (err) throw err;
    res.send("🎉 Student added with ID: " + result.insertId);
  });
});

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) throw err;
    console.log(results)
    res.json(results);
  });
});

// ----------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
