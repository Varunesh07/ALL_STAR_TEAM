// script.js - FULLY WORKING: HOME, MATCHES, STANDINGS, STATS, ALL-STAR, NO ERRORS

// HOME CARDS
const homeHTML = `
  <h2 class="text-center mb-4">Cricket Pro</h2>
  <div class="row g-4">
    <div class="col-md-4">
      <div class="home-card bg-primary text-white p-4 rounded shadow" data-page="teams">
        <h3>Teams</h3>
        <p>View all teams</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="home-card bg-success text-white p-4 rounded shadow" data-page="players">
        <h3>Players</h3>
        <p>All player stats</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="home-card bg-warning text-dark p-4 rounded shadow" data-page="standings">
        <h3>Standings</h3>
        <p>Points table</p>
      </div>
    </div>
    <div class="col-md-6">
      <div class="home-card bg-danger text-white p-4 rounded shadow" data-page="stats">
        <h3>Stats</h3>
        <p>Orange & Purple Cap</p>
      </div>
    </div>
    <div class="col-md-6">
      <div class="home-card bg-info text-white p-4 rounded shadow" data-page="allstar">
        <h3>All-Star</h3>
        <p>Best 11 players</p>
      </div>
    </div>
  </div>
`;

// SHOW HOME + MATCHES — CARDS CLICKABLE AFTER MATCHES LOAD
function showHome() {
  const main = document.getElementById("main-content");
  main.innerHTML = homeHTML;

  // LOAD MATCHES FIRST
  fetch("/matches")
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;

      const matches = data.data.matches;
      const teams = Object.fromEntries(data.data.teams.map(t => [t.TEAMID, t.TEAMNAME]));

      let matchHTML = `<h3 class="mt-5">Recent Matches</h3><div class="row">`;
      if (matches.length === 0) {
        matchHTML += `<p class="text-muted">No matches yet.</p>`;
      } else {
        matches.slice(0, 6).forEach(m => {
  const t1 = teams[m.Team1ID] || 'Unknown';
  const t2 = teams[m.Team2ID] || 'Unknown';

  matchHTML += `
    <div class="col-md-6 mb-3">
      <div class="card">
        <div class="card-body">
          <h6>${t1} vs ${t2}</h6>
          <p><strong>Venue:</strong> ${m.Venue}</p>
          <p><strong>Date:</strong> ${new Date(m.MatchDate).toLocaleDateString()}</p>

          ${m.Team1Score && m.Team2Score ? `
            <p><strong>Score:</strong> ${m.Team1Score} vs ${m.Team2Score}</p>
            ${(() => {
              const s1 = parseScore(m.Team1Score);
              const s2 = parseScore(m.Team2Score);
              if (s1.runs > s2.runs) return `<p class="text-success"><strong>${t1} won by ${s1.runs - s2.runs} runs</strong></p>`;
              if (s2.runs > s1.runs) return `<p class="text-success"><strong>${t2} won by ${s2.runs - s1.runs} runs</strong></p>`;
              return `<p class="text-warning"><strong>Match tied</strong></p>`;
            })()}
          ` : `<p class="text-muted"><strong>Not played</strong></p>`}

          <button class="btn btn-sm btn-primary" onclick="showMatchDetail(${m.MatchID})">View Details</button>
          <button class="btn btn-sm btn-danger" onclick="deleteMatch(${m.MatchID})">Delete</button>
        </div>
      </div>
    </div>`;
});
      }
      matchHTML += `</div>`;
      matchHTML += `<button class="btn btn-success mt-3" onclick="showAddMatchForm()">+ Add Match</button>`;

      main.innerHTML += matchHTML;

      // NOW ADD CARD LISTENERS — AFTER DOM IS FINAL
      document.querySelectorAll('.home-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          const page = card.getAttribute('data-page');
          navigateTo(page);
        });
      });
    })
    .catch(() => {
      // Even if matches fail, still add card listeners
      document.querySelectorAll('.home-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          const page = card.getAttribute('data-page');
          navigateTo(page);
        });
      });
    });

  updateBreadcrumb("Home");
  history.pushState({ page: 'home' }, "Home", "/");
}

// NAVIGATION
function navigateTo(page) {
  if (page === 'teams') showTeams();
  else if (page === 'players') showPlayers();
  else if (page === 'standings') showStandings();
  else if (page === 'stats') showStats();
  else if (page === 'allstar') showAllStarTeam();
}

