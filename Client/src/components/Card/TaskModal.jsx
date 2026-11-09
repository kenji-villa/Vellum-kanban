import React from "react";
import Modal from "../UI/Modal";
import TaskForm from "./TaskForm";
import TaskWorkflow from "./TaskWorkflow";
import ActivityFeed from "./ActivityFeed";

const TaskModal = ({
  isOpen,
  onClose,
  card,
  onSubmit,
  onDelete,
  people = [],
  me,
  boardRole,
  onTransition,
  boardLabels = [],
  onCreateLabel,
  onDeleteLabel,
  boardId,
  listId,
  readOnly = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card ? (readOnly ? "Task details" : "Edit Task") : "Create Task"}
      footer={
        card && onDelete && !readOnly ? (
          <button
            onClick={onDelete}
            className="mr-auto px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete Task
          </button>
        ) : null
      }
    >
      {readOnly && (
        <div className="mb-4 rounded-lg bg-gray-100 text-gray-600 text-xs px-3 py-2">
          You have view-only access to this board.
        </div>
      )}

      {card && (
        <TaskWorkflow
          card={card}
          me={me}
          boardRole={boardRole}
          people={people}
          onAction={onTransition}
        />
      )}
      <TaskForm
        initialValues={card}
        onSubmit={onSubmit}
        onCancel={onClose}
        people={people}
        boardLabels={boardLabels}
        onCreateLabel={onCreateLabel}
        onDeleteLabel={onDeleteLabel}
        readOnly={readOnly}
      />
      {card && (
        <ActivityFeed
          cardId={card.id}
          boardId={boardId}
          listId={listId}
          me={me}
          canComment={!readOnly}
          canModerate={boardRole === "owner"}
        />
      )}
    </Modal>
  );
};

export default TaskModal;
