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
                Role VARCHAR(20) CHECK (ROLE IN ('Batsman','Bowler','Allrounder','Wicketkeeper')),
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
            console.log("Empty!! inserting data of the players");
            const insertQuery = `INSERT IGNORE INTO player (PID, PName, TEAMID, DOB, isSelected, Role, RunsScored, WicketsTaken, BallsFaced, RunsGiven, HighestScore, BestBowlingFigure) VALUES
        -- Team 1: Mumbai Mavericks
        (1, 'Rohit Sharma', 1, '1987-04-30', 0, 'Batsman', 5800, 1, 4200, 20, 118, '1/10'),
        (2, 'Suryakumar Yadav', 1, '1990-09-14', 0, 'Batsman', 3100, 0, 2500, 0, 94, '0/0'),
        (3, 'Ishan Kishan', 1, '1998-07-18', 0, 'Wicketkeeper', 2200, 0, 1800, 0, 99, '0/0'),
        (4, 'Tilak Varma', 1, '2002-11-08', 0, 'Batsman', 980, 0, 720, 0, 84, '0/0'),
        (5, 'Tim David', 1, '1996-03-16', 0, 'Batsman', 890, 0, 640, 0, 74, '0/0'),
        (6, 'Cameron Green', 1, '1999-06-03', 0, 'Allrounder', 1200, 25, 900, 500, 89, '3/22'),
        (7, 'Hardik Pandya', 1, '1993-10-11', 0, 'Allrounder', 2300, 60, 1700, 1500, 91, '4/24'),
        (8, 'Jasprit Bumrah', 1, '1993-12-06', 0, 'Bowler', 70, 145, 100, 3400, 12, '5/10'),
        (9, 'Piyush Chawla', 1, '1988-12-24', 0, 'Bowler', 300, 157, 270, 3100, 23, '4/15'),
        (10, 'Jason Behrendorff', 1, '1990-04-20', 0, 'Bowler', 50, 45, 60, 1200, 10, '3/18'),
        (11, 'Kumar Kartikeya', 1, '1997-12-30', 0, 'Bowler', 15, 22, 25, 700, 6, '3/20'),
        -- Team 2: Chennai Chargers
        (12, 'MS Dhoni', 2, '1981-07-07', 0, 'Wicketkeeper', 5000, 0, 3800, 0, 84, '0/0'),
        (13, 'Ruturaj Gaikwad', 2, '1997-01-31', 0, 'Batsman', 2200, 0, 1600, 0, 101, '0/0'),
        (14, 'Devon Conway', 2, '1991-07-08', 0, 'Batsman', 1400, 0, 1000, 0, 92, '0/0'),
        (15, 'Ajinkya Rahane', 2, '1988-06-06', 0, 'Batsman', 2600, 0, 2000, 0, 102, '0/0'),
        (16, 'Moeen Ali', 2, '1987-06-18', 0, 'Allrounder', 1900, 40, 1500, 1500, 93, '4/23'),
        (17, 'Shivam Dube', 2, '1993-06-26', 0, 'Allrounder', 1800, 25, 1300, 700, 95, '3/22'),
        (18, 'Ravindra Jadeja', 2, '1988-12-06', 0, 'Allrounder', 2600, 135, 2000, 3200, 87, '5/16'),
        (19, 'Deepak Chahar', 2, '1992-08-07', 0, 'Bowler', 100, 83, 80, 2200, 10, '4/13'),
        (20, 'Matheesha Pathirana', 2, '2002-12-18', 0, 'Bowler', 50, 30, 40, 900, 8, '3/18'),
        (21, 'Tushar Deshpande', 2, '1995-05-15', 0, 'Bowler', 30, 40, 30, 1200, 8, '3/24'),
        (22, 'Ben Stokes', 2, '1991-06-04', 0, 'Allrounder', 2200, 30, 1700, 1400, 107, '3/25'),
        -- Team 3: Kolkata Knights
        (23, 'Shreyas Iyer', 3, '1994-12-06', 0, 'Batsman', 2500, 0, 1900, 0, 96, '0/0'),
        (24, 'Rinku Singh', 3, '1997-10-12', 0, 'Batsman', 1300, 0, 1100, 0, 68, '0/0'),
        (25, 'Jason Roy', 3, '1990-07-21', 0, 'Batsman', 1900, 0, 1500, 0, 89, '0/0'),
        (26, 'Nitish Rana', 3, '1993-12-27', 0, 'Batsman', 2200, 0, 1600, 0, 87, '0/0'),
        (27, 'Andre Russell', 3, '1988-04-29', 0, 'Allrounder', 2100, 100, 1300, 2600, 88, '5/15'),
        (28, 'Sunil Narine', 3, '1988-05-26', 0, 'Allrounder', 1200, 160, 900, 3100, 75, '5/19'),
        (29, 'Varun Chakravarthy', 3, '1991-08-29', 0, 'Bowler', 30, 90, 50, 2400, 8, '4/14'),
        (30, 'Harshit Rana', 3, '2001-12-22', 0, 'Bowler', 20, 35, 25, 900, 5, '3/16'),
        (31, 'Vaibhav Arora', 3, '1997-12-14', 0, 'Bowler', 25, 40, 30, 1000, 7, '3/20'),
        (32, 'Venkatesh Iyer', 3, '1994-12-25', 0, 'Wicketkeeper', 1300, 15, 1000, 700, 83, '2/22'),
        (33, 'Litton Das', 3, '1994-10-13', 0, 'Batsman', 900, 0, 800, 0, 73, '0/0'),
        -- Team 4: Delhi Dynamos
        (34, 'Rishabh Pant', 4, '1997-10-04', 0, 'Wicketkeeper', 2800, 0, 2200, 0, 128, '0/0'),
        (35, 'David Warner', 4, '1986-10-27', 0, 'Batsman', 6400, 0, 4800, 0, 126, '0/0'),
        (36, 'Prithvi Shaw', 4, '1999-11-09', 0, 'Batsman', 1700, 0, 1300, 0, 99, '0/0'),
        (37, 'Axar Patel', 4, '1994-01-20', 0, 'Allrounder', 1600, 80, 1300, 2200, 84, '4/18'),
        (38, 'Mitchell Marsh', 4, '1991-10-20', 0, 'Allrounder', 1900, 35, 1400, 1500, 92, '3/24'),
        (39, 'Kuldeep Yadav', 4, '1994-12-14', 0, 'Bowler', 50, 115, 40, 3000, 9, '5/17'),
        (40, 'Khaleel Ahmed', 4, '1997-12-05', 0, 'Bowler', 40, 60, 35, 2100, 6, '3/20'),
        (41, 'Anrich Nortje', 4, '1993-11-16', 0, 'Bowler', 20, 70, 20, 1800, 7, '4/15'),
        (42, 'Lalit Yadav', 4, '1997-01-03', 0, 'Allrounder', 700, 20, 600, 700, 71, '2/22'),
        (43, 'Manish Pandey', 4, '1989-09-10', 0, 'Batsman', 3400, 0, 2700, 0, 114, '0/0'),
        (44, 'Sarfaraz Khan', 4, '1997-10-27', 0, 'Batsman', 1100, 0, 800, 0, 67, '0/0'),
        -- Team 5: Rajasthan Royals
        (45, 'Sanju Samson', 5, '1994-11-11', 0, 'Wicketkeeper', 2700, 0, 2100, 0, 119, '0/0'),
        (46, 'Jos Buttler', 5, '1990-09-08', 0, 'Wicketkeeper', 3200, 0, 2300, 0, 124, '0/0'),
        (47, 'Yashasvi Jaiswal', 5, '2001-12-28', 0, 'Batsman', 1900, 0, 1500, 0, 98, '0/0'),
        (48, 'Devdutt Padikkal', 5, '2000-07-07', 0, 'Batsman', 1400, 0, 1100, 0, 87, '0/0'),
        (49, 'Shimron Hetmyer', 5, '1996-12-26', 0, 'Batsman', 1100, 0, 800, 0, 75, '0/0'),
        (50, 'Riyan Parag', 5, '2001-11-10', 0, 'Allrounder', 900, 15, 700, 500, 78, '2/20'),
        (51, 'Ravichandran Ashwin', 5, '1986-09-17', 0, 'Allrounder', 600, 160, 500, 3400, 59, '5/12'),
        (52, 'Trent Boult', 5, '1989-07-22', 0, 'Bowler', 30, 95, 25, 2500, 7, '4/18'),
        (53, 'Yuzvendra Chahal', 5, '1990-07-23', 0, 'Bowler', 40, 170, 30, 3600, 8, '5/14'),
        (54, 'Navdeep Saini', 5, '1992-11-23', 0, 'Bowler', 20, 40, 20, 1100, 6, '3/22'),
        (55, 'Adam Zampa', 5, '1992-03-31', 0, 'Bowler', 15, 35, 15, 900, 5, '3/19'),
        -- Team 6: Punjab Panthers
        (56, 'Shikhar Dhawan', 6, '1985-12-05', 0, 'Batsman', 6200, 0, 4600, 0, 127, '0/0'),
        (57, 'Prabhsimran Singh', 6, '2000-08-10', 0, 'Wicketkeeper', 1100, 0, 900, 0, 89, '0/0'),
        (58, 'Liam Livingstone', 6, '1993-08-04', 0, 'Allrounder', 1500, 25, 1100, 700, 94, '3/21'),
        (59, 'Jitesh Sharma', 6, '1993-10-22', 0, 'Wicketkeeper', 900, 0, 700, 0, 73, '0/0'),
        (60, 'Jonny Bairstow', 6, '1989-09-25', 0, 'Wicketkeeper', 2100, 0, 1600, 0, 108, '0/0'),
        (61, 'Sam Curran', 6, '1998-06-03', 0, 'Allrounder', 1300, 45, 1000, 1400, 86, '4/20'),
        (62, 'Kagiso Rabada', 6, '1995-05-25', 0, 'Bowler', 50, 100, 40, 2600, 9, '4/16'),
        (63, 'Arshdeep Singh', 6, '1999-02-05', 0, 'Bowler', 30, 65, 25, 1800, 7, '4/15'),
        (64, 'Harpreet Brar', 6, '1995-09-16', 0, 'Allrounder', 400, 20, 300, 600, 55, '2/18'),
        (65, 'Rahul Chahar', 6, '1999-08-04', 0, 'Bowler', 20, 50, 20, 1300, 5, '3/20'),
        (66, 'Nathan Ellis', 6, '1994-09-22', 0, 'Bowler', 15, 30, 15, 800, 4, '3/19'),
        -- Team 7: Bangalore Blasters
        (67, 'Virat Kohli', 7, '1988-11-05', 0, 'Batsman', 7200, 0, 5200, 0, 113, '0/0'),
        (68, 'Faf du Plessis', 7, '1984-07-13', 0, 'Batsman', 3400, 0, 2600, 0, 115, '0/0'),
        (69, 'Glenn Maxwell', 7, '1988-10-14', 0, 'Allrounder', 2400, 35, 1800, 1000, 97, '3/22'),
        (70, 'Dinesh Karthik', 7, '1985-06-01', 0, 'Wicketkeeper', 4600, 0, 3400, 0, 96, '0/0'),
        (71, 'Rajat Patidar', 7, '1993-06-01', 0, 'Batsman', 1300, 0, 1000, 0, 88, '0/0'),
        (72, 'Cameron Green', 7, '1999-06-03', 0, 'Allrounder', 1200, 25, 900, 600, 89, '3/20'),
        (73, 'Mohammed Siraj', 7, '1994-03-13', 0, 'Bowler', 30, 80, 25, 2200, 6, '4/17'),
        (74, 'Reece Topley', 7, '1994-02-21', 0, 'Bowler', 20, 40, 20, 1100, 5, '3/18'),
        (75, 'Vijaykumar Vyshak', 7, '1997-01-31', 0, 'Bowler', 15, 30, 15, 800, 4, '3/19'),
        (76, 'Lockie Ferguson', 7, '1991-06-13', 0, 'Bowler', 10, 45, 10, 1200, 3, '3/21'),
        (77, 'Will Jacks', 7, '1998-11-21', 0, 'Allrounder', 900, 15, 700, 500, 76, '2/19'),
        -- Team 8: Hyderabad Hawks
        (78, 'Aiden Markram', 8, '1994-10-04', 0, 'Batsman', 2100, 0, 1600, 0, 92, '0/0'),
        (79, 'Abhishek Sharma', 8, '2000-09-04', 0, 'Allrounder', 1400, 15, 1100, 500, 87, '2/20'),
        (80, 'Rahul Tripathi', 8, '1991-03-02', 0, 'Batsman', 2200, 0, 1700, 0, 93, '0/0'),
        (81, 'Heinrich Klaasen', 8, '1991-07-30', 0, 'Wicketkeeper', 1800, 0, 1300, 0, 104, '0/0'),
        (82, 'Travis Head', 8, '1993-12-29', 0, 'Batsman', 1900, 0, 1400, 0, 102, '0/0'),
        (83, 'Washington Sundar', 8, '1999-10-05', 0, 'Allrounder', 700, 35, 600, 1000, 65, '3/18'),
        (84, 'Bhuvneshwar Kumar', 8, '1990-02-05', 0, 'Bowler', 50, 150, 40, 3400, 8, '5/12'),
        (85, 'T Natarajan', 8, '1991-04-04', 0, 'Bowler', 20, 65, 20, 1800, 5, '4/15'),
        (86, 'Umran Malik', 8, '1999-11-22', 0, 'Bowler', 15, 40, 15, 1100, 4, '3/20'),
        (87, 'Pat Cummins', 8, '1993-05-08', 0, 'Bowler', 60, 80, 50, 2100, 9, '4/16'),
        (88, 'Mayank Markande', 8, '1997-11-11', 0, 'Bowler', 10, 35, 10, 900, 3, '3/19'),
        -- Team 9: Lucknow Lions
        (89, 'KL Rahul', 9, '1992-04-18', 0, 'Wicketkeeper', 3900, 0, 2900, 0, 132, '0/0'),
        (90, 'Quinton de Kock', 9, '1992-12-17', 0, 'Wicketkeeper', 2900, 0, 2200, 0, 108, '0/0'),
        (91, 'Nicholas Pooran', 9, '1995-10-02', 0, 'Batsman', 1600, 0, 1200, 0, 98, '0/0'),
        (92, 'Ayush Badoni', 9, '1999-12-03', 0, 'Allrounder', 900, 10, 700, 300, 77, '2/15'),
        (93, 'Marcus Stoinis', 9, '1989-08-16', 0, 'Allrounder', 1900, 35, 1400, 1000, 89, '3/21'),
        (94, 'Krunal Pandya', 9, '1991-03-24', 0, 'Allrounder', 1500, 45, 1200, 1300, 86, '3/18'),
        (95, 'Ravi Bishnoi', 9, '2000-09-05', 0, 'Bowler', 20, 75, 20, 2000, 5, '4/14'),
        (96, 'Mohsin Khan', 9, '1998-07-15', 0, 'Bowler', 15, 40, 15, 1100, 4, '3/20'),
        (97, 'Yash Thakur', 9, '1998-12-28', 0, 'Bowler', 10, 35, 10, 900, 3, '3/19'),
        (98, 'Naveen-ul-Haq', 9, '1999-09-23', 0, 'Bowler', 10, 30, 10, 800, 3, '3/18'),
        (99, 'Deepak Hooda', 9, '1995-04-19', 0, 'Allrounder', 1100, 10, 900, 300, 80, '2/16'),
        -- Team 10: Gujarat Giants
        (100, 'Shubman Gill', 10, '1999-09-08', 0, 'Batsman', 2900, 0, 2100, 0, 129, '0/0'),
        (101, 'Wriddhiman Saha', 10, '1984-10-24', 0, 'Wicketkeeper', 2800, 0, 2200, 0, 87, '0/0'),
        (102, 'Sai Sudharsan', 10, '2001-10-15', 0, 'Batsman', 1500, 0, 1100, 0, 96, '0/0'),
        (103, 'David Miller', 10, '1989-06-10', 0, 'Batsman', 2300, 0, 1700, 0, 94, '0/0'),
        (104, 'Vijay Shankar', 10, '1991-01-26', 0, 'Allrounder', 1100, 15, 900, 500, 78, '2/20'),
        (105, 'Rahul Tewatia', 10, '1993-05-20', 0, 'Allrounder', 900, 20, 700, 600, 73, '2/18'),
        (106, 'Rashid Khan', 10, '1998-09-20', 0, 'Allrounder', 700, 130, 600, 3200, 68, '5/13'),
        (107, 'Mohammed Shami', 10, '1990-09-03', 0, 'Bowler', 30, 100, 25, 2600, 6, '4/16'),
        (108, 'Noor Ahmad', 10, '2005-01-03', 0, 'Bowler', 10, 35, 10, 900, 3, '3/19'),
        (109, 'Joshua Little', 10, '1999-11-01', 0, 'Bowler', 15, 30, 15, 800, 4, '3/18'),
        (110, 'Sai Kishore', 10, '1996-11-06', 0, 'Bowler', 10, 25, 10, 700, 3, '2/17'),
        -- Extra Players
        (111, 'Aryan Patel', 1, '1998-03-15', 0, 'Batsman', 250, 0, 200, 0, 85, '0/0'),
        (112, 'Vikram Singh', 2, '1995-07-22', 0, 'Bowler', 20, 15, 30, 350, 10, '3/25'),
        (113, 'Rahul Desai', 3, '1997-11-10', 0, 'Allrounder', 180, 8, 150, 200, 60, '2/30'),
        (114, 'Karan Sharma', 4, '1994-04-05', 0, 'Wicketkeeper', 300, 0, 240, 0, 75, '0/0'),
        (115, 'Siddharth Nair', 5, '1999-09-12', 0, 'Bowler', 10, 20, 15, 400, 5, '4/28'),
        (116, 'Aditya Rao', 6, '1996-12-01', 0, 'Batsman', 400, 0, 320, 0, 95, '0/0'),
        (117, 'Nikhil Verma', 7, '1993-06-18', 0, 'Allrounder', 220, 10, 180, 250, 70, '3/35'),
        (118, 'Ravi Gupta', 8, '1998-02-25', 0, 'Bowler', 15, 18, 20, 380, 8, '4/22'),
        (119, 'Sachin Yadav', 9, '1995-08-30', 0, 'Batsman', 350, 0, 280, 0, 90, '0/0'),
        (120, 'Arjun Menon', 10, '1997-05-14', 0, 'Wicketkeeper', 280, 0, 220, 0, 80, '0/0'),
        (121, 'Vishal Kumar', 1, '1994-10-20', 0, 'Bowler', 25, 12, 35, 320, 12, '2/27'),
        (122, 'Pranav Joshi', 2, '1999-01-08', 0, 'Allrounder', 200, 7, 160, 180, 65, '2/20'),
        (123, 'Manish Thakur', 3, '1996-03-28', 0, 'Batsman', 320, 0, 260, 0, 88, '0/0'),
        (124, 'Rohan Mehra', 4, '1993-11-15', 0, 'Bowler', 30, 16, 40, 360, 15, '3/30'),
        (125, 'Anil Choudhary', 5, '1998-07-07', 0, 'Batsman', 260, 0, 210, 0, 70, '0/0'),
        (126, 'Kunal Shah', 6, '1995-04-22', 1, 'Allrounder', 240, 9, 190, 220, 75, '3/28'),
        (127, 'Tarun Malhotra', 7, '1997-09-30', 0, 'Batsman', 380, 0, 300, 0, 92, '0/0'),
        (128, 'Sameer Khan', 8, '1994-06-12', 1, 'Bowler', 18, 19, 25, 390, 9, '4/25'),
        (129, 'Devansh Mishra', 9, '1999-02-10', 0, 'Allrounder', 210, 6, 170, 190, 68, '2/22'),
        (130, 'Rakesh Singh', 10, '1996-08-05', 0, 'Batsman', 340, 0, 270, 0, 87, '0/0'),
        (131, 'Amar Patel', 1, '1993-12-20', 0, 'Bowler', 22, 14, 30, 340, 11, '3/26'),
        (132, 'Vivek Sharma', 2, '1998-05-15', 0, 'Batsman', 290, 0, 230, 0, 78, '0/0'),
        (133, 'Saurabh Jain', 3, '1995-10-25', 0, 'Allrounder', 230, 8, 180, 210, 72, '2/25'),
        (134, 'Gaurav Reddy', 4, '1997-03-03', 0, 'Batsman', 360, 0, 290, 0, 94, '0/0'),
        (135, 'Hitesh Dubey', 5, '1994-09-18', 0, 'Bowler', 12, 17, 20, 370, 7, '4/23'),
        (136, 'Naveen Pillai', 6, '1999-06-10', 0, 'Allrounder', 190, 7, 150, 200, 60, '2/30'),
        (137, 'Rohit Nair', 7, '1996-01-28', 0, 'Batsman', 310, 0, 250, 0, 85, '0/0'),
        (138, 'Siddhant Roy', 8, '1993-07-15', 0, 'Bowler', 28, 13, 35, 330, 14, '3/29'),
        (139, 'Vinayak Iyer', 9, '1998-04-05', 0, 'Batsman', 270, 0, 220, 0, 76, '0/0'),
        (140, 'Pradeep Saini', 10, '1995-11-12', 0, 'Allrounder', 250, 10, 200, 230, 80, '3/27');
    `;
        await db.execute(insertQuery);
        
        
        console.log("✅ Default player data inserted successfully!");  
        }else{
             console.log('Datas of player data already present');
        }

    } catch (error) {
        console.log(error);
    }
}



module.exports = {createPlayerTable};