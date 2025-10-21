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

module.exports = {getAllPlayers,getPlayer,orangeCap,purpleCap};