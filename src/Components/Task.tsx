import { useState, useRef, useEffect, useReducer } from "react";

interface Props {
  taskName: string;
  id: string;
  isComplete: boolean;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, newTaskName: string) => void;
}

export function Task(props: Props) {
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const initialState = { editedTaskName: props.taskName };

  function reducer(_state: typeof initialState, action: {taskName: string}) {
    if (action.taskName) {
      return { editedTaskName: action.taskName };
    } else {
      throw new Error();
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus(); // Focus the input when isEditing becomes true
    }
  }, [isEditing]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      props.updateTask(props.id, state.editedTaskName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="task"
      style={{
        backgroundColor: props.isComplete ? "green" : undefined,
        display: "flex",
        alignItems: "center",
      }}
    >
      {isEditing ? (
        <input
          className="editInput"
          type="text"
          value={state.editedTaskName}
          onChange={(e) => dispatch({ taskName: e.target.value })}
          ref={editInputRef}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p style={{ backgroundColor: props.isComplete ? "green" : undefined }}>
          {props.taskName.toUpperCase()}
        </p>
      )}

      <div
        className="taskButtons"
        style={{
          ...(props.isComplete && {
            backgroundColor: "green",
            cursor: "alias",
          }),
        }}
      >
        {isEditing ? (
          <button
            className="saveEdit"
            onClick={() => {
              props.updateTask(props.id, state.editedTaskName); // Function to update the task
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
            onClick={(e) => {
              if (!props.isComplete) {
                setIsEditing(true);
                // console.log(props)
                dispatch({ taskName: props.taskName });
              }
            }}
          >
            edit
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