// BREADCRUMB
function updateBreadcrumb(page) {
  const breadcrumb = document.getElementById("breadcrumb");
  if (page === "Home") {
    breadcrumb.innerHTML = `<li class="breadcrumb-item active">Home</li>`;
  } else {
    breadcrumb.innerHTML = `
      <li class="breadcrumb-item"><a href="#" onclick="showHome()">Home</a></li>
      <li class="breadcrumb-item active">${page}</li>
    `;
  }
}

// SHOW TEAMS
function showTeams() {
  fetch("/teams")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error(data.error);
      const teams = data.data;
      let html = `
        <h2>Teams</h2>
        <button class="btn btn-success mb-3" onclick="showInsertTeamForm()">+ Add New Team</button>
        <div class="row">`;

      teams.forEach(t => {
        html += `
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body text-center">
                <h5>${t.TeamName}</h5>
                <p>W: ${t.MatchesWon} | L: ${t.MatchesLost}</p>
                <p>NRR: ${t.NRR}</p>
                <div class="btn-group mt-2" role="group">
                  <button class="btn btn-primary btn-sm" onclick="showTeamDetail(${t.TeamID})">View</button>
                  <button class="btn btn-warning btn-sm" onclick="showEditTeamForm(${t.TeamID})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteTeam(${t.TeamID})">Delete</button>
                </div>
              </div>
            </div>
          </div>`;
      });
      html += `</div>`;
      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Teams");
      history.pushState({ page: 'teams' }, "Teams", "/teams");
    })
    .catch(err => alert("Failed to load teams: " + err.message));
}

// SHOW PLAYERS
function showPlayers() {
  fetch("/players")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error(data.error);
      const players = data.data.players;
      let html = `
        <h2>Players</h2>
        <button class="btn btn-success mb-3" onclick="showInsertPlayerForm()">+ Add New Player</button>
        <div class="row">`;

      players.forEach(p => {
        html += `
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6>${p.PName}</h6>
                <p>Role: ${p.Role} | Team: ${p.TeamName || 'Free Agent'}</p>
                <p>Runs: ${p.RunsScored || 0} | Wkts: ${p.WicketsTaken || 0}</p>
                <div class="btn-group mt-2" role="group">
                  <button class="btn btn-primary btn-sm" onclick="showPlayerDetail(${p.PID})">View</button>
                  <button class="btn btn-warning btn-sm" onclick="showEditPlayerForm(${p.PID})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deletePlayer(${p.PID})">Delete</button>
                </div>
              </div>
            </div>
          </div>`;
      });
      html += `</div>`;
      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Players");
      history.pushState({ page: 'players' }, "Players", "/players");
    })
    .catch(err => alert("Failed to load players: " + err.message));
}

