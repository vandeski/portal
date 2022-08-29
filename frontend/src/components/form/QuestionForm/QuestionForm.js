import styles from "./QuestionForm.module.scss";
import { IconButton, TextField } from "@mui/material";
import { Delete, DragHandle } from "@mui/icons-material";

export default function QuestionForm({
  index,
  question,
  handleQuestionChange,
  handleDeleteQuestion,
  ...props
}) {
  return (
    <div className={styles.questionInput} {...props} id={`question-container-${index + 1}`}>
      <IconButton id={`question-drag-handle-${index+1}`}>
        <DragHandle />
      </IconButton>
      <TextField
        fullWidth
        label={`Question ${index + 1}`}
        id={`question-${index + 1}`}
        value={question.question}
        onChange={(e) => {
          handleQuestionChange(e.target.value, index, question);
        }}
      />
      <IconButton onClick={() => handleDeleteQuestion(index)} id={`delete-question-${index + 1}`}>
        <Delete />
      </IconButton>
    </div>
  );
}
