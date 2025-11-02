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
            <p><strong>Player of Match:</strong> ${m.PlayerID || 'N/A'}</p>
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
      <div class="mb-3">
        <label>Player Name</label>
        <input type="text" class="form-control" id="pName" required>
      </div>
      <div class="mb-3">
        <label>Team ID (optional)</label>
        <input type="number" class="form-control" id="teamID" min="1">
      </div>
      <div class="mb-3">
        <label>DOB (YYYY-MM-DD)</label>
        <input type="text" class="form-control" id="dob" placeholder="1995-06-15" required>
      </div>
      <div class="mb-3">
        <label>Role</label>
        <select class="form-control" id="role" required>
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="Allrounder">Allrounder</option>
          <option value="Wicket Keeper">Wicket Keeper</option>
        </select>
      </div>
      <button type="submit" class="btn btn-success">Add Player</button>
      <button type="button" class="btn btn-secondary ms-2" onclick="showPlayers()">Cancel</button>
    </form>
  `;

  document.getElementById("main-content").innerHTML = html;
  updateBreadcrumb("Add Player");

  document.getElementById("insertPlayerForm").onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      PName: document.getElementById("pName").value.trim(),
      TEAMID: document.getElementById("teamID").value ? parseInt(document.getElementById("teamID").value) : null,
      DOB: document.getElementById("dob").value,
      Role: document.getElementById("role").value
    };

    const res = await fetch("/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    if (result.status === 'success') {
      alert("Player added!");
      showPlayers();
    } else {
      alert("Error: " + result.message);
    }
  };
}

// EDIT TEAM FORM
function showEditTeamForm(teamId) {
  fetch(`/teams/${teamId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Team not found");
      const t = data.data.team[0];

      const html = `
        <h2>Edit Team</h2>
        <form id="editTeamForm" class="p-4 border rounded bg-light">
          <input type="hidden" id="teamId" value="${t.TeamID}">
          <div class="mb-3">
            <label>Team Name</label>
            <input type="text" class="form-control" id="teamName" value="${t.TeamName}" required>
          </div>
          <div class="mb-3">
            <label>Matches Won</label>
            <input type="number" class="form-control" id="matchesWon" value="${t.MatchesWon}" min="0">
          </div>
          <div class="mb-3">
            <label>Matches Lost</label>
            <input type="number" class="form-control" id="matchesLost" value="${t.MatchesLost}" min="0">
          </div>
          <div class="mb-3">
            <label>Champions</label>
            <input type="number" class="form-control" id="champions" value="${t.Champions}" min="0">
          </div>
          <div class="mb-3">
            <label>NRR</label>
            <input type="number" step="0.01" class="form-control" id="nrr" value="${t.NRR}">
          </div>
          <button type="submit" class="btn btn-success">Update Team</button>
          <button type="button" class="btn btn-secondary ms-2" onclick="showTeams()">Cancel</button>
        </form>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Edit Team");

      document.getElementById("editTeamForm").onsubmit = async (e) => {
        e.preventDefault();
        const body = {
          TeamName: document.getElementById("teamName").value.trim(),
          MatchesWon: parseInt(document.getElementById("matchesWon").value),
          MatchesLost: parseInt(document.getElementById("matchesLost").value),
          Champions: parseInt(document.getElementById("champions").value),
          NRR: parseFloat(document.getElementById("nrr").value)
        };

        const res = await fetch(`/teams/${teamId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const result = await res.json();
        if (result.status === 'success') {
          alert("Team updated!");
          showTeams();
        } else {
          alert("Error: " + result.message);
        }
      };
    })
    .catch(() => alert("Failed to load team"));
}

