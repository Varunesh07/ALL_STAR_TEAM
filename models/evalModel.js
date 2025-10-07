const db = require('../config/db')

async function createTableEval(){
    try {
        const createQuery = `
        CREATE TABLE IF NOT EXISTS Evaluation (
            EvalID INT PRIMARY KEY AUTO_INCREMENT,
            CoachID INT,
            PlayerID INT,
            EvalScore DECIMAL(4,2) CHECK (EvalScore >= 0 AND EvalScore <= 10),
            FOREIGN KEY (CoachID) REFERENCES Coach(CoachID) ON DELETE CASCADE,
            FOREIGN KEY (PlayerID) REFERENCES Player(PID) ON DELETE CASCADE
        );
    `;
    await db.execute(createQuery);
    console.log("Table created successfully!");

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM Evaluation;");
    if(rows[0].count === 0){
        console.log("Empty!!");
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createTableEval};