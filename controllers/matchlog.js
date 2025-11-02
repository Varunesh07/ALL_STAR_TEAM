// controllers/matchlog.js
const db = require('../config/db');

const getAllMatches = async (req, res) => {
  try {
    const [matchRows] = await db.execute("SELECT * FROM MATCHLOG ORDER BY MatchDate DESC;");
    const [teamRows] = await db.execute("SELECT TEAMID, TEAMNAME FROM TEAM;");

    res.json({
      success: true,
      data: {
        matches: matchRows,
        teams: teamRows
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getMatch = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
  }
  console.log('The match id is ',id);
  
  try {
    const [matchRows] = await db.execute(`SELECT M.*,P.PName FROM MATCHLOG M NATURAL JOIN PLAYER P WHERE MATCHID = ? AND PLAYERID = PID;`, [id]);
    if (matchRows.length === 0) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    const m = matchRows[0]; // single match
    const [teamRows] = await db.execute(
      `SELECT TEAMID, TEAMNAME FROM TEAM WHERE TEAMID IN (?, ?)`,
      [m.Team1ID, m.Team2ID]
    );

    

    res.json({
      success: true,
      data: {
        match: m,        // ← single object
        teams: teamRows
      }
    });
  } catch (error) {
      console.error("DB Error (match by id):", error);
      res.status(500).json({ success: false, error: error.message });
  }
};

const addMatchLog = async (req, res) => {
  try {
    const { Team1ID, Team2ID, Venue, MatchDate, Team1Score, Team2Score, PlayerID } = req.body;

    if (!Team1ID || !Team2ID || !Venue || !MatchDate) {
      return res.status(400).json({ success: false, error: "Team1ID, Team2ID, Venue, and MatchDate are required." });
    }

    if (Team1ID === Team2ID) {
      return res.status(400).json({ success: false, error: "Team1ID and Team2ID cannot be the same." });
    }

    const scorePattern = /^\d{1,3}-\d{1,3}$/;
    if (Team1Score && !scorePattern.test(Team1Score)) {
      return res.status(400).json({ success: false, error: "Team1Score must be in 'runs-wickets' format." });
    }
    if (Team2Score && !scorePattern.test(Team2Score)) {
      return res.status(400).json({ success: false, error: "Team2Score must be in 'runs-wickets' format." });
    }

    const [teams] = await db.query("SELECT TeamID FROM Team WHERE TeamID IN (?, ?)", [Team1ID, Team2ID]);
    if (teams.length !== 2) {
      return res.status(400).json({ success: false, error: "One or both teams do not exist." });
    }

    if (PlayerID) {
      const [player] = await db.query("SELECT PID FROM Player WHERE PID = ?", [PlayerID]);
      if (player.length === 0) {
        return res.status(400).json({ success: false, error: "PlayerID does not exist." });
      }
    }

    const insertQuery = `
      INSERT INTO MatchLog (Team1ID, Team2ID, Venue, MatchDate, Team1Score, Team2Score, PlayerID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [
      Team1ID,
      Team2ID,
      Venue.trim(),
      MatchDate,
      Team1Score || '0-0',
      Team2Score || '0-0',
      PlayerID || null
    ]);

    res.status(201).json({
      success: true,
      message: "Match added!",
      data: { insertId: result.insertId }
    });
  } catch (error) {
    console.error("Error adding MatchLog:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

module.exports = { addMatchLog, getAllMatches, getMatch };