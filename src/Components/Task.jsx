import { useState, useRef, useEffect } from "react";

export function Task(props) {
  const editInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState(props.taskName);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current.focus();  // Focus the input when isEditing becomes true
    }
  }, [isEditing]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      props.updateTask(props.id, editedTaskName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="task"
      style={{
        backgroundColor: props.isComplete && "green",
        display: "flex",
        alignItems: "center",
      }}
    >
      {isEditing ? (
        <input
          className="editInput"
          type="text"
          value={editedTaskName}
          onChange={(e) => setEditedTaskName(e.target.value)}
          ref={editInputRef}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p style={{ backgroundColor: props.isComplete && "green" }}>
          {props.taskName.toUpperCase()}
        </p>
      )}

      <div className="taskButtons">
      {isEditing ? (
        <button
          className="saveEdit"
          onClick={() => {
            props.updateTask(props.id, editedTaskName); // Function to update the task
            setIsEditing(false);
          }}
        >
          Save
        </button>
      ) : (
        <button
          className="editTask"
          style={{
            ...(props.isComplete && {
              backgroundColor: "green",
              cursor: "alias",
            }),
          }}
          onClick={() => {
            if (!props.isComplete) {
              setIsEditing(true);
            }
          }}
        >
          Edit
        </button>
      )}

      <button
        className="completeTask"
        style={{
          ...(props.isComplete && {
            backgroundColor: "green",
            cursor: "alias",
          }),
        }}
        onClick={() => props.completeTask(props.id)}
        disabled={isEditing}
      >
        complete
      </button>
      <button
        className="deleteTask"
        onClick={() => props.deleteTask(props.id)}
        disabled={isEditing}
      >
        X
      </button>
      </div>
    </div>
  );
}
