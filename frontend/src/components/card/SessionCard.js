import styles from "./SessionCard.module.scss";
import { Tooltip, CardContent, Typography, Card, Fab } from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function SessionCard({
  session,
  setEditSession,
  setOpen,
  index,
  ...props
}) {
  //Set the edit session to the current session and open the modal
  const handleEditSession = (session) => {
    setEditSession(session);
    setOpen(true);
  };

  return (
    <div
      className={styles.sessionCardWrapper}
      {...props}
      id={`session-card-${index + 1}`}
    >
      <Card sx={{ width: 275 }} className={styles.sessionCard}>
        <CardContent>
          <div className={styles.sessionTitle}>
            <Typography variant="h5">{session.name}</Typography>
            <Fab
              size="small"
              color="primary"
              className={styles.editButton}
              onClick={() => handleEditSession(session)}
              id={`edit-session-${index + 1}`}
            >
              <Tooltip title="Edit Session">
                <Edit />
              </Tooltip>
            </Fab>
          </div>
          <hr />
          {session.questions.map((question) => (
            <div key={JSON.stringify(question)} className={styles.question}>
              {question.order} {question.question}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
