const db = require('../config/db');

const createMatchLogTrigger = async (req, res) => {
    try {
        // Drop existing trigger to avoid ER_TRG_ALREADY_EXISTS
        await db.query('DROP TRIGGER IF EXISTS after_matchlog_insert');

        const triggerSQL = `
            CREATE TRIGGER after_matchlog_insert
            AFTER INSERT ON MatchLog
            FOR EACH ROW
            BEGIN
                DECLARE team1_runs INT;
                DECLARE team2_runs INT;

                -- Parse scores (e.g., '150-5' -> runs=150)
                SET team1_runs = CAST(SUBSTRING_INDEX(NEW.Team1Score, '-', 1) AS UNSIGNED);
                SET team2_runs = CAST(SUBSTRING_INDEX(NEW.Team2Score, '-', 1) AS UNSIGNED);

                -- Update MatchesWon, MatchesLost, and NRR
                IF team1_runs > team2_runs THEN
                    UPDATE Team 
                    SET MatchesWon = MatchesWon + 1,
                        NRR = LEAST(GREATEST(NRR + 0.2, -99.99), 99.99)
                    WHERE TeamID = NEW.Team1ID;
                    UPDATE Team 
                    SET MatchesLost = MatchesLost + 1,
                        NRR = LEAST(GREATEST(NRR - 0.2, -99.99), 99.99)
                    WHERE TeamID = NEW.Team2ID;
                ELSEIF team2_runs > team1_runs THEN
                    UPDATE Team 
                    SET MatchesWon = MatchesWon + 1,
                        NRR = LEAST(GREATEST(NRR + 0.2, -99.99), 99.99)
                    WHERE TeamID = NEW.Team2ID;
                    UPDATE Team 
                    SET MatchesLost = MatchesLost + 1,
                        NRR = LEAST(GREATEST(NRR - 0.2, -99.99), 99.99)
                    WHERE TeamID = NEW.Team1ID;
                END IF;
            END
        `;

        // Create the trigger
        await db.query(triggerSQL);

        res.status(201).json({
            status: 'success',
            message: 'Trigger after_matchlog_insert created successfully'
        });
    } catch (error) {
        console.error('Error creating trigger:', error);
        if (error.code === 'ER_TRG_ALREADY_EXISTS') {
            return res.status(400).json({
                status: 'error',
                message: 'Trigger already exists',
                error: error.message
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to create trigger',
            error: error.message
        });
    }
};

module.exports = { createMatchLogTrigger };