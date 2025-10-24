
const db = require('../config/db'); 

const getAllMatches = async(req,res) =>{
    try {
        const [matchRows] = await db.execute("SELECT * FROM MATCHLOG M ;");
        const [teamRows] = await db.execute("SELECT TEAMID,TEAMNAME FROM TEAM;")
        res.json({
            success:true,
            data:{
                matches:matchRows,
                team:teamRows
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const getMatch = async(req,res) =>{
    const {id} = req.params;
    if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
    }
    try {
        const [matchRows] = await db.execute(`SELECT * FROM MATCHLOG WHERE MATCHID = ?`,[id]);
        if (matchRows.length === 0) {
        return res.status(404).json({ success: false, error: "match not found" });
        }
        const team1ID = matchRows[0].Team1ID;
        const team2ID = matchRows[0].Team2ID;
        const [teamRows] = await db.execute(
            `SELECT TEAMID, TEAMNAME FROM TEAM WHERE TEAMID IN (?, ?)`,
            [team1ID, team2ID]
        );
        //const [coachRows] = await db.execute(`SELECT COACHID,COACHNAME,ROLE FROM COACH WHERE TEAMID = ?`,[id]);
        res.json({
        success: true,
        data: {
            match: matchRows,
            team: teamRows
        }
    });
    } catch (error) {
        console.error("DB Error (match by id):", error);
        res.status(500).json({ success: false, error: error.message });
    }
}


const addMatchLog = async (req, res) => {
  try {
    const { Team1ID, Team2ID, Venue, MatchDate, Team1Score, Team2Score, PlayerID } = req.body;

   
    if (!Team1ID || !Team2ID || !Venue || !MatchDate) {
      return res.status(400).json({ error: "Team1ID, Team2ID, Venue, and MatchDate are required." });
    }

    if (Team1ID === Team2ID) {
      return res.status(400).json({ error: "Team1ID and Team2ID cannot be the same." });
    }

    
    const scorePattern = /^\d{1,3}-\d{1,3}$/;
    if (Team1Score && !scorePattern.test(Team1Score)) {
      return res.status(400).json({ error: "Team1Score must be in the format 'runs-wickets' like '250-8'." });
    }
    if (Team2Score && !scorePattern.test(Team2Score)) {
      return res.status(400).json({ error: "Team2Score must be in the format 'runs-wickets' like '220-10'." });
    }

    
    const [teams] = await db.query(
      "SELECT TeamID FROM Team WHERE TeamID IN (?, ?)",
      [Team1ID, Team2ID]
    );
    if (teams.length !== 2) {
      return res.status(400).json({ error: "One or both teams do not exist." });
    }

    
    if (PlayerID) {
      const [player] = await db.query("SELECT PID FROM Player WHERE PID = ?", [PlayerID]);
      if (player.length === 0) {
        return res.status(400).json({ error: "PlayerID does not exist." });
      }
    }

    
    const insertQuery = `
      INSERT INTO MatchLog (Team1ID, Team2ID, Venue, MatchDate, Team1Score, Team2Score, PlayerID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(insertQuery, [
      Team1ID,
      Team2ID,
      Venue.trim(),
      MatchDate,
      Team1Score || '0-0',
      Team2Score || '0-0',
      PlayerID || null
    ]);

    res.status(201).json({ message: "MatchLog entry added successfully!" });
  } catch (error) {
    console.error("Error adding MatchLog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
                  addMatchLog,
                  getAllMatches,
                  getMatch
                };