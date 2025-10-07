const db = require('../config/db')

async function createTableCoach(){
    try {
        const createQuery = `
        CREATE TABLE IF NOT EXISTS Coach (
            CoachID INT PRIMARY KEY AUTO_INCREMENT,
            CoachName VARCHAR(50) NOT NULL,
            TeamID INT,
            Role VARCHAR(20) CHECK (Role in ('Head', 'Assistant')) DEFAULT 'Assistant',
            ChampionshipsWon INT DEFAULT 0,
            WinPercentage DECIMAL(5,2) CHECK (WinPercentage >= 0 AND WinPercentage <= 100),
            Experience INT CHECK (Experience >= 0),
            FOREIGN KEY (TeamID) REFERENCES Team(TeamID) ON DELETE CASCADE
        );
    `;
    await db.execute(createQuery);
    console.log("Table created successfully!");

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM Coach;");
    if(rows[0].count === 0){
        console.log("Empty!!");
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createTableCoach};