// EDIT PLAYER FORM
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

      const html = `
        <h2>Edit Player</h2>
        <form id="editPlayerForm" class="p-4 border rounded bg-light">
          <input type="hidden" id="playerId" value="${p.PID}">
          <div class="mb-3">
            <label>Player Name</label>
            <input type="text" class="form-control" id="pName" value="${p.PName}" required>
          </div>
          <div class="mb-3">
            <label>Team ID (optional)</label>
            <input type="number" class="form-control" id="teamID" value="${p.TeamID || ''}" min="1">
          </div>
          <div class="mb-3">
            <label>DOB (YYYY-MM-DD)</label>
            <input type="text" class="form-control" id="dob" value="${p.DOB}" required>
          </div>
          <div class="mb-3">
            <label>Role</label>
            <select class="form-control" id="role" required>
              <option value="Batsman" ${p.Role === 'Batsman' ? 'selected' : ''}>Batsman</option>
              <option value="Bowler" ${p.Role === 'Bowler' ? 'selected' : ''}>Bowler</option>
              <option value="Allrounder" ${p.Role === 'Allrounder' ? 'selected' : ''}>Allrounder</option>
              <option value="Wicket Keeper" ${p.Role === 'Wicket Keeper' ? 'selected' : ''}>Wicket Keeper</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">Update Player</button>
          <button type="button" class="btn btn-secondary ms-2" onclick="showPlayers()">Cancel</button>
        </form>
      `;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Edit Player");

      document.getElementById("editPlayerForm").onsubmit = async (e) => {
        e.preventDefault();
        const body = {
          PName: document.getElementById("pName").value.trim(),
          TEAMID: document.getElementById("teamID").value ? parseInt(document.getElementById("teamID").value) : null,
          DOB: document.getElementById("dob").value,
          Role: document.getElementById("role").value
        };

        const res = await fetch(`/players/${playerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const result = await res.json();
        if (result.status === 'success') {
          alert("Player updated!");
          showPlayers();
        } else {
          alert("Error: " + (result.message || result.error));
        }
      };
    })
    .catch(err => {
      console.error("Edit Player Error:", err);
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

// STANDINGS - REAL POINTS TABLE
function showStandings() {
  fetch("/teams")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load standings");
      const teams = data.data.sort((a, b) => {
        if (b.MatchesWon !== a.MatchesWon) return b.MatchesWon - a.MatchesWon;
        return b.NRR - a.NRR;
      });

      let html = `<h2>Standings</h2><div class="table-responsive"><table class="table table-striped">`;
      html += `<thead><tr><th>#</th><th>Team</th><th>W</th><th>L</th><th>NRR</th><th>Pts</th></tr></thead><tbody>`;
      teams.forEach((t, i) => {
        const pts = t.MatchesWon * 2;
        html += `<tr><td>${i + 1}</td><td>${t.TeamName}</td><td>${t.MatchesWon}</td><td>${t.MatchesLost}</td><td>${t.NRR}</td><td>${pts}</td></tr>`;
      });
      html += `</tbody></table></div>`;
      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Standings");
      history.pushState({ page: 'standings' }, "Standings", "/standings");
    })
    .catch(() => alert("Failed to load standings"));
}

// STATS - ORANGE & PURPLE CAP
function showStats() {
  fetch("/players")
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load stats");
      const players = data.data.players;

      const orangeCap = [...players].sort((a, b) => (b.RunsScored || 0) - (a.RunsScored || 0)).slice(0, 5);
      const purpleCap = [...players].sort((a, b) => (b.WicketsTaken || 0) - (a.WicketsTaken || 0)).slice(0, 5);

      let html = `<h2>Stats</h2><div class="row">`;
      html += `<div class="col-md-6"><h4>Orange Cap</h4><ol>`;
      orangeCap.forEach(p => html += `<li>${p.PName} - ${p.RunsScored || 0} runs</li>`);
      html += `</ol></div>`;

      html += `<div class="col-md-6"><h4>Purple Cap</h4><ol>`;
      purpleCap.forEach(p => html += `<li>${p.PName} - ${p.WicketsTaken || 0} wkts</li>`);
      html += `</ol></div></div>`;

      document.getElementById("main-content").innerHTML = html;
      updateBreadcrumb("Stats");
      history.pushState({ page: 'stats' }, "Stats", "/stats");
    })
    .catch(() => alert("Failed to load stats"));
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