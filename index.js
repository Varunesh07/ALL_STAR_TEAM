// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// === MODELS ===
const { createTableTeam } = require("./models/teamModel");
const { createPlayerTable } = require("./models/playerModel");
const { createTableCoach } = require("./models/coachModel");
const { createMatchLog } = require("./models/matchLogModel");
const { createTableEval } = require("./models/evalModel");
const { createTableAdmin } = require("./models/adminModel");

// === ROUTERS ===
const teamRouter = require("./routes/team");
const playerRouter = require("./routes/player");
const coachRouter = require("./routes/coach");
const astRouter = require("./routes/ast");
const matchLogRouter = require("./routes/matchlog");

// === TRIGGER ===
const { createMatchLogTrigger , createDeleteTrigger } = require("./controllers/setup");

// === EXPRESS APP ===
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// === API ROUTES ===
app.use("/teams", teamRouter);
app.use("/players", playerRouter);
app.use("/coaches", coachRouter);
app.use("/allstarteam", astRouter);
app.use("/matches", matchLogRouter); // MATCHES

// === REDIRECTS ===
app.get('/allstar', (req, res) => res.redirect('/allstarteam'));

// === SPA FALLBACK ===
// SPA FALLBACK — MUST BE LAST
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && !req.path.includes('.')) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    next();
  }
});

// === DATABASE & TRIGGERS ===
(async () => {
  try {
    console.log("Creating tables...");
    await createTableAdmin();
    await createTableTeam();
    await createPlayerTable();
    await createTableCoach();
    await createMatchLog();
    await createTableEval();
    console.log("All tables created!");
  } catch (err) {
    console.error("Table creation failed:", err);
  }
})();

(async () => {
  try {
    await createMatchLogTrigger({ body: {} }, { status: () => ({ json: () => {} }) });
    await createDeleteTrigger({ body: {} }, { status: () => ({ json: () => {} }) });
    console.log("MatchLog trigger created");
  } catch (error) {
    console.error("Trigger failed:", error);
  }
})();

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});