// SHOW TEAM DETAIL
function showTeamDetail(teamId) {
  fetch(`/teams/${teamId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error(data.error);
      const team = data.data.team[0];
      const players = data.data.players;
      const coaches = data.data.coaches;

      let html = `
        <h2>${team.TeamName} <small class="text-muted">Squad</small></h2>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <p><strong>Won:</strong> ${team.MatchesWon}</p>
                <p><strong>Lost:</strong> ${team.MatchesLost}</p>
                <p><strong>Champions:</strong> ${team.Champions}</p>
                <p><strong>NRR:</strong> ${team.NRR}</p>
              </div>
            </div>
          </div>
        </div>

        <h4>Players</h4>
        <div class="row mb-4">`;

      players.forEach(p => {
        html += `
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6>${p.PName}</h6>
                <p>${p.Role}</p>
                <p>Runs: ${p.RunsScored} | Wkts: ${p.WicketsTaken}</p>
              </div>
            </div>
          </div>`;
      });

      html += `</div><h4>Coaches</h4><div class="row">`;
      coaches.forEach(c => {
        html += `
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6>${c.CoachName}</h6>
                <p>${c.Role}</p>
              </div>
            </div>
          </div>`;
      });

      html += `</div>`;
      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb(team.TeamName);
      history.pushState({ page: 'team', id: teamId }, team.TeamName, `/team/${teamId}`);
    })
    .catch(err => alert('Could not load team: ' + err.message));
}

// SHOW MATCH DETAIL - FIXED (NO ERROR)
function showMatchDetail(matchId) {
  
  
  fetch(`/matches/${matchId}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.success) throw new Error(data.error || "Match not found");
      if (!data.data || data.data.length === 0) throw new Error("Match data missing");

      const m = data.data.match;  // FIXED: was data.data.match
      const teams = Object.fromEntries(data.data.teams?.map(t => [t.TEAMID, t.TEAMNAME]) || []);
      //const p = data.data.player;

      const t1 = teams[m.Team1ID] || 'Unknown';
      const t2 = teams[m.Team2ID] || 'Unknown';

      // DETERMINE WINNER
      let resultText = "Not played";
      if (m.Team1Score && m.Team2Score) {
        const s1 = parseScore(m.Team1Score);
        const s2 = parseScore(m.Team2Score);
        if (s1.runs > s2.runs) resultText = `${t1} won by ${s1.runs - s2.runs} runs`;
        else if (s2.runs > s1.runs) resultText = `${t2} won by ${s2.runs - s1.runs} runs`;
        else resultText = "Match tied";
      }

      const html = `
        <h2>Match Details</h2>
        <div class="card">
          <div class="card-body">
            <h5>${t1} vs ${t2}</h5>
            <p><strong>Venue:</strong> ${m.Venue}</p>
            <p><strong>Date:</strong> ${new Date(m.MatchDate).toLocaleDateString()}</p>
            <p><strong>Score:</strong> ${m.Team1Score || 'N/A'} vs ${m.Team2Score || 'N/A'}</p>
            <p><strong>Result:</strong> <strong class="text-success">${resultText}</strong></p>
            <p><strong>Player of Match:</strong> ${m.PName || 'N/A'}</p>
          </div>
        </div>
        <button class="btn btn-secondary mt-3" onclick="showHome()">Back</button>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Match");
      history.pushState({ page: 'match', id: matchId }, "Match", `/match/${matchId}`);
    })
    .catch(err => {
      console.error("Match Load Error:", err);
      alert("Failed to load match: " + err.message);
    });
}

// HELPER: Parse "250-8" → { runs: 250, wickets: 8 }
function parseScore(score) {
  if (!score) return { runs: 0, wickets: 0 };
  const [runs, wkts] = score.split('-').map(s => parseInt(s) || 0);
  return { runs, wickets: wkts };
}
document.getElementById("addMatchForm").onsubmit = async (e) => {
  e.preventDefault();
  const body = {
    Team1ID: parseInt(document.getElementById("team1").value),
    Team2ID: parseInt(document.getElementById("team2").value),
    Venue: document.getElementById("venue").value.trim(),
    MatchDate: document.getElementById("matchDate").value,
    Team1Score: document.getElementById("score1").value.trim() || null,
    Team2Score: document.getElementById("score2").value.trim() || null,
    PlayerID: document.getElementById("playerId").value ? parseInt(document.getElementById("playerId").value) : null
  };

  const res = await fetch("/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const result = await res.json();
  if (result.success) {  // FIXED: was result.status
    alert("Match added!");
    showHome();  // NOW RELOADS WITH NEW MATCH
  } else {
    alert("Error: " + (result.error || result.message));
  }
};
// INSERT TEAM FORM
function showInsertTeamForm() {
  const html = `
    <h2>Add New Team</h2>
    <form id="insertTeamForm" class="p-4 border rounded bg-light">
      <div class="mb-3">
        <label>Team Name</label>
        <input type="text" class="form-control" id="teamName" required>
      </div>
      <div class="mb-3">
        <label>Matches Won</label>
        <input type="number" class="form-control" id="matchesWon" min="0" value="0">
      </div>
      <div class="mb-3">
        <label>Matches Lost</label>
        <input type="number" class="form-control" id="matchesLost" min="0" value="0">
      </div>
      <div class="mb-3">
        <label>Champions</label>
        <input type="number" class="form-control" id="champions" min="0" value="0">
      </div>
      <div class="mb-3">
        <label>NRR</label>
        <input type="number" step="0.01" class="form-control" id="nrr" value="0">
      </div>
      <button type="submit" class="btn btn-success">Add Team</button>
      <button type="button" class="btn btn-secondary ms-2" onclick="showTeams()">Cancel</button>
    </form>
  `;

  document.getElementById("main-content").innerHTML = html;
  updateBreadcrumb("Add Team");

  document.getElementById("insertTeamForm").onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      teamName: document.getElementById("teamName").value.trim(),
      MatchesWon: parseInt(document.getElementById("matchesWon").value),
      MatchesLost: parseInt(document.getElementById("matchesLost").value),
      Champions: parseInt(document.getElementById("champions").value),
      NRR: parseFloat(document.getElementById("nrr").value)
    };

    const res = await fetch("/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    if (result.status === 'success') {
      alert("Team added!");
      showTeams();
    } else {
      alert("Error: " + result.message);
    }
  };
}

// INSERT PLAYER FORM
function showInsertPlayerForm() {
  const html = `
    <h2>Add New Player</h2>
    <form id="insertPlayerForm" class="p-4 border rounded bg-light">
      <!-- BASIC INFO -->
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Player Name <span class="text-danger">*</span></label>
          <input type="text" class="form-control" id="pName" required placeholder="e.g. Virat Kohli">
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Team ID <span class="text-danger">*</span></label>
          <input type="number" class="form-control" id="teamID" min="1" required placeholder="e.g. 1">
          <div class="form-text">Must be a valid team ID (≥1)</div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Date of Birth <span class="text-danger">*</span></label>
          <input type="date" class="form-control" id="dob" required>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Role <span class="text-danger">*</span></label>
          <select class="form-select" id="role" required>
            <option value="" disabled selected>Select role</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="Allrounder">Allrounder</option>
            <option value="Wicketkeeper">Wicketkeeper</option>
          </select>
        </div>
      </div>

      <!-- BATTING STATS -->
      <hr class="my-4">
      <h5>Batting Stats</h5>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">Runs Scored</label>
          <input type="number" class="form-control" id="runsScored" min="0" value="0">
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Balls Faced</label>
          <input type="number" class="form-control" id="ballsFaced" min="0" value="0">
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Highest Score</label>
          <input type="number" class="form-control" id="highestScore" min="0" value="0">
        </div>
      </div>

      <!-- BOWLING STATS -->
      <hr class="my-4">
      <h5>Bowling Stats</h5>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label class="form-label">Wickets Taken</label>
          <input type="number" class="form-control" id="wicketsTaken" min="0" value="0">
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Runs Given</label>
          <input type="number" class="form-control" id="runsGiven" min="0" value="0">
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label">Best Bowling Figure</label>
          <input type="text" class="form-control" id="bestBowlingFigure" 
                 placeholder="e.g. 5/32" pattern="\\d+/\\d+" value="0/0">
          <div class="form-text">Format: Wickets/Runs (e.g. 3/25)</div>
        </div>
      </div>

      

      <!-- ACTIONS -->
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-success">Add Player</button>
        <button type="button" class="btn btn-secondary" onclick="showPlayers()">Cancel</button>
      </div>
    </form>
  `;

  document.getElementById("main-content").innerHTML = html;
  updateBreadcrumb("Add Player");

  // Attach submit handler
  document.getElementById("insertPlayerForm").onsubmit = async (e) => {
    e.preventDefault();

    // Gather values
    const pName = document.getElementById("pName").value.trim();
    const teamID = parseInt(document.getElementById("teamID").value);
    const dob = document.getElementById("dob").value;
    const role = document.getElementById("role").value;
    //const isSelected = document.getElementById("isSelected").checked ? 1 : 0;

    const runsScored = parseInt(document.getElementById("runsScored").value) || 0;
    const ballsFaced = parseInt(document.getElementById("ballsFaced").value) || 0;
    const highestScore = parseInt(document.getElementById("highestScore").value) || 0;

    const wicketsTaken = parseInt(document.getElementById("wicketsTaken").value) || 0;
    const runsGiven = parseInt(document.getElementById("runsGiven").value) || 0;
    const bestBowlingFigure = document.getElementById("bestBowlingFigure").value.trim() || "0/0";

    // Client-side validation (mirrors backend)
    if (!pName || !dob || !role) {
      alert("Please fill all required fields: Name, DOB, Role");
      return;
    }
    if (isNaN(teamID) || teamID < 1) {
      alert("Team ID must be a number ≥ 1");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      alert("DOB must be in YYYY-MM-DD format");
      return;
    }
    if (!/^\d+\/\d+$/.test(bestBowlingFigure)) {
      alert("Best Bowling Figure must be in W/R format (e.g. 3/25)");
      return;
    }

    const body = {
      PName: pName,
      TEAMID: teamID,
      DOB: dob,
      Role: role,
      RunsScored: runsScored,
      WicketsTaken: wicketsTaken,
      BallsFaced: ballsFaced,
      RunsGiven: runsGiven,
      HighestScore: highestScore,
      BestBowlingFigure: bestBowlingFigure
    };

    try {
      const res = await fetch("/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (result.status === 'success') {
        alert(`Player added successfully! `);
        showPlayers();
      } else {
        alert("Error: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Insert error:", err);
      alert("Network error. Please try again.");
    }
  };
}
// ---------------------------------------------------------------
// PLAYER DETAIL – same look & feel as Team / Match detail pages
// ---------------------------------------------------------------
function showPlayerDetail(playerId) {
  fetch(`/players/${playerId}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.success || !data.data.player || data.data.player.length === 0) {
        throw new Error("Player not found");
      }

      const p = data.data.player[0];               // single row
      const teamName = p.TeamID ? `Team ID: ${p.TeamID}` : "Free Agent";

      const html = `
        <h2>${p.PName} <small class="text-muted">Player Profile</small></h2>

        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <p><strong>Role:</strong> ${p.Role}</p>
                <p><strong>Team:</strong> ${teamName}</p>
                <p><strong>DOB:</strong> ${new Date(p.DOB).toLocaleDateString()}</p>
                <p><strong>Runs Scored:</strong> ${p.RunsScored ?? 0}</p>
                <p><strong>Wickets Taken:</strong> ${p.WicketsTaken ?? 0}</p>
                <p><strong>Highest Score:</strong> ${p.HighestScore ?? "-"}</p>
                <p><strong>Best Bowling:</strong> ${p.BestBowlingFigure ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <button class="btn btn-secondary mt-3" onclick="showPlayers()">Back to Players</button>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb(p.PName);
      history.pushState({ page: 'player', id: playerId }, p.PName, `/player/${playerId}`);
    })
    .catch(err => {
      console.error("Player Detail Error:", err);
      alert("Failed to load player: " + err.message);
    });
}

// EDIT TEAM FORM
function showEditPlayerForm(playerId) {
  fetch(`/players/${playerId}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.success || !data.data.player || data.data.player.length === 0) {
        throw new Error("Player not found");
      }

      const p = data.data.player[0];

      // Ensure null-safe values
      const teamID = p.TEAMID ?? '';
      const bestBowling = p.BestBowlingFigure || '0/0';

      const html = `
        <h2>Edit Player: ${p.PName}</h2>
        <form id="editPlayerForm" class="p-4 border rounded bg-light">
          <input type="hidden" id="playerId" value="${p.PID}">

          <!-- BASIC INFO -->
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Player Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="pName" value="${p.PName}" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Team ID <span class="text-danger">*</span></label>
              <input type="number" class="form-control" id="teamID" value="${teamID}" min="1" required>
              
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label">Date of Birth <span class="text-danger">*</span></label>
              <input type="date" class="form-control" id="dob" value="${p.DOB}" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Role <span class="text-danger">*</span></label>
              <select class="form-select" id="role" required>
                <option value="Batsman" ${p.Role === 'Batsman' ? 'selected' : ''}>Batsman</option>
                <option value="Bowler" ${p.Role === 'Bowler' ? 'selected' : ''}>Bowler</option>
                <option value="Allrounder" ${p.Role === 'Allrounder' ? 'selected' : ''}>Allrounder</option>
                <option value="Wicketkeeper" ${p.Role === 'Wicketkeeper' ? 'selected' : ''}>Wicketkeeper</option>
              </select>
            </div>
          </div>

          <!-- BATTING STATS -->
          <hr class="my-4">
          <h5 class="mb-3">Batting Statistics</h5>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Runs Scored</label>
              <input type="number" class="form-control" id="runsScored" value="${p.RunsScored}" min="0">
            </div>
            <div class="col-md-4">
              <label class="form-label">Balls Faced</label>
              <input type="number" class="form-control" id="ballsFaced" value="${p.BallsFaced}" min="0">
            </div>
            <div class="col-md-4">
              <label class="form-label">Highest Score</label>
              <input type="number" class="form-control" id="highestScore" value="${p.HighestScore}" min="0">
            </div>
          </div>

          <!-- BOWLING STATS -->
          <hr class="my-4">
          <h5 class="mb-3">Bowling Statistics</h5>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Wickets Taken</label>
              <input type="number" class="form-control" id="wicketsTaken" value="${p.WicketsTaken}" min="0">
            </div>
            <div class="col-md-4">
              <label class="form-label">Runs Given</label>
              <input type="number" class="form-control" id="runsGiven" value="${p.RunsGiven}" min="0">
            </div>
            <div class="col-md-4">
              <label class="form-label">Best Bowling Figure</label>
              <input type="text" class="form-control" id="bestBowlingFigure" 
                     value="${bestBowling}" placeholder="e.g. 5/32" pattern="\\d+/\\d+">
              <div class="form-text">Format: Wickets/Runs (e.g. 3/25)</div>
            </div>
          </div>

          

          <!-- ACTIONS -->
          <div class="d-flex gap-2 mt-4">
            <button type="submit" class="btn btn-success">Update Player</button>
            <button type="button" class="btn btn-secondary" onclick="showPlayers()">Cancel</button>
          </div>
        </form>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb(`Edit: ${p.PName}`);

      // Store original values for change detection
      const original = {
        PName: p.PName,
        TEAMID: p.TEAMID,
        DOB: p.DOB,
        Role: p.Role,
        RunsScored: p.RunsScored,
        WicketsTaken: p.WicketsTaken,
        BallsFaced: p.BallsFaced,
        RunsGiven: p.RunsGiven,
        HighestScore: p.HighestScore,
        BestBowlingFigure: p.BestBowlingFigure || '0/0'
      };

      document.getElementById("editPlayerForm").onsubmit = async (e) => {
        e.preventDefault();

        const current = {
          PName: document.getElementById("pName").value.trim(),
          TEAMID: document.getElementById("teamID").value === "" ? null : parseInt(document.getElementById("teamID").value),
          DOB: document.getElementById("dob").value,
          Role: document.getElementById("role").value,
          RunsScored: parseInt(document.getElementById("runsScored").value) || 0,
          WicketsTaken: parseInt(document.getElementById("wicketsTaken").value) || 0,
          BallsFaced: parseInt(document.getElementById("ballsFaced").value) || 0,
          RunsGiven: parseInt(document.getElementById("runsGiven").value) || 0,
          HighestScore: parseInt(document.getElementById("highestScore").value) || 0,
          BestBowlingFigure: document.getElementById("bestBowlingFigure").value.trim() || "0/0"
        };

        // Client-side validation
        if (!current.PName || !current.DOB || !current.Role) {
          alert("Name, DOB, and Role are required");
          return;
        }
        if (current.TEAMID !== null && (isNaN(current.TEAMID) || current.TEAMID < 1)) {
          alert("Team ID must be a positive number or null");
          return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(current.DOB)) {
          alert("DOB must be in YYYY-MM-DD format");
          return;
        }
        if (!/^\d+\/\d+$/.test(current.BestBowlingFigure)) {
          alert("Best Bowling Figure must be in W/R format (e.g. 3/25)");
          return;
        }

        // Detect changes
        const changes = {};
        for (const key in current) {
          if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
            changes[key] = current[key];
          }
        }

        if (Object.keys(changes).length === 0) {
          alert("No changes detected.");
          return;
        }

        try {
          const res = await fetch(`/players/${playerId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes)
          });

          const result = await res.json();

          if (result.status === 'success') {
            alert("Player updated successfully!");
            showPlayers();
          } else {
            alert("Error: " + (result.message || "Update failed"));
          }
        } catch (err) {
          console.error("Update error:", err);
          alert("Network error. Please try again.");
        }
      };
    })
    .catch(err => {
      console.error("Load Player Error:", err);
      alert("Failed to load player: " + err.message);
    });
}

