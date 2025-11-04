const db = require('../config/db');

const getAllPlayers = async (req, res) => {
  try {
    const [playerRows] = await db.execute(`
      SELECT 
        p.PID,
        p.PName,
        p.Role,
        p.TeamID,
        p.Isselected,
        p.RunsScored,
        p.WicketsTaken,
        p.BallsFaced,
        p.RunsGiven,
        p.HighestScore,
        p.BestBowlingFigure,
        t.TeamName
      FROM PLAYER p
      LEFT JOIN TEAM t ON p.TeamID = t.TeamID
    `);

    res.json({
      success: true,
      data: { players: playerRows }
    });
  } catch (error) {
    console.error('getAllPlayers error:', error);
    res.json({ success: false, error: error.message });
  }
};

const getPlayer = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
  }

  try {
    const [playerRows] = await db.execute(`
      SELECT 
        PID, PName, Role, TeamID, DOB,
        RunsScored, WicketsTaken, HighestScore, BestBowlingFigure, Isselected
      FROM PLAYER 
      WHERE PID = ?
    `, [id]);

    if (playerRows.length === 0) {
      return res.status(404).json({ success: false, error: "Player not found" });
    }

    const [teamRows] = await db.execute(`
      SELECT 
        TEAMID , TEAMNAME
      FROM TEAM 
    `);

    if (teamRows.length === 0) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    res.json({
      success: true,
      data: { player: playerRows, teams: teamRows }
    });
  } catch (error) {
    console.error("DB Error (player by id):", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const orangeCap = async (req, res) => {
  try {
    const [playerRows] = await db.execute(`
      SELECT 
        p.PID,
        p.PName,
        p.TeamID,
        t.TeamName,
        p.Role,
        p.RunsScored
      FROM PLAYER p
      LEFT JOIN TEAM t ON p.TeamID = t.TeamID
      ORDER BY p.RunsScored DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      count: playerRows.length,
      data: playerRows
    });
  } catch (error) {
    console.error('orangeCap error:', error);
    res.json({ success: false, error: error.message });
  }
};

const purpleCap = async (req, res) => {
  try {
    const [playerRows] = await db.execute(`
      SELECT 
        p.PID,
        p.PName,
        p.TeamID,
        t.TeamName,
        p.Role,
        p.WicketsTaken
      FROM PLAYER p
      LEFT JOIN TEAM t ON p.TeamID = t.TeamID
      ORDER BY p.WicketsTaken DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      count: playerRows.length,
      data: playerRows
    });
  } catch (error) {
    console.error('purpleCap error:', error);
    res.json({ success: false, error: error.message });
  }
};

/* === INSERT, DELETE, UPDATE (unchanged, only minor formatting) === */
const insertSinglePlayer = async (req, res) => {
  try {
    const player = req.body;

    if (!player || typeof player !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input: Expected a player object'
      });
    }

    const {
      PName,
      TEAMID,
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

    if (!PName || !DOB || !Role) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: PName, DOB, and Role are required'
      });
    }
    if (!['Batsman', 'Bowler', 'Allrounder', 'Wicketkeeper'].includes(Role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Role: Must be Batsman, Bowler, Allrounder, or Wicketkeeper'
      });
    }
    if (isNaN(TEAMID) || TEAMID < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TEAMID: Must be greater than 0'
      });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(DOB)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid DOB format: Must be YYYY-MM-DD'
      });
    }
    if (isNaN(RunsScored) || RunsScored < 0 ||
        isNaN(WicketsTaken) || WicketsTaken < 0 ||
        isNaN(BallsFaced) || BallsFaced < 0 ||
        isNaN(RunsGiven) || RunsGiven < 0 ||
        isNaN(HighestScore) || HighestScore < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Numeric fields must be non-negative numbers'
      });
    }
    if (!/^\d+\/\d+$/.test(BestBowlingFigure)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid BestBowlingFigure format: Must be W/R (e.g., 3/25)'
      });
    }

    const query = `
      INSERT INTO player (
        PName, TEAMID, DOB, isSelected, Role,
        RunsScored, WicketsTaken, BallsFaced, RunsGiven,
        HighestScore, BestBowlingFigure
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      PName, TEAMID, DOB, isSelected, Role,
      RunsScored, WicketsTaken, BallsFaced, RunsGiven,
      HighestScore, BestBowlingFigure
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Player insertion failed'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Player inserted successfully',
      data: { insertedPID: result.insertId }
    });
  } catch (error) {
    console.error('Error inserting player:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to insert player',
      error: error.message
    });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid PID: Must be a positive number'
      });
    }

    const checkQuery = `SELECT PID FROM player WHERE PID = ?`;
    const [existing] = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Player with PID ${id} not found`
      });
    }

    const deleteQuery = `DELETE FROM player WHERE PID = ?`;
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete player'
      });
    }

    res.json({
      status: 'success',
      message: `Player with PID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete player',
      error: error.message
    });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    if (isNaN(id) || id < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid PID: Must be a positive number'
      });
    }
    console.log('Entered edit with player id ' , id);
    
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input: Expected a player object'
      });
    }

    const checkQuery = `
      SELECT PID, PName, TEAMID, DOB, isSelected, Role,
             RunsScored, WicketsTaken, BallsFaced, RunsGiven,
             HighestScore, BestBowlingFigure 
      FROM player   WHERE PID = ?
    `;
    const [players] = await db.query(checkQuery, [id]);

    if (players.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Player with PID ${id} not found`
      });
    }

    const existingPlayer = players[0];
    const fieldsToUpdate = {};

    // Validation + diff logic (unchanged)
    if (newData.PName && newData.PName.trim() !== existingPlayer.PName) {
      if (typeof newData.PName !== 'string' || newData.PName.trim().length === 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid PName: Must be a non-empty string' });
      }
      fieldsToUpdate.PName = newData.PName.trim();
    }
    if (newData.TEAMID !== undefined && newData.TEAMID !== existingPlayer.TEAMID) {
      if (newData.TEAMID !== null && (isNaN(newData.TEAMID) || newData.TEAMID < 1)) {
        return res.status(400).json({ status: 'error', message: 'Invalid TEAMID: Must be a positive number or null' });
      }
      fieldsToUpdate.TEAMID = newData.TEAMID;
    }
    if (newData.DOB && newData.DOB !== existingPlayer.DOB) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(newData.DOB)) {
        return res.status(400).json({ status: 'error', message: 'Invalid DOB format: Must be YYYY-MM-DD' });
      }
      fieldsToUpdate.DOB = newData.DOB;
    }
    if (newData.isSelected !== undefined && newData.isSelected !== existingPlayer.isSelected) {
      if (![0, 1].includes(newData.isSelected)) {
        return res.status(400).json({ status: 'error', message: 'Invalid isSelected: Must be 0 or 1' });
      }
      fieldsToUpdate.isSelected = newData.isSelected;
    }
    if (newData.Role && newData.Role !== existingPlayer.Role) {
      if (!['Batsman', 'Bowler', 'Allrounder', 'Wicketkeeper'].includes(newData.Role)) {
        return res.status(400).json({ status: 'error', message: 'Invalid Role' });
      }
      fieldsToUpdate.Role = newData.Role;
    }
    if (newData.RunsScored !== undefined && newData.RunsScored !== existingPlayer.RunsScored) {
      if (!Number.isInteger(newData.RunsScored) || newData.RunsScored < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid RunsScored' });
      }
      fieldsToUpdate.RunsScored = newData.RunsScored;
    }
    if (newData.WicketsTaken !== undefined && newData.WicketsTaken !== existingPlayer.WicketsTaken) {
      if (!Number.isInteger(newData.WicketsTaken) || newData.WicketsTaken < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid WicketsTaken' });
      }
      fieldsToUpdate.WicketsTaken = newData.WicketsTaken;
    }
    if (newData.BallsFaced !== undefined && newData.BallsFaced !== existingPlayer.BallsFaced) {
      if (!Number.isInteger(newData.BallsFaced) || newData.BallsFaced < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid BallsFaced' });
      }
      fieldsToUpdate.BallsFaced = newData.BallsFaced;
    }
    if (newData.RunsGiven !== undefined && newData.RunsGiven !== existingPlayer.RunsGiven) {
      if (!Number.isInteger(newData.RunsGiven) || newData.RunsGiven < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid RunsGiven' });
      }
      fieldsToUpdate.RunsGiven = newData.RunsGiven;
    }
    if (newData.HighestScore !== undefined && newData.HighestScore !== existingPlayer.HighestScore) {
      if (!Number.isInteger(newData.HighestScore) || newData.HighestScore < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid HighestScore' });
      }
      fieldsToUpdate.HighestScore = newData.HighestScore;
    }
    if (newData.BestBowlingFigure !== undefined && newData.BestBowlingFigure !== existingPlayer.BestBowlingFigure) {
      if (newData.BestBowlingFigure !== null && !/^\d+\/\d+$/.test(newData.BestBowlingFigure)) {
        return res.status(400).json({ status: 'error', message: 'Invalid BestBowlingFigure format' });
      }
      fieldsToUpdate.BestBowlingFigure = newData.BestBowlingFigure;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No changes detected',
        data: existingPlayer
      });
    }

    const setClause = Object.keys(fieldsToUpdate).map(f => `${f} = ?`).join(', ');
    const values = [...Object.values(fieldsToUpdate), id];
    const updateQuery = `UPDATE player SET ${setClause} WHERE PID = ?`;

    const [result] = await dbb.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({ status: 'error', message: 'Failed to update player' });
    }

    res.json({
      status: 'success',
      message: `Player with PID ${id} updated successfully`,
      data: { PID: parseInt(id), ...fieldsToUpdate }
    });
  } catch (error) {
    console.error('Error updating player:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ status: 'error', message: 'Invalid TEAMID: Team does not exist' });
    }
    res.status(500).json({ status: 'error', message: 'Failed to update player', error: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayer,
  orangeCap,
  purpleCap,
  insertSinglePlayer,
  deletePlayer,
  updatePlayer
};