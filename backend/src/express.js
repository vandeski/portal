const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const { checkForDb, checkForTable, create, getAll, hydrateDB, update, deleteSession } = require("./services/db.js");
const { defaultData } = require("./utils/defaultData.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

//Establish the connection to the database
const r = require("rethinkdb");
let connection = r.connect(
  { host: "db", port: 28015, db: "portal" },
  async (err, conn) => {
    if (err) throw err;
    connection = conn;
    await checkForDb(connection, "portal");
    await checkForTable(connection, "portal", "sessions");
    console.log("Connected to RethinkDB");
  }
);

app.get("/ping", (req, res) => {
  res.send("Portal Backend Hit!");
});

app.post("/session/create", async (req, res) => {
  return await create(connection, req.body, res)
});

app.get("/session/getAll", async (req, res) => {
  return await getAll(connection, res)
});

app.post("/session/update", async (req, res) => {
  await update(connection, req.body, res)
});

app.post("/session/delete", async (req, res) => {
  await deleteSession(connection, req.body.id, res)
});

//This endpoint clears all the data in the database
//Then it loads the default data
app.post("/restoreDb", async (req, res) => {
  await r.table("sessions")
    .delete()
    .run(connection, function (err, result) {
      if (err) {
        console.error("Failed to delete data in database:", err);
        res.json({
          success: false,
          msg: "Failed to delete data in database. Please refresh the page and try again.",
          data: null,
        });
      }
      console.log("Data deleted. Hydrating DB...");
    });
    const hydrate = await hydrateDB(connection, "portal", "sessions")
    console.log('hydrate: ', hydrate)
  if(hydrate) {
    console.log("DB hydrated successfully!");
    res.json({
      success: true,
      msg: "Database successfully restored!",
      data: defaultData,
    });
  } else {
    console.log("Failed to hydrate DB!");
    res.json({
      success: false,
      msg: "Failed to restore database. Please refresh the page and try again.",
      data: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Portal Backend listening on port ${port}`);
});
