require("dotenv").config();
const express = require("express");

const { createTableTeam } = require("./models/teamModel");
const { createPlayerTable } = require("./models/playerModel");
const { createTableCoach } = require('./models/coachModel');
const { createMatchLog } = require('./models/matchLogModel');
const { createTableEval } = require('./models/evalModel');
const { createTableAdmin } = require('./models/adminModel')

const app = express();
app.use(express.json());
app.use(express.static("public"));

(async () => {
  await createTableAdmin();
})();


(async () => {
  await createTableTeam();
})();

(async () => {
  await createPlayerTable();
})();

(async () => {
  await createTableCoach();
})();

(async () => {
  await createMatchLog();
})();

(async () => {
  await createTableEval();
})();

app.get('/', (req, res) => {
  res.send('<h1>Hi</h1>');
});

const teamRouter = require('./routes/team');
const playerRouter = require('./routes/player');
const coachRouter = require('./routes/coach');
const astRouter = require('./routes/ast');

app.use('/teams',teamRouter);
app.use('/players',playerRouter);
app.use('/coaches',coachRouter);
app.use('/allstarteam',astRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