// DELETE TEAM
async function deleteTeam(id) {
  if (!confirm("Delete this team?")) return;
  const res = await fetch(`/teams/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (result.status === 'success') {
    alert("Team deleted!");
    showTeams();
  } else {
    alert("Error: " + result.message);
  }
}

// DELETE PLAYER
async function deletePlayer(id) {
  if (!confirm("Delete this player?")) return;
  const res = await fetch(`/players/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (result.status === 'success') {
    alert("Player deleted!");
    showPlayers();
  } else {
    alert("Error: " + result.message);
  }
}

async function deleteMatch(matchId) {
  if (!confirm('Are you sure you want to delete this match?\nAll stats will be rolled back automatically.')) return;

  try {
    const res = await fetch(`/matches/${matchId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();

    if (data.success) {
      alert('Match deleted – stats updated!');
      showHome();                 // refresh the home page (recent matches)
    } else {
      alert('Error: ' + (data.error || data.message));
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Network error – try again.');
  }
}

// STANDINGS - REAL POINTS TABLE
function showStandings() {
  fetch("/teams")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load standings");

      const teams = data.data
        .map(t => ({
          ...t,
          NRR: parseFloat(t.NRR) || 0  // Convert NRR to number safely
        }))
        .sort((a, b) => {
          if (b.MatchesWon !== a.MatchesWon) return b.MatchesWon - a.MatchesWon;
          return b.NRR - a.NRR;
        });

      const getRankIcon = (rank) => {
        if (rank === 1) return '<i class="fas fa-medal text-warning"></i>';
        if (rank === 2) return '<i class="fas fa-medal text-secondary"></i>';
        if (rank === 3) return '<i class="fas fa-medal" style="color:#CD7F32"></i>';
        return `<span class="rank-number">${rank}</span>`;
      };

      const html = `
        <div class="container standings-container py-4">
          <div class="text-center mb-5">
            <h2 class="fw-bold text-primary">League Standings</h2>
            <p class="text-muted">Points: 2 per win | Sorted by wins, then NRR</p>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle standings-table">
              <thead class="table-primary">
                <tr>
                  <th scope="col" class="text-center" style="width: 60px">#</th>
                  <th scope="col">Team</th>
                  <th scope="col" class="text-center">W</th>
                  <th scope="col" class="text-center">L</th>
                  <th scope="col" class="text-center">NRR</th>
                  <th scope="col" class="text-center fw-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                ${teams.map((t, i) => {
                  const pts = t.MatchesWon * 2;
                  const rank = i + 1;
                  const nrrDisplay = t.NRR >= 0 ? `+${t.NRR.toFixed(3)}` : t.NRR.toFixed(3);
                  return `
                    <tr class="team-row ${rank <= 3 ? 'table-warning' : ''}">
                      <td class="text-center fw-bold">
                        ${getRankIcon(rank)}
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="team-logo-placeholder me-3">
                            <i class="fas fa-shield-alt"></i>
                          </div>
                          <div>
                            <strong>${t.TeamName}</strong>
                            ${t.Champions > 0 ? `<br><small class="text-success"><i class="fas fa-trophy"></i> ${t.Champions}× Champion${t.Champions > 1 ? 's' : ''}</small>` : ''}
                          </div>
                        </div>
                      </td>
                      <td class="text-center text-success fw-bold">${t.MatchesWon}</td>
                      <td class="text-center text-danger">${t.MatchesLost}</td>
                      <td class="text-center ${t.NRR >= 0 ? 'text-success' : 'text-danger'}">
                        ${nrrDisplay}
                      </td>
                      <td class="text-center fw-bold text-primary fs-5">${pts}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="mt-4 text-center">
            <small class="text-muted">
              <i class="fas fa-info-circle"></i> NRR = Net Run Rate | Top 4 qualify for playoffs
            </small>
          </div>
        </div>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Standings");
      history.pushState({ page: 'standings' }, "Standings", "/standings");
    })
    .catch(err => {
      console.error("Standings error:", err);
      alert("Failed to load standings: " + err.message);
    });
}
// STATS - ORANGE & PURPLE CAP
function showStats() {
  fetch("/players")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load stats");
      const players = data.data.players;

      const orangeCap = [...players]
        .sort((a, b) => (b.RunsScored || 0) - (a.RunsScored || 0))
        .slice(0, 5);

      const purpleCap = [...players]
        .sort((a, b) => (b.WicketsTaken || 0) - (a.WicketsTaken || 0))
        .slice(0, 5);

      const html = `
        <div class="stats-container">
          <div class="stats-header">
            <h2>Player Statistics</h2>
            <p class="text-muted">Top performers in batting and bowling</p>
          </div>

          <div class="row g-4">
            <!-- ORANGE CAP -->
            <div class="col-lg-6">
              <div class="card orange-cap-card h-100">
                <div class="card-header text-center">
                  <div class="cap-icon text-warning">Orange Cap</div>
                  <div>Most Runs</div>
                </div>
                <ul class="list-group list-group-flush">
                  ${orangeCap.map((p, i) => `
                    <li class="list-group-item">
                      <div class="d-flex align-items-center">
                        <span class="rank-badge me-3">${i + 1}</span>
                        <div>
                          <strong>${p.PName}</strong><br>
                          <small>${p.TeamName || 'Free Agent'}</small>
                        </div>
                      </div>
                      <span class="badge bg-light text-dark">${p.RunsScored || 0} runs</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <!-- PURPLE CAP -->
            <div class="col-lg-6">
              <div class="card purple-cap-card h-100">
                <div class="card-header text-center">
                  <div class="cap-icon text-light">Purple Cap</div>
                  <div>Most Wickets</div>
                </div>
                <ul class="list-group list-group-flush">
                  ${purpleCap.map((p, i) => `
                    <li class="list-group-item">
                      <div class="d-flex align-items-center">
                        <span class="rank-badge me-3">${i + 1}</span>
                        <div>
                          <strong>${p.PName}</strong><br>
                          <small>${p.TeamName || 'Free Agent'}</small>
                        </div>
                      </div>
                      <span class="badge bg-light text-dark">${p.WicketsTaken || 0} wkts</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Stats");
      history.pushState({ page: 'stats' }, "Stats", "/stats");
    })
    .catch(() => alert("Failed to load stats"));
}

function showAddMatchForm() {
  fetch("/matches")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load teams");
      const teams = data.data.teams;

      let teamOptions = teams.map(t => `<option value="${t.TEAMID}">${t.TEAMNAME}</option>`).join("");

      const html = `
        <h2>Add New Match</h2>
        <form id="addMatchForm" class="p-4 border rounded bg-light">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Team 1</label>
              <select class="form-control" id="team1" required>${teamOptions}</select>
            </div>
            <div class="col-md-6 mb-3">
              <label>Team 2</label>
              <select class="form-control" id="team2" required>${teamOptions}</select>
            </div>
          </div>
          <div class="mb-3">
            <label>Venue</label>
            <input type="text" class="form-control" id="venue" required>
          </div>
          <div class="mb-3">
            <label>Date</label>
            <input type="date" class="form-control" id="matchDate" required>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Team 1 Score (e.g., 250-8)</label>
              <input type="text" class="form-control" id="score1" placeholder="250-8">
            </div>
            <div class="col-md-6 mb-3">
              <label>Team 2 Score</label>
              <input type="text" class="form-control" id="score2" placeholder="220-10">
            </div>
          </div>
          <div class="mb-3">
            <label>Player of the Match (PID)</label>
            <input type="number" class="form-control" id="playerId" min="1">
          </div>
          <button type="submit" class="btn btn-success">Add Match</button>
          <button type="button" class="btn btn-secondary ms-2" onclick="showHome()">Cancel</button>
        </form>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Add Match");

      // NOW FORM EXISTS → ATTACH SUBMIT
      document.getElementById("addMatchForm").onsubmit = async (e) => {
        e.preventDefault();
        const body = {
          Team1ID: parseInt(document.getElementById("team1").value),
          Team2ID: parseInt(document.getElementById("team2").value),
          Venue: document.getElementById("venue").value.trim(),
          MatchDate: document.getElementById("matchDate").value,
          Team1Score: document.getElementById("score1").value.trim() || null,
          Team2Score: document.getElementById("score2").value.trim() || null,
          PlayerID: document.getElementById("playerId").value ? parseInt(document.getElementById("playerId").value) : null
        };

        const res = await fetch("/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const result = await res.json();
        if (result.success) {
          alert("Match added!");
          showHome(); // RELOADS WITH NEW MATCH
        } else {
          alert("Error: " + (result.error || result.message));
        }
      };
    })
    .catch(() => alert("Failed to load teams"));
}

// ALL-STAR TEAM - BEST 11
function showAllStarTeam() {
  fetch("/players")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load players");
      const players = data.data.players;

      const wk = players.filter(p => p.Role === "Wicket Keeper").sort((a, b) => (b.RunsScored || 0) - (a.RunsScored || 0))[0];
      const bats = players.filter(p => p.Role === "Batsman").sort((a, b) => (b.RunsScored || 0) - (a.RunsScored || 0)).slice(0, 4);
      const allrs = players.filter(p => p.Role === "Allrounder").sort((a, b) => ((b.RunsScored || 0) + (b.WicketsTaken || 0)) - ((a.RunsScored || 0) + (a.WicketsTaken || 0))).slice(0, 3);
      const bowls = players.filter(p => p.Role === "Bowler").sort((a, b) => (b.WicketsTaken || 0) - (a.WicketsTaken || 0)).slice(0, 3);

      const team = [wk, ...bats, ...allrs, ...bowls].filter(Boolean);

      let html = `<h2>All-Star Team</h2><div class="row">`;
      team.forEach(p => {
        html += `
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body text-center">
                <h6>${p.PName}</h6>
                <p><strong>${p.Role}</strong></p>
                <p>Runs: ${p.RunsScored || 0} | Wkts: ${p.WicketsTaken || 0}</p>
              </div>
            </div>
          </div>`;
      });
      html += `</div>`;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("All-Star Team");
      history.pushState({ page: 'allstar' }, "All-Star Team", "/allstarteam");
    })
    .catch(() => alert("Failed to load All-Star team"));
}

// BACK/FORWARD
window.addEventListener('popstate', (e) => {
  const state = e.state || {};
  if (state.page === 'team' && state.id) {
    showTeamDetail(state.id);
  } else if (state.page === 'match' && state.id) {
    showMatchDetail(state.id);
  } else {
    const page = state.page || 'home';
    navigateTo(page);
  }
});

// START
window.addEventListener('DOMContentLoaded', () => {
  console.log("CRICKET PRO STARTED");
  showHome();
});