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
        console.log("Empty!! Coach data is going to be inserted");
        const insertQuery = `INSERT INTO Coach (CoachName, TeamID, Role, ChampionshipsWon, WinPercentage, Experience) VALUES
    -- Team 1: Mumbai Mavericks (8 wins, 6 losses, 5 championships, NRR 0.21)
    ('Ricky Ponting', 1, 'Head', 5, 57.14, 15),
    ('Shane Bond', 1, 'Assistant', 2, 55.00, 10),

    -- Team 2: Chennai Chargers (9 wins, 5 losses, 4 championships, NRR 0.35)
    ('Stephen Fleming', 2, 'Head', 4, 64.29, 18),
    ('Eric Simons', 2, 'Assistant', 3, 60.00, 12),

    -- Team 3: Delhi Dynamos (7 wins, 7 losses, 0 championships, NRR -0.15)
    ('Greg Shipperd', 3, 'Head', 0, 50.00, 14),
    ('Sharad Pawar', 3, 'Assistant', 0, 48.00, 8),

    -- Team 4: Kolkata Knights (10 wins, 4 losses, 3 championships, NRR 0.48)
    ('Jacques Kallis', 4, 'Head', 3, 71.43, 16),
    ('Bharat Arun', 4, 'Assistant', 2, 68.00, 9),

    -- Team 5: Rajasthan Royals (6 wins, 8 losses, 1 championship, NRR -0.25)
    ('Kumar Sangakkara', 5, 'Head', 1, 42.86, 13),
    ('Trevor Bayliss', 5, 'Assistant', 1, 40.00, 10),

    -- Team 6: Punjab Panthers (5 wins, 9 losses, 0 championships, NRR -0.30)
    ('Anil Kumble', 6, 'Head', 0, 35.71, 15),
    ('Wasim Jaffer', 6, 'Assistant', 0, 33.00, 7),

    -- Team 7: Bangalore Blasters (7 wins, 7 losses, 0 championships, NRR 0.05)
    ('Andy Flower', 7, 'Head', 0, 50.00, 17),
    ('Adam Griffith', 7, 'Assistant', 0, 48.00, 9),

    -- Team 8: Hyderabad Hawks (8 wins, 6 losses, 2 championships, NRR 0.12)
    ('Tom Moody', 8, 'Head', 2, 57.14, 14),
    ('Muttiah Muralitharan', 8, 'Assistant', 1, 55.00, 11),

    -- Team 9: Lucknow Lions (9 wins, 5 losses, 0 championships, NRR 0.40)
    ('Justin Langer', 9, 'Head', 0, 64.29, 12),
    ('Jonty Rhodes', 9, 'Assistant', 0, 62.00, 10),

    -- Team 10: Gujarat Giants (10 wins, 4 losses, 1 championship, NRR 0.52)
    ('Gary Kirsten', 10, 'Head', 1, 71.43, 16),
    ('Ashish Nehra', 10, 'Assistant', 1, 68.00, 8),
    
     -- Team 1: Mumbai Mavericks
    ('Mahela Jayawardene', 1, 'Assistant', 2, 56.00, 12),
    -- Team 2: Chennai Chargers
    ('Michael Hussey', 2, 'Assistant', 3, 62.00, 10),
    -- Team 3: Delhi Dynamos
    ('Mohammad Kaif', 3, 'Assistant', 0, 47.00, 7),
    -- Team 4: Kolkata Knights
    ('Simon Katich', 4, 'Assistant', 2, 67.00, 9),
    -- Team 5: Rajasthan Royals
    ('Shane Warne', 5, 'Assistant', 1, 41.00, 11),
    -- Team 6: Punjab Panthers
    ('Yuvraj Singh', 6, 'Assistant', 0, 34.00, 6),
    -- Team 7: Bangalore Blasters
    ('Ray Jennings', 7, 'Assistant', 0, 49.00, 8),
    -- Team 8: Hyderabad Hawks
    ('VVS Laxman', 8, 'Assistant', 1, 56.00, 9),
    -- Team 9: Lucknow Lions
    ('Gautam Gambhir', 9, 'Assistant', 0, 63.00, 8),
    -- Team 10: Gujarat Giants
    ('Heath Streak', 10, 'Assistant', 1, 69.00, 7);
    ;`;
    await db.execute(insertQuery);
    console.log("✅ Default coach data inserted successfully!"); 
        
    }else{
        console.log('Data of coach already present!!');
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createTableCoach};