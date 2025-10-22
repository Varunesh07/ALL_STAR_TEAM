const db = require("../config/db");

const getAllTeams = async(req,res) =>{
    try {
        const [rows,fields] = await db.execute("SELECT * FROM TEAM;");
        res.json({
            success:true,
            count:rows.length,
            data:rows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const getTeam = async(req,res) =>{
    const {id} = req.params;
    if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
    }
    try {
        const [teamrows] = await db.execute(`SELECT * FROM TEAM WHERE TEAMID = ?`,[id]);
        if (teamrows.length === 0) {
        return res.status(404).json({ success: false, error: "Team not found" });
        }
        const [playerRows] = await db.execute(`SELECT PID,PNAME,ROLE FROM PLAYER WHERE TEAMID = ?`,[id]);
        const [coachRows] = await db.execute(`SELECT COACHID,COACHNAME,ROLE FROM COACH WHERE TEAMID = ?`,[id]);
        res.json({
        success: true,
        data: {
            team: teamrows,
            players: playerRows,
            coaches: coachRows
        }
    });
    } catch (error) {
        console.error("DB Error (team by id):", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const getPointsTable = async(req,res)=>{
    try {
        const [teamRows] = await db.execute("SELECT * FROM TEAM ORDER BY MATCHESWON DESC,NRR DESC");
        res.json({
            success:true,
            count:teamRows.length,
            data:teamRows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const insertSingleTeam = async (req, res) => {
    try {
        const team = req.body;

        // Validate input
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

        // Validate required fields and constraints
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
        

        // Construct INSERT query (no PID)
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

        // Execute query
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

        // Validate PID
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid TEAMID: Must be a positive number'
            });
        }

        // Check if player exists
        const checkQuery = `SELECT TEAMID FROM team WHERE TEAMID = ?`;
        const [players] = await db.query(checkQuery, [id]);

        if (players.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Team with TEAMID ${id} not found`
            });
        }

        // Delete player
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

        // Validate TeamID
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid TeamID: Must be a positive number'
            });
        }

        // Validate input
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input: Expected a team object'
            });
        }

        // Fetch existing team
        const checkQuery = `SELECT TeamID, TeamName, MatchesWon, MatchesLost, Champions, NRR FROM Team WHERE TeamID = ?`;
        const [teams] = await db.query(checkQuery, [id]);

        if (teams.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Team with TeamID ${id} not found`
            });
        }

        const existingTeam = teams[0];

        // Compare and collect fields to update
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

        // If no fields to update, return early
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No changes detected',
                data: existingTeam
            });
        }

        // Build dynamic UPDATE query
        const setClause = Object.keys(fieldsToUpdate)
            .map(field => `${field} = ?`)
            .join(', ');
        const values = [...Object.values(fieldsToUpdate), id];
        const updateQuery = `UPDATE Team SET ${setClause} WHERE TeamID = ?`;

        // Execute update
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

module.exports = {getAllTeams,
                  getTeam,
                  getPointsTable,
                  insertSingleTeam,
                  deleteTeam,
                  updateTeam   
                };