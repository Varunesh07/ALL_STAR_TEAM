const db = require('../config/db');

const getAllPlayers = async(req,res) =>{
    try {
        const [playerRows] = await db.execute("SELECT PID,PNAME,ROLE,TEAMID,Isselected,TeamName FROM PLAYER NATURAL JOIN TEAM;");
        //const [teamRows] = await db.execute("SELECT TEAMID,TEAMNAME FROM TEAM;")
        res.json({
            success:true,
            data:{
                players:playerRows
                //,team:teamRows
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const getPlayer = async(req,res) =>{
    const {id} = req.params;
    if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, error: "Valid numeric id required" });
    }
    try {
        const [playerRows] = await db.execute(`SELECT P.*,TEAMID,TEAMNAME FROM PLAYER P NATURAL JOIN TEAM WHERE PID = ?`,[id]);
        if (playerRows.length === 0) {
        return res.status(404).json({ success: false, error: "Team not found" });
        }
        //const [teamRows] = await db.execute(`SELECT TEAMID,TEAMNAME FROM TEAM NATURAL JOIN PLAYER WHERE PID = ?`,[id]);
        //const [coachRows] = await db.execute(`SELECT COACHID,COACHNAME,ROLE FROM COACH WHERE TEAMID = ?`,[id]);
        res.json({
        success: true,
        data: {
            player: playerRows
            //,team: teamRows
        }
    });
    } catch (error) {
        console.error("DB Error (player by id):", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const orangeCap = async(req,res)=>{
    try {
        const [playerRows] = await db.execute(`SELECT PID,PNAME,TEAMID,TEAMNAME,ROLE,RUNSSCORED FROM TEAM NATURAL JOIN PLAYER ORDER BY RUNSSCORED DESC LIMIT 10`);
        res.json({
            success:true,
            count:playerRows.length,
            data:playerRows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const purpleCap = async(req,res)=>{
    try {
        const [playerRows] = await db.execute(`SELECT PID,PNAME,TEAMID,TEAMNAME,ROLE,WICKETSTAKEN FROM TEAM NATURAL JOIN PLAYER ORDER BY WICKETSTAKEN DESC LIMIT 10`);
        res.json({
            success:true,
            count:playerRows.length,
            data:playerRows
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, error: error.message
        })
    }
}

const insertSinglePlayer = async (req, res) => {
    try {
        const player = req.body;

        // Validate input
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

        // Validate required fields and constraints
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
        if (isNaN(TEAMID) || TEAMID < 1 ) {
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

        // Construct INSERT query (no PID)
        const query = `
            INSERT INTO player (
                PName, TEAMID, DOB, isSelected, Role,
                RunsScored, WicketsTaken, BallsFaced, RunsGiven,
                HighestScore, BestBowlingFigure
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            PName,
            TEAMID,
            DOB,
            isSelected,
            Role,
            RunsScored,
            WicketsTaken,
            BallsFaced,
            RunsGiven,
            HighestScore,
            BestBowlingFigure
        ];

        // Execute query
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(500).json({
                status: 'error',
                message: 'Player insertion failed, possibly due to database constraints'
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

        // Validate PID
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid PID: Must be a positive number'
            });
        }

        // Check if player exists
        const checkQuery = `SELECT PID FROM player WHERE PID = ?`;
        const [players] = await db.query(checkQuery, [id]);

        if (players.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Player with PID ${id} not found`
            });
        }

        // Delete player
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

const updateplayer = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;

        // Validate playerID
        if (isNaN(id) || id < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid playerID: Must be a positive number'
            });
        }

        // Validate input
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input: Expected a player object'
            });
        }

        // Fetch existing player
        const checkQuery = `SELECT pID, playerName, MatchesWon, MatchesLost, Champions, NRR FROM player WHERE playerID = ?`;
        const [players] = await db.query(checkQuery, [id]);

        if (players.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `player with playerID ${id} not found`
            });
        }

        const existingplayer = players[0];

        // Compare and collect fields to update
        const fieldsToUpdate = {};
        if (newData.playerName && newData.playerName.trim() !== existingplayer.playerName) {
            if (typeof newData.playerName !== 'string' || newData.playerName.trim().length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid playerName: Must be a non-empty string'
                });
            }
            fieldsToUpdate.playerName = newData.playerName.trim();
        }
        if (newData.MatchesWon !== undefined && newData.MatchesWon !== existingplayer.MatchesWon) {
            if (!Number.isInteger(newData.MatchesWon) || newData.MatchesWon < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid MatchesWon: Must be a non-negative integer'
                });
            }
            fieldsToUpdate.MatchesWon = newData.MatchesWon;
        }
        if (newData.MatchesLost !== undefined && newData.MatchesLost !== existingplayer.MatchesLost) {
            if (!Number.isInteger(newData.MatchesLost) || newData.MatchesLost < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid MatchesLost: Must be a non-negative integer'
                });
            }
            fieldsToUpdate.MatchesLost = newData.MatchesLost;
        }
        if (newData.Champions !== undefined && newData.Champions !== existingplayer.Champions) {
            if (!Number.isInteger(newData.Champions) || newData.Champions < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid Champions: Must be a non-negative integer'
                });
            }
            fieldsToUpdate.Champions = newData.Champions;
        }
        if (newData.NRR !== undefined && newData.NRR !== existingplayer.NRR) {
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
                data: existingplayer
            });
        }

        // Build dynamic UPDATE query
        const setClause = Object.keys(fieldsToUpdate)
            .map(field => `${field} = ?`)
            .join(', ');
        const values = [...Object.values(fieldsToUpdate), id];
        const updateQuery = `UPDATE player SET ${setClause} WHERE playerID = ?`;

        // Execute update
        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update player'
            });
        }

        res.json({
            status: 'success',
            message: `player with playerID ${id} updated successfully`,
            data: { playerID: parseInt(id), ...fieldsToUpdate }
        });
    } catch (error) {
        console.error('Error updating player:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'playerName already exists',
                error: error.message
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to update player',
            error: error.message
        });
    }
};


module.exports = {getAllPlayers,getPlayer,orangeCap,purpleCap,insertSinglePlayer,deletePlayer};