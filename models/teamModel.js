const db = require('../config/db')

async function createTableTeam(){
    try {
        const createQuery = `
        CREATE TABLE IF NOT EXISTS TEAM
        (
            TeamID INT AUTO_INCREMENT PRIMARY KEY,
            TeamName VARCHAR(50) NOT NULL UNIQUE,
            MatchesWon INT Default 0 CHECK(MatchesWon >= 0),
            MatchesLost INT Default 0 CHECK(MatchesLost >= 0),
            Champions INT Default 0 CHECK(Champions >= 0),
            NRR DECIMAL(5,2) DEFAULT 0.00 
        );
    `;
    await db.execute(createQuery);
    console.log("Table created successfully!");

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM TEAM;");
    if(rows[0].count === 0){
        console.log("Empty!!");
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createTableTeam};