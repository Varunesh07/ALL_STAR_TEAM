const db = require("../config/db");

const getAllTeams = async (req, res) => {
  try {
    const [rows, fields] = await db.execute("SELECT * FROM TEAM;");
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message
    });
  }
};

const getTeam = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
  }
  console.log('The team id is ',id);
  try {
    // TEAM INFO
    const [teamRows] = await db.execute(`SELECT * FROM TEAM WHERE TeamID = ?`, [id]);
    if (teamRows.length === 0) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    // FULL PLAYER DATA (ALL STATS)
    const [playerRows] = await db.execute(`
      SELECT 
        PID, PName, Role, 
        RunsScored, WicketsTaken, 
        HighestScore, BestBowlingFigure, 
        DOB, Isselected
      FROM PLAYER 
      WHERE TeamID = ?
    `, [id]);

    // FULL COACH DATA
    const [coachRows] = await db.execute(`
      SELECT CoachID, CoachName, Role, ChampionshipsWon, WinPercentage, Experience
      FROM COACH 
      WHERE TeamID = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        team: teamRows,
        players: playerRows,
        coaches: coachRows
      }
    });
  } catch (error) {
    console.error("DB Error (team by id):", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getPointsTable = async (req, res) => {
  try {
    const [teamRows] = await db.execute("SELECT * FROM TEAM ORDER BY MATCHESWON DESC,NRR DESC");
    res.json({
      success: true,
      count: teamRows.length,
      data: teamRows
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message
    });
  }
};

const insertSingleTeam = async (req, res) => {
  try {
    const team = req.body;

    if (!team || typeof team !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input: Expected a team object'
      });
    }

    const {
      teamName,
      MatchesWon,
      MatchesLost,
      Champions,
      NRR
    } = team;

    if (!teamName) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: TeamName is required'
      });
    }

    if (isNaN(MatchesWon) || MatchesWon < 0 ||
      isNaN(MatchesLost) || MatchesLost < 0 ||
      isNaN(Champions) || Champions < 0 ||
      isNaN(NRR)) {
      return res.status(400).json({
        status: 'error',
        message: 'Numeric fields must be non-negative numbers'
      });
    }

    const query = `
      INSERT INTO TEAM (
      teamName , MatchesWon , MatchesLost , Champions , NRR
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      teamName,
      MatchesWon,
      MatchesLost,
      Champions,
      NRR
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Team insertion failed, possibly due to database constraints'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Team inserted successfully',
      data: { insertedPID: result.insertId }
    });

  } catch (error) {
    console.error('Error inserting team:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to insert team',
      error: error.message
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TEAMID: Must be a positive number'
      });
    }

    const checkQuery = `SELECT TEAMID FROM team WHERE TEAMID = ?`;
    const [players] = await db.query(checkQuery, [id]);

    if (players.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Team with TEAMID ${id} not found`
      });
    }

    const deleteQuery = `DELETE FROM TEAM WHERE TEAMID = ?`;
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete team'
      });
    }

    res.json({
      status: 'success',
      message: `Team with TEAMID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete team',
      error: error.message
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TeamID: Must be a positive number'
      });
    }

    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input: Expected a team object'
      });
    }

    const checkQuery = `SELECT TeamID, TeamName, MatchesWon, MatchesLost, Champions, NRR FROM Team WHERE TeamID = ?`;
    const [teams] = await db.query(checkQuery, [id]);

    if (teams.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Team with TeamID ${id} not found`
      });
    }

    const existingTeam = teams[0];
    const fieldsToUpdate = {};

    if (newData.TeamName && newData.TeamName.trim() !== existingTeam.TeamName) {
      if (typeof newData.TeamName !== 'string' || newData.TeamName.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid TeamName: Must be a non-empty string'
        });
      }
      fieldsToUpdate.TeamName = newData.TeamName.trim();
    }
    if (newData.MatchesWon !== undefined && newData.MatchesWon !== existingTeam.MatchesWon) {
      if (!Number.isInteger(newData.MatchesWon) || newData.MatchesWon < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid MatchesWon: Must be a non-negative integer'
        });
      }
      fieldsToUpdate.MatchesWon = newData.MatchesWon;
    }
    if (newData.MatchesLost !== undefined && newData.MatchesLost !== existingTeam.MatchesLost) {
      if (!Number.isInteger(newData.MatchesLost) || newData.MatchesLost < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid MatchesLost: Must be a non-negative integer'
        });
      }
      fieldsToUpdate.MatchesLost = newData.MatchesLost;
    }
    if (newData.Champions !== undefined && newData.Champions !== existingTeam.Champions) {
      if (!Number.isInteger(newData.Champions) || newData.Champions < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid Champions: Must be a non-negative integer'
        });
      }
      fieldsToUpdate.Champions = newData.Champions;
    }
    if (newData.NRR !== undefined && newData.NRR !== existingTeam.NRR) {
      if (isNaN(newData.NRR) || newData.NRR < -9.99 || newData.NRR > 9.99) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid NRR: Must be a number between -9.99 and 9.99'
        });
      }
      fieldsToUpdate.NRR = parseFloat(newData.NRR.toFixed(2));
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No changes detected',
        data: existingTeam
      });
    }

    const setClause = Object.keys(fieldsToUpdate)
      .map(field => `${field} = ?`)
      .join(', ');
    const values = [...Object.values(fieldsToUpdate), id];
    const updateQuery = `UPDATE Team SET ${setClause} WHERE TeamID = ?`;

    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update team'
      });
    }

    res.json({
      status: 'success',
      message: `Team with TeamID ${id} updated successfully`,
      data: { TeamID: parseInt(id), ...fieldsToUpdate }
    });
  } catch (error) {
    console.error('Error updating team:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'error',
        message: 'TeamName already exists',
        error: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update team',
      error: error.message
    });
  }
};

const addPlayerToTeam = async (req, res) => {
  try {
    const teamId = Number(req.params.id);
    if (isNaN(teamId) || teamId < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TeamID – must be a positive integer'
      });
    }

    // 1. Verify team exists
    const [teamRows] = await db.execute('SELECT TEAMID FROM TEAM WHERE TEAMID = ?', [teamId]);
    if (teamRows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Team with TEAMID ${teamId} not found`
      });
    }

    // 2. Parse player data
    const player = req.body;
    if (!player || typeof player !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Request body must be a player object'
      });
    }

    const {
      PName,
      DOB,
      isSelected = 0,
      Role,
      RunsScored = 0,
      WicketsTaken = 0,
      BallsFaced = 0,
      RunsGiven = 0,
      HighestScore = 0,
      BestBowlingFigure = '0/0'
    } = player;

    // 3. Validation
    if (!PName || !DOB || !Role) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: PName, DOB, Role'
      });
    }
    if (!['Batsman', 'Bowler', 'Allrounder', 'Wicketkeeper'].includes(Role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Role – allowed: Batsman, Bowler, Allrounder, Wicketkeeper'
      });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(DOB)) {
      return res.status(400).json({
        status: 'error',
        message: 'DOB must be YYYY-MM-DD'
      });
    }

    const nums = { RunsScored, WicketsTaken, BallsFaced, RunsGiven, HighestScore };
    for (const [k, v] of Object.entries(nums)) {
      if (!Number.isInteger(v) || v < 0) {
        return res.status(400).json({
          status: 'error',
          message: `${k} must be a non-negative integer`
        });
      }
    }
    if (!/^\d+\/\d+$/.test(BestBowlingFigure)) {
      return res.status(400).json({
        status: 'error',
        message: 'BestBowlingFigure must be W/R (e.g. 3/25)'
      });
    }

    // 4. Insert player
    const insertQ = `
      INSERT INTO PLAYER (
        PName, TEAMID, DOB, isSelected, Role,
        RunsScored, WicketsTaken, BallsFaced, RunsGiven,
        HighestScore, BestBowlingFigure
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `;
    const insertVals = [
      PName, teamId, DOB, isSelected, Role,
      RunsScored, WicketsTaken, BallsFaced, RunsGiven,
      HighestScore, BestBowlingFigure
    ];

    const [result] = await db.query(insertQ, insertVals);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Player insertion failed (DB constraint?)'
      });
    }

    res.status(201).json({
      status: 'success',
      message: `Player added to team ${teamId}`,
      data: { insertedPID: result.insertId }
    });

  } catch (err) {
    console.error('addPlayerToTeam error:', err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'TeamID does not exist (FK violation)'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to add player',
      error: err.message
    });
  }
};

const removePlayerFromTeam = async (req, res) => {
  try {
    const teamId = Number(req.params.id);
    const playerId = Number(req.params.pid);

    if (isNaN(teamId) || teamId < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TeamID – must be a positive integer'
      });
    }
    if (isNaN(playerId) || playerId < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid PID – must be a positive integer'
      });
    }

    // 1. Check player belongs to team
    const [rows] = await db.execute(
      'SELECT PID FROM PLAYER WHERE PID = ? AND TEAMID = ?',
      [playerId, teamId]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Player ${playerId} not found in team ${teamId}`
      });
    }

    // 2. Delete player
    const [delRes] = await db.query('DELETE FROM PLAYER WHERE PID = ?', [playerId]);

    if (delRes.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete player'
      });
    }

    res.json({
      status: 'success',
      message: `Player ${playerId} removed from team ${teamId}`
    });

  } catch (err) {
    console.error('removePlayerFromTeam error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove player',
      error: err.message
    });
  }
};

module.exports = {
  getAllTeams,
  getTeam,
  getPointsTable,
  insertSingleTeam,
  deleteTeam,
  updateTeam,
  addPlayerToTeam,        // NEW
  removePlayerFromTeam    // NEW
};