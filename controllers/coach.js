const db = require('../config/db');

const getAllCoaches = async(req,res) =>{
    try {
        const [coachRows] = await db.execute("SELECT CoachID,CoachName,TeamID,Role,TeamName FROM COACH NATURAL JOIN TEAM;");
        //const [teamRows] = await db.execute("SELECT TEAMID,TEAMNAME FROM TEAM;")
        res.json({
            success:true,
            data:{
                coaches: coachRows
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const getCoach = async(req,res) =>{
    const {id} = req.params;
    if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
    }
    try {
        const [coachRows] = await db.execute(`SELECT C.*,TEAMID,TEAMNAME FROM COACH C NATURAL JOIN TEAM T WHERE COACHID = ?`,[id]);
        if (coachRows.length === 0) {
        return res.status(404).json({ success: false, error: "Team not found" });
        }
        //const [teamRows] = await db.execute(`SELECT TEAMID,TEAMNAME FROM TEAM NATURAL JOIN PLAYER WHERE PID = ?`,[id]);
        //const [coachRows] = await db.execute(`SELECT COACHID,COACHNAME,ROLE FROM COACH WHERE TEAMID = ?`,[id]);
        res.json({
        success: true,
        data: {
            coaches: coachRows
        }
    });
    } catch (error) {
        console.error("DB Error (coach by id):", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const insertSingleCoach = async (req, res) => {
    try {
        const Coach = req.body;

        // Validate input
        if (!Coach || typeof Coach !== 'object') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input: Expected a Coach object'
            });
        }

        const {
            CoachName,
            TeamID,
            Role,
            ChampionshipsWon,
            WinPercentage,
            Experience
        } = Coach;

        // Validate required fields and constraints
        if (!CoachName) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: CoachName is required'
            });
        }

        if (isNaN(ChampionshipsWon) || ChampionshipsWon < 0 || 
            isNaN(WinPercentage) || WinPercentage < 0 || 
            isNaN(Experience) || Experience < 0 ) {
            return res.status(400).json({
                status: 'error',
                message: 'Numeric fields must be non-negative numbers'
            });
        }

        if (!['Head', 'Assistant'].includes(Role)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Role: Must be Head or Assistant Coach'
            });
        }
        
        if (isNaN(TeamID) || TeamID < 1 ) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid TEAMID: Must be greater than 0'
            });
        }

        // Construct INSERT query (no PID)
        const query = `
            INSERT INTO Coach (
            CoachName , TeamID , Role , ChampionshipsWon , WinPercentage , Experience
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            CoachName,
            TeamID,
            Role,
            ChampionshipsWon,
            WinPercentage,
            Experience
        ];

        // Execute query
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(500).json({
                status: 'error',
                message: 'Coach insertion failed, possibly due to database constraints'
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Coach inserted successfully',
            data: { insertedPID: result.insertId }
        });

    } catch (error) {
        console.error('Error inserting Coach:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to insert Coach',
            error: error.message
        });
    }
};

const deleteCoach = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate PID
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid CoachID: Must be a positive number'
            });
        }

        // Check if player exists
        const checkQuery = `SELECT CoachID FROM Coach WHERE CoachID = ?`;
        const [players] = await db.query(checkQuery, [id]);

        if (players.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Coach with CoachID ${id} not found`
            });
        }

        // Delete player
        const deleteQuery = `DELETE FROM Coach WHERE CoachID = ?`;
        const [result] = await db.query(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete Coach'
            });
        }

        res.json({
            status: 'success',
            message: `Coach with CoachID ${id} deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting Coach:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete Coach',
            error: error.message
        });
    }
};

const updateCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;

        // Validate CoachID
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid CoachID: Must be a positive number'
            });
        }

        // Validate input
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input: Expected a coach object'
            });
        }

        // Fetch existing coach
        const checkQuery = `
            SELECT CoachID, CoachName, TeamID, Role, ChampionshipsWon, WinPercentage, Experience
            FROM Coach
            WHERE CoachID = ?
        `;
        const [coaches] = await db.query(checkQuery, [id]);

        if (coaches.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Coach with CoachID ${id} not found`
            });
        }

        const existingCoach = coaches[0];

        // Compare and collect fields to update
        const fieldsToUpdate = {};
        if (newData.CoachName && newData.CoachName.trim() !== existingCoach.CoachName) {
            if (typeof newData.CoachName !== 'string' || newData.CoachName.trim().length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid CoachName: Must be a non-empty string'
                });
            }
            fieldsToUpdate.CoachName = newData.CoachName.trim();
        }
        if (newData.TeamID !== undefined && newData.TeamID !== existingCoach.TeamID) {
            if (newData.TeamID !== null && (isNaN(newData.TeamID) || newData.TeamID < 1)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid TeamID: Must be a positive number or null'
                });
            }
            fieldsToUpdate.TeamID = newData.TeamID;
        }
        if (newData.Role && newData.Role !== existingCoach.Role) {
            if (!['Head', 'Assistant'].includes(newData.Role)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid Role: Must be Head or Assistant'
                });
            }
            fieldsToUpdate.Role = newData.Role;
        }
        if (newData.ChampionshipsWon !== undefined && newData.ChampionshipsWon !== existingCoach.ChampionshipsWon) {
            if (!Number.isInteger(newData.ChampionshipsWon) || newData.ChampionshipsWon < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid ChampionshipsWon: Must be a non-negative integer'
                });
            }
            fieldsToUpdate.ChampionshipsWon = newData.ChampionshipsWon;
        }
        if (newData.WinPercentage !== undefined && newData.WinPercentage !== existingCoach.WinPercentage) {
            if (newData.WinPercentage !== null && (isNaN(newData.WinPercentage) || newData.WinPercentage < 0 || newData.WinPercentage > 100)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid WinPercentage: Must be a number between 0 and 100 or null'
                });
            }
            fieldsToUpdate.WinPercentage = newData.WinPercentage === null ? null : parseFloat(newData.WinPercentage.toFixed(2));
        }
        if (newData.Experience !== undefined && newData.Experience !== existingCoach.Experience) {
            if (newData.Experience !== null && (!Number.isInteger(newData.Experience) || newData.Experience < 0)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid Experience: Must be a non-negative integer or null'
                });
            }
            fieldsToUpdate.Experience = newData.Experience;
        }

        // If no fields to update, return early
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No changes detected',
                data: existingCoach
            });
        }

        // Build dynamic UPDATE query
        const setClause = Object.keys(fieldsToUpdate)
            .map(field => `${field} = ?`)
            .join(', ');
        const values = [...Object.values(fieldsToUpdate), id];
        const updateQuery = `UPDATE Coach SET ${setClause} WHERE CoachID = ?`;

        // Execute update
        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update coach'
            });
        }

        res.json({
            status: 'success',
            message: `Coach with CoachID ${id} updated successfully`,
            data: { CoachID: parseInt(id), ...fieldsToUpdate }
        });
    } catch (error) {
        console.error('Error updating coach:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid TeamID: Team does not exist',
                error: error.message
            });
        }
        if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            return res.status(400).json({
                status: 'error',
                message: 'Check constraint violated (e.g., invalid Role or WinPercentage)',
                error: error.message
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to update coach',
            error: error.message
        });
    }
};

module.exports = {getAllCoaches,
                  getCoach,
                  insertSingleCoach,
                  deleteCoach,
                  updateCoach
                };