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

module.exports = {getAllCoaches,getCoach};