# 🏏 ALL STAR TEAM

## 🧩 Overview
**ALL STAR TEAM** is a full-fledged cricket team management and analytics platform.  
It helps manage **teams, players, coaches, matches, and evaluations** — and ultimately selects the **best All Star team of 11 players** based on stats and coach evaluations.

It also visualizes the tournament’s **Points Table**, tracks the **Orange Cap** (top run-scorer), and **Purple Cap** (top wicket-taker), providing a complete statistical overview for cricket enthusiasts and team managers.

---

## 👥 Target Audience
- Cricket team managers and coaches  
- Fans and analysts who want to track team and player performance  
- Anyone interested in learning about cricket management systems

---

## 🧠 Core Entities
- **Players** – player data, runs, wickets, roles, and stats  
- **Teams** – team details with auto-updated wins/losses via triggers  
- **Coaches** – assign evaluations and feedback to players  
- **Match Logs** – match outcomes, integrated with team statistics  
- **Evaluations** – performance ratings from coaches  
- **Points Table** –automatically detected based on no.of.wins and NRR  
- **Orange Cap & Purple Cap** – automatically determined based on top performers

---

## ⚙️ Tech Stack
| Component | Technology |
|------------|-------------|
| Backend | Node.js, Express |
| Database | MySQL (using `mysql2` package) |
| Frontend | HTML, CSS |
| Environment Management | dotenv |
| API Testing | Postman |
| Development Tools | Nodemon |
---

## 🧾 Current Features
- ✅ **CRUD** for:
  - Teams  
  - Players  
  - Coaches (backend complete, frontend pending)  
  - Match Logs (uses **MySQL triggers** to update wins/losses)
- 🧮 **Auto-update logic** for team performance  
- 🏆 **Points Table**, **Orange Cap**, and **Purple Cap** leaderboard generation  
- 🧑‍🏫 **Coach evaluation system** for player feedback  
- ⚡ Backend routes and database integration for efficient data handling

---

## 🚧 Under Development
- 🔐 Authentication system (login/signup with JWT or sessions)  
- ⚙️ Middleware for validation and access control  
- 🧱 Error handling logic  
- 🧾 Coach table frontend integration (Create/Update/Delete operations)

---

## 🛠️ Installation & Setup
1. Clone the repository  
   ```bash
   git clone https://github.com/Varunesh07/ALL_STAR_TEAM.git
   cd ALL_STAR_TEAM
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set your variables:  
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=all_star_team
   PORT=3000
   ```

4. Start the application  
   ```bash
   node index.js
   ```

5. Visit  
   ```bash
   http://localhost:3000
   ```

---

## 💾 Database Setup
This project uses **MySQL** with the `mysql2` package.  
- Make sure a MySQL server is running locally.  
- Just create a Database alone in MYSQL server and tables will be automatically generated
- **Triggers** are used to automatically update the win/loss count of teams upon match record changes.

---

## 🚀 Future Enhancements
- Implement secure user authentication  
- Add robust middleware and centralized error handling  
- Improve frontend UI with live stats and leaderboards  
- Extend All Star team selection algorithm with weighted performance metrics

---

## 👨‍💻 Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Varunesh07">
        <img src="https://avatars.githubusercontent.com/u/205139899?v=4" width="100px;" alt="Varunesh S"/>
        <br />
        <sub><b>Varunesh S</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Pranav24PW-25">
        <img src="https://avatars.githubusercontent.com/u/200570293?v=4" width="100px;" alt="Pranav"/>
        <br />
        <sub><b>Pranav P K</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🏁 License
This project is built for educational and demonstration purposes.  
Feel free to fork or adapt it for your own learning or practice.

