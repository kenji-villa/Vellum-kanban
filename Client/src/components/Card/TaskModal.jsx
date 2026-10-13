import React from "react";
import Modal from "../UI/Modal";
import TaskForm from "./TaskForm";

const TaskModal = ({ isOpen, onClose, card, onSubmit, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card ? "Edit Task" : "Create Task"}
      footer={
        card && onDelete ? (
          <button
            onClick={onDelete}
            className="mr-auto px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete Task
          </button>
        ) : null
      }
    >
      <TaskForm initialValues={card} onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  );
};

export default TaskModal;
