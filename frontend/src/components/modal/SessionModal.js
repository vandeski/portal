import styles from "./SessionModal.module.scss";
import { Box, Modal } from "@material-ui/core";

export default function SessionModal({ open, handleModalOpen, children }) {
  return (
    <Modal
      open={open}
      onClose={() => handleModalOpen(false)}
    >
      <Box className={styles.modal}>{children}</Box>
    </Modal>
  );
}
