import styles from "./App.module.scss";
import SessionCard from "./components/card/SessionCard.js";
import SessionForm from "./components/form/SessionForm/SessionForm.js";
import SessionModal from "./components/modal/SessionModal";
import SnackBar from "./components/SnackBar";
import { ACTIONS, SEVERITY } from "./constant.js";
import { getAllSessions, updateSession, restoreDb } from "./services/api.js";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";

function App() {
  const [sessions, setSessions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [dragItem, setDragItem] = useState();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: SEVERITY.SUCCESS,
  });

  //Handle modal open/close and clear editSession if closed
  const handleModalOpen = (val) => {
    if (!val) setEditSession(null);
    setOpen(val);
  };

  //Handle sessions update based on action
  const handleSessionsUpdate = (data, action = null) => {
    console.log("handleSessionsUpdate", data, action);
    switch (action) {
      case ACTIONS.CREATE:
        setSessions([...sessions, data]);
        break;
      case ACTIONS.UPDATE:
        setSessions(
          sessions.map((session) => (session.id === data.id ? data : session))
        );
        break;
      case ACTIONS.DELETE:
        setSessions(sessions.filter((session) => session.id !== data.id));
        break;
      default:
        setSessions(data);
        break;
    }
  };

  //Handle the drag start of a session
  //setTimout is used to put the action at the end of the event queue
  const handleDragStart = (e, index) => {
    setDragItem(index);
    setTimeout(() => {
      e.target.style.opacity = 0;
    });
  };

  //Hande the drag and ui order update
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    const newList = [...sessions];
    const item = newList[dragItem];
    newList.splice(dragItem, 1);
    newList.splice(index, 0, item);
    setDragItem(index);
    handleSessionsUpdate(newList);
  };

  //On drag stop return the opacity to 1
  const handleDragStop = (e) => {
    e.target.style.opacity = 1;
  }

  //On drag drop, update the DB with new session order
  const handleDrop = async (e) => {
    console.log("DROPPING", sessions);
    let updates = [];
    sessions.forEach((session, index) => {
      updates.push(updateSession({ ...session, order: index + 1 }));
    });
    console.log("UPDATES", updates);
    try {
      Promise.all(updates).then((res) => {
        console.log("UPDATES RESP", res);
        const data = res.map((res) => res.data.data);
        handleSessionsUpdate(data);
        setAlert({
          open: true,
          message: "Sessions order updated!",
          severity: SEVERITY.SUCCESS,
        });
      });
    } catch (error) {
      console.log("Update", error);
      setAlert({
        open: true,
        message: `Failed to update sessions order. ${
          error.errors
            ? error.errors.join("\n")
            : "Please refresh the page and try again."
        }`,
        severity: SEVERITY.ERROR,
      });
    }
  };

  //Handle reseting the database/application to its initial state
  const restoreDatabase = async () => {
    try {
      const resp = await restoreDb();
      console.log("restoreDatabase", resp.data);
      handleSessionsUpdate(resp.data.data);
      setAlert({
        open: true,
        message: resp.data.msg,
        severity: SEVERITY.SUCCESS,
      });
    } catch (err) {
      console.log("restoreDatabase", err);
      setAlert({
        open: true,
        message:
          "Failed to restore database. Please refresh the page and try again.",
        severity: SEVERITY.ERROR,
      });
    }
  };

  //On component mount, get all sessions from the API
  useEffect(() => {
    try {
      getAllSessions().then((resp) => {
        handleSessionsUpdate(resp.data.data);
      });
      setAlert({
        open: true,
        message: "Welcome to the Admin Portal!",
        severity: SEVERITY.INFO,
      });
    } catch (error) {
      console.log("getAllSessions", error);
    }
  }, []);

  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <span>Portal</span>
        <span className={styles.buttonRow}>
          <Button
            onClick={() => handleModalOpen(true)}
            variant="outlined"
            id="add-session"
          >
            Create Session
          </Button>
          <Button onClick={restoreDatabase} variant="outlined" id="restore-db">
            Restore DB
          </Button>
        </span>
      </header>
      <div className={styles.dashboard} id="sessions-dashboard">
        {sessions.length ? (
          sessions.map((session, index) => (
            <SessionCard
              key={session.id}
              session={session}
              setEditSession={setEditSession}
              setOpen={setOpen}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={(e) => handleDragStop(e)}
              onDrop={(e) => handleDrop(e)}
              onDragOver={(e) => e.preventDefault()} //Prevents wierd rebound visual
              index={index}
            />
          ))
        ) : (
          <p>No sessions available</p>
        )}
      </div>
      <SessionModal open={open} handleModalOpen={handleModalOpen}>
        <SessionForm
          session={editSession}
          sessionCount={sessions.length}
          handleModalOpen={handleModalOpen}
          setEditSession={setEditSession}
          handleSessionsUpdate={handleSessionsUpdate}
          setAlert={setAlert}
        />
      </SessionModal>
      <SnackBar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        handleClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
}

export default App;
