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

module.exports = {getAllTeams,getTeam,getPointsTable};