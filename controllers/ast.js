const db = require('../config/db');

async function selectAllStarTeam(req, res) {
    try {
        // Query to get average EvalScore per player, joined with Player table
        const query = `
            SELECT 
                e.PlayerID AS PID,
                p.PName,
                p.Role,
                p.RunsScored,
                p.WicketsTaken,
                p.HighestScore,
                AVG(e.EvalScore) as AvgEvalScore
            FROM Evaluation e
            JOIN Player p ON e.PlayerID = p.PID
            GROUP BY e.PlayerID, p.PName, p.Role, p.RunsScored, p.WicketsTaken, p.HighestScore
            ORDER BY AvgEvalScore DESC;
        `;
        const [players] = await db.execute(query);

        // Initialize team and role counters
        let allStarTeam = [];
        let selectedRoles = { Batsman: 0, Bowler: 0, Allrounder: 0, Wicketkeeper: 0 };

        // Select top players with role balance
        for (const player of players) {
            if (allStarTeam.length >= 11) break;

            const role = player.Role;

            // Check role limits
            if (
                (role === 'Batsman' && selectedRoles.Batsman < 5) ||
                (role === 'Bowler' && selectedRoles.Bowler < 4) ||
                (role === 'Allrounder' && selectedRoles.Allrounder < 3) ||
                (role === 'Wicketkeeper' && selectedRoles.Wicketkeeper < 1)
            ) {
                allStarTeam.push({
                    PID: player.PID,
                    PName: player.PName,
                    Role: role,
                    AvgEvalScore: parseFloat(player.AvgEvalScore).toFixed(2),
                    RunsScored: player.RunsScored,
                    WicketsTaken: player.WicketsTaken,
                    HighestScore: player.HighestScore
                });
                selectedRoles[role]++;
            }
        }

        // Ensure at least one wicketkeeper
        if (selectedRoles.Wicketkeeper === 0) {
            const topWicketkeeper = players.find(p => p.Role === 'Wicketkeeper');
            if (topWicketkeeper) {
                const lowestPlayer = allStarTeam
                    .filter(p => p.Role !== 'Wicketkeeper')
                    .sort((a, b) => a.AvgEvalScore - b.AvgEvalScore)[0];
                if (lowestPlayer) {
                    allStarTeam = allStarTeam.filter(p => p.PID !== lowestPlayer.PID);
                    allStarTeam.push({
                        PID: topWicketkeeper.PID,
                        PName: topWicketkeeper.PName,
                        Role: 'Wicketkeeper',
                        AvgEvalScore: parseFloat(topWicketkeeper.AvgEvalScore).toFixed(2),
                        RunsScored: topWicketkeeper.RunsScored,
                        WicketsTaken: topWicketkeeper.WicketsTaken,
                        HighestScore: topWicketkeeper.HighestScore
                    });
                    selectedRoles[lowestPlayer.Role]--;
                    selectedRoles.Wicketkeeper++;
                }
            }
        }

        // Select captain
        const captain = allStarTeam
            .filter(p => p.Role === 'Batsman' || p.Role === 'Allrounder')
            .sort((a, b) => b.AvgEvalScore - a.AvgEvalScore)[0];

        // Add captain flag to players
        const teamWithCaptain = allStarTeam.map(player => ({
            ...player,
            isCaptain: captain && player.PID === captain.PID
        }));

        // Prepare JSON response
        res.json({
            status: 'success',
            data: {
                allStarTeam: teamWithCaptain,
                teamComposition: selectedRoles
            },
            message: 'All-Star team selected successfully'
        });

    } catch (error) {
        console.error('Error selecting All-Star team:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to select All-Star team',
            error: error.message
        });
    }
}

module.exports = { selectAllStarTeam };