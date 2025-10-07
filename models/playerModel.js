const db = require('../config/db');

async function createPlayerTable(){
    try {
        const createQuery = `
            CREATE TABLE IF NOT EXISTS PLAYER (
                PID INT PRIMARY KEY AUTO_INCREMENT,
                PName VARCHAR(50) NOT NULL,
                TEAMID INT,
                DOB DATE NOT NULL ,
                isSelected BOOLEAN DEFAULT FALSE,
                Role VARCHAR(20) CHECK (ROLE IN ('Batsman','Bowler','Allrounder')),
                RunsScored INT DEFAULT 0 CHECK(RunsScored >= 0),
                WicketsTaken INT DEFAULT 0 CHECK(WicketsTaken >= 0),
                BallsFaced INT DEFAULT 0 CHECK(BallsFaced >= 0),
                RunsGiven INT DEFAULT 0 CHECK(RunsGiven >= 0),
                HighestScore INT DEFAULT 0 CHECK(HighestScore >= 0),
                BestBowlingFigure VARCHAR(10),
                FOREIGN KEY (TEAMID) REFERENCES Team(TeamID) ON DELETE SET NULL
            );
        `;
        await db.execute(createQuery);
        console.log("Table created successfully!");

        const [rows] = await db.execute("SELECT COUNT(*) as count FROM player;");
        if(rows[0].count === 0){
            console.log("Empty!!");
            
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {createPlayerTable};