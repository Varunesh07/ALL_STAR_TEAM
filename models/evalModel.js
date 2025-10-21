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
        console.log("Empty!! Eval data not available");
        const insertQuery = `
        INSERT INTO Evaluation (CoachID, PlayerID, EvalScore) VALUES
    -- Team 1: Mumbai Mavericks (CoachID 1: Ricky Ponting, 2: Shane Bond)
    (1, 1, 9.20), (2, 1, 9.10), (21, 1, 9.30),-- Rohit Sharma (high runs, captain)
    (1, 2, 8.80), (2, 2, 8.70), (21, 2, 8.54),-- Suryakumar Yadav (high runs)
    (1, 3, 8.50), (2, 3, 8.40), (21, 3, 8.22),-- Ishan Kishan (wicketkeeper, batsman)
    (1, 4, 7.90), (2, 4, 7.80), (21, 4, 7.55),-- Tilak Varma
    (1, 5, 7.50), (2, 5, 7.40), (21, 5, 9.30),-- Tim David
    (1, 6, 8.20), (2, 6, 8.10), (21, 6, 8.30),-- Cameron Green (allrounder)
    (1, 7, 8.70), (2, 7, 8.60), (21, 7, 8.30),-- Hardik Pandya (allrounder, high runs)
    (1, 8, 9.30), (2, 8, 9.20), (21, 8, 9.30),-- Jasprit Bumrah (top bowler)
    (1, 9, 8.40), (2, 9, 8.30), (21, 9, 8.30),-- Piyush Chawla
    (1, 10, 7.60), (2, 10, 7.50), (21, 10, 7.30),-- Jason Behrendorff
    (1, 11, 7.20), (2, 11, 7.10), (21, 11, 7.00),-- Kumar Kartikeya

    -- Team 2: Chennai Chargers (CoachID 3: Stephen Fleming, 4: Eric Simons)
    (3, 12, 9.00), (4, 12, 8.90), (22, 12, 9.30), -- MS Dhoni (wicketkeeper, captain)
    (3, 13, 8.80), (4, 13, 8.70), (22, 13, 8.30), -- Ruturaj Gaikwad (high runs)
    (3, 14, 7.80), (4, 14, 7.70), (22, 14, 7.50), -- Devon Conway
    (3, 15, 8.20), (4, 15, 8.10), -- Ajinkya Rahane
    (3, 16, 7.90), (4, 16, 7.80), -- Moeen Ali
    (3, 17, 7.70), (4, 17, 7.60), -- Shivam Dube
    (3, 18, 9.10), (4, 18, 9.00), (22, 18, 9.30), -- Ravindra Jadeja (allrounder, high wickets)
    (3, 19, 8.30), (4, 19, 8.20), -- Deepak Chahar
    (3, 20, 7.50), (4, 20, 7.40), -- Matheesha Pathirana
    (3, 21, 7.30), (4, 21, 7.20), -- Tushar Deshpande
    (3, 22, 7.90), (4, 22, 7.80), -- Ben Stokes

    -- Team 3: Kolkata Knights (CoachID 5: Greg Shipperd, 6: Sharad Pawar)
    (5, 23, 8.50), (6, 23, 8.40), (23, 23, 8.30), -- Shreyas Iyer (captain)
    (5, 24, 7.80), (6, 24, 7.70), (23, 24, 7.60), -- Rinku Singh
    (5, 25, 7.60), (6, 25, 7.50), (23, 25, 7.30), -- Jason Roy
    (5, 26, 7.90), (6, 26, 7.80), (23, 26, 7.80), -- Nitish Rana
    (5, 27, 8.80), (6, 27, 8.70), (23, 27, 8.80), -- Andre Russell (allrounder, high wickets)
    (5, 28, 8.90), (6, 28, 8.80), (23, 28, 8.90),-- Sunil Narine (allrounder, high wickets)
    (5, 29, 8.00), (6, 29, 7.90), -- Varun Chakravarthy
    (5, 30, 7.40), (6, 30, 7.30), -- Harshit Rana
    (5, 31, 7.20), (6, 31, 7.10), -- Vaibhav Arora
    (5, 32, 7.70), (6, 32, 7.60), -- Venkatesh Iyer
    (5, 33, 7.30), (6, 33, 7.20), -- Litton Das

    -- Team 4: Delhi Dynamos (CoachID 7: Jacques Kallis, 8: Bharat Arun)
    (7, 34, 8.90), (8, 34, 8.80), (24, 34, 8.70), -- Rishabh Pant (wicketkeeper, high runs)
    (7, 35, 8.20), (8, 35, 8.10), (24, 35, 8.30), -- David Warner
    (7, 36, 8.00), (8, 36, 7.90), -- Prithvi Shaw
    (7, 37, 8.50), (8, 37, 8.40), (24, 37, 8.30),-- Axar Patel (allrounder)
    (7, 38, 7.80), (8, 38, 7.70), -- Mitchell Marsh
    (7, 39, 8.70), (8, 39, 8.60), (24, 37, 8.50),-- Kuldeep Yadav (high wickets)
    (7, 40, 7.90), (8, 40, 7.80), -- Khaleel Ahmed
    (7, 41, 7.50), (8, 41, 7.40), -- Anrich Nortje
    (7, 42, 7.30), (8, 42, 7.20), -- Lalit Yadav
    (7, 43, 7.80), (8, 43, 7.70), -- Manish Pandey
    (7, 44, 7.60), (8, 44, 7.50), -- Sarfaraz Khan

    -- Team 5: Rajasthan Royals (CoachID 9: Kumar Sangakkara, 10: Trevor Bayliss)
    (9, 45, 8.80), (10, 45, 8.70), (25, 45, 8.80), -- Sanju Samson (wicketkeeper, high runs)
    (9, 46, 8.50), (10, 46, 8.40), (25, 46, 8.45), -- Jos Buttler
    (9, 47, 8.30), (10, 47, 8.20), -- Yashasvi Jaiswal
    (9, 48, 7.70), (10, 48, 7.60), -- Devdutt Padikkal
    (9, 49, 7.50), (10, 49, 7.40), -- Shimron Hetmyer
    (9, 50, 7.60), (10, 50, 7.50), -- Riyan Parag
    (9, 51, 8.90), (10, 51, 8.80), (25, 51, 8.80), -- Ravichandran Ashwin (allrounder, high wickets)
    (9, 52, 7.80), (10, 52, 7.70), -- Trent Boult
    (9, 53, 8.60), (10, 53, 8.50), (25, 53, 8.60), -- Yuzvendra Chahal (high wickets)
    (9, 54, 7.40), (10, 54, 7.30), -- Navdeep Saini
    (9, 55, 7.20), (10, 55, 7.10), -- Adam Zampa

    -- Team 6: Punjab Panthers (CoachID 11: Anil Kumble, 12: Wasim Jaffer)
    (11, 56, 8.70), (12, 56, 8.60), (26, 56, 8.80), -- Shikhar Dhawan (high runs)
    (11, 57, 7.60), (12, 57, 7.50), -- Prabhsimran Singh
    (11, 58, 7.90), (12, 58, 7.80), -- Liam Livingstone
    (11, 59, 7.70), (12, 59, 7.60), (26, 59, 8.80), -- Jitesh Sharma (wicketkeeper)
    (11, 60, 7.80), (12, 60, 7.70), -- Jonny Bairstow
    (11, 61, 7.90), (12, 61, 7.80), -- Sam Curran
    (11, 62, 8.50), (12, 62, 8.40), -- Kagiso Rabada
    (11, 63, 8.20), (12, 63, 8.10), -- Arshdeep Singh
    (11, 64, 7.40), (12, 64, 7.30), -- Harpreet Brar
    (11, 65, 7.60), (12, 65, 7.50), -- Rahul Chahar
    (11, 66, 7.20), (12, 66, 7.10), -- Nathan Ellis

    -- Team 7: Bangalore Blasters (CoachID 13: Andy Flower, 14: Adam Griffith)
    (13, 67, 9.40), (14, 67, 9.30), (27, 67, 9.30), -- Virat Kohli (high runs, captain)
    (13, 68, 8.20), (14, 68, 8.10), -- Faf du Plessis
    (13, 69, 8.00), (14, 69, 7.90), -- Glenn Maxwell
    (13, 70, 8.30), (14, 70, 8.20), (27, 70, 8.20), -- Dinesh Karthik (wicketkeeper)
    (13, 71, 7.70), (14, 71, 7.60), -- Rajat Patidar
    (13, 72, 7.90), (14, 72, 7.80), -- Cameron Green
    (13, 73, 8.40), (14, 73, 8.30), -- Mohammed Siraj
    (13, 74, 7.50), (14, 74, 7.40), -- Reece Topley
    (13, 75, 7.30), (14, 75, 7.20), -- Vijaykumar Vyshak
    (13, 76, 7.60), (14, 76, 7.50), -- Lockie Ferguson
    (13, 77, 7.40), (14, 77, 7.30), -- Will Jacks

    -- Team 8: Hyderabad Hawks (CoachID 15: Tom Moody, 16: Muttiah Muralitharan)
    (15, 78, 7.80), (16, 78, 7.70), -- Aiden Markram
    (15, 79, 7.90), (16, 79, 7.80), -- Abhishek Sharma
    (15, 80, 8.00), (16, 80, 7.90), -- Rahul Tripathi
    (15, 81, 7.70), (16, 81, 7.60), -- Heinrich Klaasen
    (15, 82, 7.80), (16, 82, 7.70), -- Travis Head
    (15, 83, 7.60), (16, 83, 7.50), -- Washington Sundar
    (15, 84, 8.80), (16, 84, 8.70), (28, 84, 8.70), -- Bhuvneshwar Kumar (high wickets)
    (15, 85, 8.20), (16, 85, 8.10), (28, 85, 8.20), -- T Natarajan
    (15, 86, 7.90), (16, 86, 7.80), -- Umran Malik
    (15, 87, 8.00), (16, 87, 7.90), -- Pat Cummins
    (15, 88, 7.40), (16, 88, 7.30), -- Mayank Markande

    -- Team 9: Lucknow Lions (CoachID 17: Justin Langer, 18: Jonty Rhodes)
    (17, 89, 9.10), (18, 89, 9.00), (29, 89, 9.30), -- KL Rahul (wicketkeeper, high runs)
    (17, 90, 7.80), (18, 90, 7.70), -- Quinton de Kock
    (17, 91, 7.60), (18, 91, 7.50), -- Nicholas Pooran
    (17, 92, 7.50), (18, 92, 7.40), -- Ayush Badoni
    (17, 93, 7.70), (18, 93, 7.60), -- Marcus Stoinis
    (17, 94, 7.90), (18, 94, 7.80), -- Krunal Pandya
    (17, 95, 8.30), (18, 95, 8.20), -- Ravi Bishnoi
    (17, 96, 7.60), (18, 96, 7.50), -- Mohsin Khan
    (17, 97, 7.40), (18, 97, 7.30), -- Yash Thakur
    (17, 98, 7.20), (18, 98, 7.10), -- Naveen-ul-Haq
    (17, 99, 7.70), (18, 99, 7.60), -- Deepak Hooda

    -- Team 10: Gujarat Giants (CoachID 19: Gary Kirsten, 20: Ashish Nehra)
    (19, 100, 8.90), (20, 100, 8.80), (30, 100, 8.75), -- Shubman Gill (high runs)
    (19, 101, 8.00), (20, 101, 7.90), (30, 101, 7.95), -- Wriddhiman Saha (wicketkeeper)
    (19, 102, 7.80), (20, 102, 7.70), -- Sai Sudharsan
    (19, 103, 7.60), (20, 103, 7.50), -- David Miller
    (19, 104, 7.50), (20, 104, 7.40), -- Vijay Shankar
    (19, 105, 7.70), (20, 105, 7.60), -- Rahul Tewatia
    (19, 106, 8.80), (20, 106, 8.70), (30, 106, 8.30), -- Rashid Khan (allrounder, high wickets)
    (19, 107, 8.90), (20, 107, 8.80), (30, 107, 8.70), -- Mohammed Shami (high wickets)
    (19, 108, 7.50), (20, 108, 7.40), -- Noor Ahmad
    (19, 109, 7.30), (20, 109, 7.20), -- Joshua Little
    (19, 110, 7.40), (20, 110, 7.30); -- Sai Kishore
        `;
    await db.execute(insertQuery);
    console.log('Insertion of eval table done');
    }else{
        console.log('Already data of eval present');
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createTableEval};