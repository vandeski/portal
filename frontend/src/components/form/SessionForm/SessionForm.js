import styles from "./SessionForm.module.scss";
import { ACTIONS, SEVERITY } from "../../../constant.js";
import { Button, TextField, Fab, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { newSessionTemplate, questionTemplate } from "../constants";
import QuestionForm from "../QuestionForm/QuestionForm.js";
import { v4 as uuidv4 } from "uuid";
import {
  updateSession,
  createSession,
  deleteSession,
} from "../../../services/api.js";

export default function SessionForm({
  session = null,
  sessionCount,
  handleModalOpen,
  handleSessionsUpdate,
  setAlert,
}) {
  const [newSession, setNewSession] = useState(session || newSessionTemplate);
  const [dragItem, setDragItem] = useState();

  //Flag to determine if we are editing or creating a new session
  const edit = session !== null;

  //Handle the drag start of a session
  //setTimout is used to put the action at the end of the event queue
  const handleDragStart = (e, index) => {
    setTimeout(() => {
      e.target.style.opacity = 0;
    });
    setDragItem(index);
  };

  //Hande the drag and ui order update
  const handleDragEnter = (e, index) => {
    e.preventDefault();
    const newList = [...newSession.questions];
    const item = newList[dragItem];
    newList.splice(dragItem, 1);
    newList.splice(index, 0, item);
    setDragItem(index);
    setNewSession({
      ...newSession,
      questions: newList,
    });
  };

  //On drag stop return the opacity to 1
  const handleDragStop = (e) => {
    e.target.style.opacity = 1;
  }

  //Add a new question to the session
  const handleAddQuestion = () => {
    setNewSession({
      ...newSession,
      questions: [...newSession.questions, questionTemplate],
    });
  };

  //Handle the update of a question
  const handleQuestionChange = (val, index, question) => {
    const newQuestions = [...newSession.questions];
    newQuestions[index] = {
      ...question,
      question: val,
    };
    setNewSession({ ...newSession, questions: newQuestions });
  };

  //Handle the delete of a question
  const handleDeleteQuestion = (index) => {
    const newQuestions = [...newSession.questions];
    newQuestions.splice(index, 1);
    setNewSession({ ...newSession, questions: newQuestions });
  };

  //Handle submit of the form to edit a session or create a new session
  const handleSubmit = async () => {
    let data = { ...newSession };
    if (!edit) {
      //If we are creating a new session, we need to add the id and order
      data = { ...data, id: uuidv4(), order: sessionCount + 1 };
    }
    //Update the questions with the correct order
    data.questions = data.questions.map((question, index) => {
      question.order = index + 1;
      return question;
    });

    try {
      let resp = edit ? await updateSession(data) : await createSession(data);
      //If the request was successful, close the modal, update ui, and inform the user
      if (resp.data.success) {
        handleSessionsUpdate(
          resp.data.data,
          edit ? ACTIONS.UPDATE : ACTIONS.CREATE
        );
        handleModalOpen(false);
        setAlert({
          open: true,
          severity: SEVERITY.SUCCESS,
          message: resp.data.msg,
        });
      }
    } catch (error) {
      console.log(error);
      setAlert({
        open: true,
        severity: SEVERITY.ERROR,
        message: `Failed to ${edit ? "update" : "create"} session. ${
          error.errors
            ? error.errors.join("\n")
            : "Please refresh the page and try again."
        }`,
      });
    }
  };

  //Handle the delete of a session
  const handleDelete = async (id) => {
    console.log("DELETING SESSION", id);
    const data = { id };
    try {
      let resp = await deleteSession(data);
      console.log("DELETE RESP", resp.data);
      //If the request was successful, close the modal, update ui, and inform the user
      if (resp.data.success) {
        handleSessionsUpdate(resp.data.data, ACTIONS.DELETE);
        handleModalOpen(false);
        setAlert({
          open: true,
          severity: SEVERITY.SUCCESS,
          message: resp.data.msg,
        });
      }
    } catch (error) {
      console.log(error);
      setAlert({
        open: true,
        severity: SEVERITY.ERROR,
        message:
          "Failed to delete session. Please refresh the page and try again.",
      });
    }
  };

  return (
    <form>
      <TextField
        fullWidth
        label="Session Name"
        id="session-name"
        value={newSession.name}
        className={styles.nameInput}
        onChange={(e) => {
          setNewSession({ ...newSession, name: e.target.value });
        }}
      />
      <hr />
      <Button
        color="primary"
        size="small"
        onClick={() => handleAddQuestion()}
        id="add-question"
        variant="outlined"
      >
        Add Question
      </Button>
      {newSession.questions.length
        ? newSession.questions.map((question, index) => (
            <QuestionForm
              draggable
              key={`Question ${index + 1}`}
              index={index}
              question={question}
              handleQuestionChange={handleQuestionChange}
              handleDeleteQuestion={handleDeleteQuestion}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={(e) => handleDragStop(e)}
              onDragOver={(e) => e.preventDefault()} //Prevents wierd rebound visual
            />
          ))
        : null}
      <hr />
      <div className={styles.formActions}>
        <Button
          variant="contained"
          color="primary"
          id="submit-session"
          onClick={handleSubmit}
        >
          {edit ? "Save" : "Add"} Session
        </Button>
        {edit && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(session.id)}
            id="delete-session"
          >
            Delete Session
          </Button>
        )}
        <Button
          onClick={() => handleModalOpen(false)}
          variant="outlined"
          color="info"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
