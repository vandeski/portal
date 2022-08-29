const r = require("rethinkdb");
const { defaultData } = require("../utils/defaultData.js");

function cleanData(result) {
  let data = result?.toArray();
  return data;
}

const create = (connection, session, res) => {
  return r
    .table("sessions")
    .insert(session)
    .run(connection, async function (err, cursor) {
      if (err) {
        console.error("Failed to insert session:", err);
        res.json({
          success: false,
          msg: "Failed to create session. Please refresh the page and try again.",
          data: null,
        });
      }
      console.log("Inserted session:", cursor);
      res.json({
        success: true,
        msg: "Session successfully created!",
        data: session,
      });
    });
}

const getAll = (connection, res) => {
  return r
    .table("sessions")
    .orderBy({ index: r.asc("order") })
    .run(connection, async function (err, cursor) {
      if (err) {
        console.error("Failed to getAll sessions:", err);
        res.json({
          success: false,
          msg: "Failed to retrieve all sessions. Please refresh the page and try again.",
          data: null,
        });
      }
      res.json({
        success: true,
        msg: "Retrieved all sessions!",
        data: await cleanData(cursor),
      });
    });
}

const update = (connection, session, res) => {
  return r
    .table("sessions")
    .get(session.id)
    .update(session)
    .run(connection, async function (err, cursor) {
      if (err) {
        console.error("Failed to update session:", err);
        res.json({
          success: false,
          msg: "Failed to update session. Please refresh the page and try again.",
          data: null,
        });
      }
      res.json({
        success: true,
        msg: "Session successfully updated!",
        data: session,
      });
    });
}

const deleteSession = (connection, id, res) => {
  return r
    .table("sessions")
    .get(id)
    .delete()
    .run(connection, async function (err, cursor) {
      if (err) {
        console.error("Failed to delete session:", err);
        res.json({
          success: false,
          msg: "Failed to delete session. Please refresh the page and try again.",
          data: null,
        });
      }
      console.log("Deleted session:", cursor);
      res.json({
        success: true,
        msg: "Session successfully deleted!",
        data: { id },
      });
    });
}

const hydrateDB = (connection, db, table) => {
  console.log("Hydrating database...");
  return r
    .table(table)
    .insert([...defaultData])
    .run(connection, function (err, result) {
      if (err) {
        console.error("Failed to delete data in database:", err);
      }
      console.log("Databased hydrated!");
    });
}

const clearDb = (connection) => {
  r.table("sessions").delete().run(connection);
}

 const checkForTable = async (connection, db, table) => {
  const resp = await r
    .db(db)
    .tableList()
    .contains(table)
    .do(function (tableExists) {
      return r.branch(tableExists, { tables_created: 0 }, r.tableCreate(table));
    })
    .run(connection);
    console.log("checkForTable", resp);
    if(resp.tables_created > 0) {
      await r.table(table).indexCreate("order").run(connection);
      await hydrateDB(connection, db, table);
    }
}

 const checkForDb = async (connection, db) => {
  r.dbList()
    .contains(db)
    .do(function (databaseExists) {
      return r.branch(databaseExists, { dbs_created: 0 }, r.dbCreate(db));
    })
    .run(connection);
}

module.exports = {
  create,
  getAll,
  update,
  deleteSession,
  checkForTable,
  checkForDb,
  clearDb,
  hydrateDB,
};
