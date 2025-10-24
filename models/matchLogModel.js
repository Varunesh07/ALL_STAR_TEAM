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
        console.log("Empty!! Match data not available");
        const insertQuery = `
        INSERT INTO MatchLog (Team1ID, Team2ID, Venue, MatchDate, Team1Score, Team2Score, PlayerID) VALUES
    -- Match 1-2: Mumbai Mavericks (8W-6L) vs Chennai Chargers (9W-5L)
    (1, 2, 'Wankhede Stadium, Mumbai', '2025-04-01', '180-6', '175-8', 1), -- Mumbai wins, Rohit Sharma
    (2, 1, 'MA Chidambaram Stadium, Chennai', '2025-04-15', '190-5', '170-7', 13), -- Chennai wins, Ruturaj Gaikwad

    -- Match 3-4: Mumbai Mavericks vs Delhi Dynamos (7W-7L)
    (1, 3, 'Wankhede Stadium, Mumbai', '2025-04-03', '195-4', '160-8', 8), -- Mumbai wins, Jasprit Bumrah
    (3, 1, 'Arun Jaitley Stadium, Delhi', '2025-04-17', '185-6', '180-7', 34), -- Delhi wins, Rishabh Pant

    -- Match 5-6: Mumbai Mavericks vs Kolkata Knights (10W-4L)
    (1, 4, 'Wankhede Stadium, Mumbai', '2025-04-05', '170-7', '175-5', 27), -- Kolkata wins, Andre Russell
    (4, 1, 'Eden Gardens, Kolkata', '2025-04-19', '200-4', '180-6', 28), -- Kolkata wins, Sunil Narine

    -- Match 7-8: Mumbai Mavericks vs Rajasthan Royals (6W-8L)
    (1, 5, 'Wankhede Stadium, Mumbai', '2025-04-07', '190-5', '165-9', 1), -- Mumbai wins, Rohit Sharma
    (5, 1, 'Sawai Mansingh Stadium, Jaipur', '2025-04-21', '175-6', '180-5', 2), -- Mumbai wins, Suryakumar Yadav

    -- Match 9-10: Mumbai Mavericks vs Punjab Panthers (5W-9L)
    (1, 6, 'Wankhede Stadium, Mumbai', '2025-04-09', '185-6', '160-8', 7), -- Mumbai wins, Hardik Pandya
    (6, 1, 'PCA Stadium, Mohali', '2025-04-23', '170-7', '175-6', 1), -- Mumbai wins, Rohit Sharma

    -- Match 11-12: Mumbai Mavericks vs Bangalore Blasters (7W-7L)
    (1, 7, 'Wankhede Stadium, Mumbai', '2025-04-11', '180-6', '175-7', 1), -- Mumbai wins, Rohit Sharma
    (7, 1, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-25', '195-5', '190-6', 67), -- Bangalore wins, Virat Kohli

    -- Match 13-14: Mumbai Mavericks vs Hyderabad Hawks (8W-6L)
    (1, 8, 'Wankhede Stadium, Mumbai', '2025-04-13', '170-8', '175-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar
    (8, 1, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-27', '190-5', '185-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 15-16: Mumbai Mavericks vs Lucknow Lions (9W-5L)
    (1, 9, 'Wankhede Stadium, Mumbai', '2025-04-14', '175-7', '180-5', 89), -- Lucknow wins, KL Rahul
    (9, 1, 'Ekana Cricket Stadium, Lucknow', '2025-04-29', '185-5', '170-8', 89), -- Lucknow wins, KL Rahul

    -- Match 17-18: Mumbai Mavericks vs Gujarat Giants (10W-4L)
    (1, 10, 'Wankhede Stadium, Mumbai', '2025-04-16', '180-6', '185-4', 100), -- Gujarat wins, Shubman Gill
    (10, 1, 'Narendra Modi Stadium, Ahmedabad', '2025-05-01', '195-4', '175-7', 100), -- Gujarat wins, Shubman Gill

    -- Match 19-20: Chennai Chargers vs Delhi Dynamos
    (2, 3, 'MA Chidambaram Stadium, Chennai', '2025-04-02', '190-5', '170-8', 13), -- Chennai wins, Ruturaj Gaikwad
    (3, 2, 'Arun Jaitley Stadium, Delhi', '2025-04-18', '175-7', '180-6', 18), -- Chennai wins, Ravindra Jadeja

    -- Match 21-22: Chennai Chargers vs Kolkata Knights
    (2, 4, 'MA Chidambaram Stadium, Chennai', '2025-04-04', '185-5', '180-6', 13), -- Chennai wins, Ruturaj Gaikwad
    (4, 2, 'Eden Gardens, Kolkata', '2025-04-20', '195-4', '170-8', 27), -- Kolkata wins, Andre Russell

    -- Match 23-24: Chennai Chargers vs Rajasthan Royals
    (2, 5, 'MA Chidambaram Stadium, Chennai', '2025-04-06', '200-4', '175-7', 13), -- Chennai wins, Ruturaj Gaikwad
    (5, 2, 'Sawai Mansingh Stadium, Jaipur', '2025-04-22', '170-8', '175-6', 13), -- Chennai wins, Ruturaj Gaikwad

    -- Match 25-26: Chennai Chargers vs Punjab Panthers
    (2, 6, 'MA Chidambaram Stadium, Chennai', '2025-04-08', '190-5', '160-9', 18), -- Chennai wins, Ravindra Jadeja
    (6, 2, 'PCA Stadium, Mohali', '2025-04-24', '165-8', '170-6', 13), -- Chennai wins, Ruturaj Gaikwad

    -- Match 27-28: Chennai Chargers vs Bangalore Blasters
    (2, 7, 'MA Chidambaram Stadium, Chennai', '2025-04-10', '185-6', '180-7', 13), -- Chennai wins, Ruturaj Gaikwad
    (7, 2, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-26', '190-5', '185-6', 67), -- Bangalore wins, Virat Kohli

    -- Match 29-30: Chennai Chargers vs Hyderabad Hawks
    (2, 8, 'MA Chidambaram Stadium, Chennai', '2025-04-12', '175-7', '180-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar
    (8, 2, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-28', '190-5', '185-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 31-32: Chennai Chargers vs Lucknow Lions
    (2, 9, 'MA Chidambaram Stadium, Chennai', '2025-04-14', '180-6', '185-5', 89), -- Lucknow wins, KL Rahul
    (9, 2, 'Ekana Cricket Stadium, Lucknow', '2025-04-30', '190-4', '175-7', 89), -- Lucknow wins, KL Rahul

    -- Match 33-34: Chennai Chargers vs Gujarat Giants
    (2, 10, 'MA Chidambaram Stadium, Chennai', '2025-04-16', '170-8', '175-6', 100), -- Gujarat wins, Shubman Gill
    (10, 2, 'Narendra Modi Stadium, Ahmedabad', '2025-05-02', '195-4', '180-7', 100), -- Gujarat wins, Shubman Gill

    -- Match 35-36: Delhi Dynamos vs Kolkata Knights
    (3, 4, 'Arun Jaitley Stadium, Delhi', '2025-04-01', '165-8', '170-6', 27), -- Kolkata wins, Andre Russell
    (4, 3, 'Eden Gardens, Kolkata', '2025-04-15', '185-5', '160-8', 28), -- Kolkata wins, Sunil Narine

    -- Match 37-38: Delhi Dynamos vs Rajasthan Royals
    (3, 5, 'Arun Jaitley Stadium, Delhi', '2025-04-03', '180-6', '175-7', 34), -- Delhi wins, Rishabh Pant
    (5, 3, 'Sawai Mansingh Stadium, Jaipur', '2025-04-17', '170-8', '175-6', 34), -- Delhi wins, Rishabh Pant

    -- Match 39-40: Delhi Dynamos vs Punjab Panthers
    (3, 6, 'Arun Jaitley Stadium, Delhi', '2025-04-05', '190-5', '165-9', 34), -- Delhi wins, Rishabh Pant
    (6, 3, 'PCA Stadium, Mohali', '2025-04-19', '170-7', '175-6', 34), -- Delhi wins, Rishabh Pant

    -- Match 41-42: Delhi Dynamos vs Bangalore Blasters
    (3, 7, 'Arun Jaitley Stadium, Delhi', '2025-04-07', '185-6', '180-7', 34), -- Delhi wins, Rishabh Pant
    (7, 3, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-21', '190-5', '185-6', 67), -- Bangalore wins, Virat Kohli

    -- Match 43-44: Delhi Dynamos vs Hyderabad Hawks
    (3, 8, 'Arun Jaitley Stadium, Delhi', '2025-04-09', '175-7', '180-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar
    (8, 3, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-23', '190-5', '170-8', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 45-46: Delhi Dynamos vs Lucknow Lions
    (3, 9, 'Arun Jaitley Stadium, Delhi', '2025-04-11', '170-8', '175-6', 89), -- Lucknow wins, KL Rahul
    (9, 3, 'Ekana Cricket Stadium, Lucknow', '2025-04-25', '185-5', '180-7', 89), -- Lucknow wins, KL Rahul

    -- Match 47-48: Delhi Dynamos vs Gujarat Giants
    (3, 10, 'Arun Jaitley Stadium, Delhi', '2025-04-13', '165-8', '170-6', 100), -- Gujarat wins, Shubman Gill
    (10, 3, 'Narendra Modi Stadium, Ahmedabad', '2025-04-27', '195-4', '175-7', 100), -- Gujarat wins, Shubman Gill

    -- Match 49-50: Kolkata Knights vs Rajasthan Royals
    (4, 5, 'Eden Gardens, Kolkata', '2025-04-02', '190-5', '165-9', 27), -- Kolkata wins, Andre Russell
    (5, 4, 'Sawai Mansingh Stadium, Jaipur', '2025-04-16', '170-7', '175-6', 27), -- Kolkata wins, Andre Russell

    -- Match 51-52: Kolkata Knights vs Punjab Panthers
    (4, 6, 'Eden Gardens, Kolkata', '2025-04-04', '185-5', '160-8', 28), -- Kolkata wins, Sunil Narine
    (6, 4, 'PCA Stadium, Mohali', '2025-04-18', '165-9', '170-6', 27), -- Kolkata wins, Andre Russell

    -- Match 53-54: Kolkata Knights vs Bangalore Blasters
    (4, 7, 'Eden Gardens, Kolkata', '2025-04-06', '195-4', '180-7', 27), -- Kolkata wins, Andre Russell
    (7, 4, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-20', '190-5', '185-6', 67), -- Bangalore wins, Virat Kohli

    -- Match 55-56: Kolkata Knights vs Hyderabad Hawks
    (4, 8, 'Eden Gardens, Kolkata', '2025-04-08', '180-6', '175-7', 27), -- Kolkata wins, Andre Russell
    (8, 4, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-22', '190-5', '185-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 57-58: Kolkata Knights vs Lucknow Lions
    (4, 9, 'Eden Gardens, Kolkata', '2025-04-10', '175-7', '180-6', 89), -- Lucknow wins, KL Rahul
    (9, 4, 'Ekana Cricket Stadium, Lucknow', '2025-04-24', '190-5', '170-8', 89), -- Lucknow wins, KL Rahul

    -- Match 59-60: Kolkata Knights vs Gujarat Giants
    (4, 10, 'Eden Gardens, Kolkata', '2025-04-12', '185-5', '180-6', 27), -- Kolkata wins, Andre Russell
    (10, 4, 'Narendra Modi Stadium, Ahmedabad', '2025-04-26', '195-4', '175-7', 100), -- Gujarat wins, Shubman Gill

    -- Match 61-62: Rajasthan Royals vs Punjab Panthers
    (5, 6, 'Sawai Mansingh Stadium, Jaipur', '2025-04-01', '190-5', '165-9', 46), -- Rajasthan wins, Jos Buttler
    (6, 5, 'PCA Stadium, Mohali', '2025-04-15', '170-7', '175-6', 46), -- Rajasthan wins, Jos Buttler

    -- Match 63-64: Rajasthan Royals vs Bangalore Blasters
    (5, 7, 'Sawai Mansingh Stadium, Jaipur', '2025-04-03', '180-6', '185-5', 67), -- Bangalore wins, Virat Kohli
    (7, 5, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-17', '190-5', '170-8', 67), -- Bangalore wins, Virat Kohli

    -- Match 65-66: Rajasthan Royals vs Hyderabad Hawks
    (5, 8, 'Sawai Mansingh Stadium, Jaipur', '2025-04-05', '175-7', '180-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar
    (8, 5, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-19', '190-5', '165-9', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 67-68: Rajasthan Royals vs Lucknow Lions
    (5, 9, 'Sawai Mansingh Stadium, Jaipur', '2025-04-07', '170-8', '175-6', 89), -- Lucknow wins, KL Rahul
    (9, 5, 'Ekana Cricket Stadium, Lucknow', '2025-04-21', '190-5', '170-7', 89), -- Lucknow wins, KL Rahul

    -- Match 69-70: Rajasthan Royals vs Gujarat Giants
    (5, 10, 'Sawai Mansingh Stadium, Jaipur', '2025-04-09', '165-8', '170-6', 100), -- Gujarat wins, Shubman Gill
    (10, 5, 'Narendra Modi Stadium, Ahmedabad', '2025-04-23', '195-4', '175-7', 100), -- Gujarat wins, Shubman Gill

    -- Match 71-72: Punjab Panthers vs Bangalore Blasters
    (6, 7, 'PCA Stadium, Mohali', '2025-04-02', '170-7', '175-6', 67), -- Bangalore wins, Virat Kohli
    (7, 6, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-16', '190-5', '165-9', 67), -- Bangalore wins, Virat Kohli

    -- Match 73-74: Punjab Panthers vs Hyderabad Hawks
    (6, 8, 'PCA Stadium, Mohali', '2025-04-04', '165-8', '170-6', 84), -- Hyderabad wins, Bhuvneshwar Kumar
    (8, 6, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-18', '190-5', '160-9', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 75-76: Punjab Panthers vs Lucknow Lions
    (6, 9, 'PCA Stadium, Mohali', '2025-04-06', '170-7', '175-6', 89), -- Lucknow wins, KL Rahul
    (9, 6, 'Ekana Cricket Stadium, Lucknow', '2025-04-20', '190-5', '165-8', 89), -- Lucknow wins, KL Rahul

    -- Match 77-78: Punjab Panthers vs Gujarat Giants
    (6, 10, 'PCA Stadium, Mohali', '2025-04-08', '165-9', '170-6', 100), -- Gujarat wins, Shubman Gill
    (10, 6, 'Narendra Modi Stadium, Ahmedabad', '2025-04-22', '195-4', '160-8', 100), -- Gujarat wins, Shubman Gill

    -- Match 79-80: Bangalore Blasters vs Hyderabad Hawks
    (7, 8, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-01', '190-5', '185-6', 67), -- Bangalore wins, Virat Kohli
    (8, 7, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-15', '180-6', '175-7', 84), -- Hyderabad wins, Bhuvneshwar Kumar

    -- Match 81-82: Bangalore Blasters vs Lucknow Lions
    (7, 9, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-03', '185-6', '190-5', 89), -- Lucknow wins, KL Rahul
    (9, 7, 'Ekana Cricket Stadium, Lucknow', '2025-04-17', '175-7', '180-6', 67), -- Bangalore wins, Virat Kohli

    -- Match 83-84: Bangalore Blasters vs Gujarat Giants
    (7, 10, 'M. Chinnaswamy Stadium, Bangalore', '2025-04-05', '170-7', '175-6', 100), -- Gujarat wins, Shubman Gill
    (10, 7, 'Narendra Modi Stadium, Ahmedabad', '2025-04-19', '195-4', '180-7', 100), -- Gujarat wins, Shubman Gill

    -- Match 85-86: Hyderabad Hawks vs Lucknow Lions
    (8, 9, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-02', '180-6', '175-7', 84), -- Hyderabad wins, Bhuvneshwar Kumar
    (9, 8, 'Ekana Cricket Stadium, Lucknow', '2025-04-16', '190-5', '170-8', 89), -- Lucknow wins, KL Rahul

    -- Match 87-88: Hyderabad Hawks vs Gujarat Giants
    (8, 10, 'Rajiv Gandhi Stadium, Hyderabad', '2025-04-04', '175-7', '180-6', 100), -- Gujarat wins, Shubman Gill
    (10, 8, 'Narendra Modi Stadium, Ahmedabad', '2025-04-18', '195-4', '170-8', 100), -- Gujarat wins, Shubman Gill

    -- Match 89-90: Lucknow Lions vs Gujarat Giants
    (9, 10, 'Ekana Cricket Stadium, Lucknow', '2025-04-06', '190-5', '185-6', 89), -- Lucknow wins, KL Rahul
    (10, 9, 'Narendra Modi Stadium, Ahmedabad', '2025-04-20', '195-4', '180-7', 100); -- Gujarat wins, Shubman Gill
        `;
    await db.execute(insertQuery);
    console.log('Default match log data inserted successfully!');
    }else{
        console.log('Datas of matches are already present!!');
    }
    
    
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createMatchLog};