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
        console.log("Empty!! inserting datas of the teams!!");
        const insertQuery = `
                INSERT INTO TEAM (TeamName, MatchesWon, MatchesLost, Champions, NRR) VALUES
                ('Mumbai Mavericks', 8, 6, 5, 0.21),
                ('Chennai Chargers', 9, 5, 4, 0.35),
                ('Delhi Dynamos', 7, 7, 0, -0.15),
                ('Kolkata Knights', 10, 4, 3, 0.48),
                ('Rajasthan Royals', 6, 8, 1, -0.25),
                ('Punjab Panthers', 5, 9, 0, -0.30),
                ('Bangalore Blasters', 7, 7, 0, 0.05),
                ('Hyderabad Hawks', 8, 6, 2, 0.12),
                ('Lucknow Lions', 9, 5, 0, 0.40),
                ('Gujarat Giants', 10, 4, 1, 0.52);
            `;
            await db.execute(insertQuery);
            console.log("✅ Default team data inserted successfully!");
    }else{
        console.log("Datas are already inserted!!");
    }
            
    } catch (error) {
        console.log("Error creating insertion/creation of the team table ",error);
    }
}

module.exports = {createTableTeam};