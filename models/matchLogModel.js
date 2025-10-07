const db = require('../config/db')

async function createMatchLog(){
    try {
        const createQuery = `
        CREATE TABLE IF NOT EXISTS MatchLog (
            MatchID INT PRIMARY KEY AUTO_INCREMENT,
            Team1ID INT NOT NULL,
            Team2ID INT NOT NULL,
            Venue VARCHAR(100) NOT NULL,
            MatchDate DATE NOT NULL,
            Team1Score VARCHAR(7) DEFAULT '0-0',
            Team2Score VARCHAR(7) DEFAULT '0-0',
            PlayerID INT,
            FOREIGN KEY (Team1ID) REFERENCES Team(TeamID) ON DELETE CASCADE,
            FOREIGN KEY (Team2ID) REFERENCES Team(TeamID) ON DELETE CASCADE,
            FOREIGN KEY (PlayerID) REFERENCES Player(PID) ON DELETE SET NULL
        );
    `;
    await db.execute(createQuery);
    console.log("Table created successfully!");

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM MatchLog;");
    if(rows[0].count === 0){
        console.log("Empty!!");
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createMatchLog};