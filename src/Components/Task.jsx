export function Task(props) {
  return (
    <div
      className="task"
      style={{ backgroundColor: props.isComplete ? "green" : "white" }}
    >
      <p>{props.taskName}</p>
      <button
        className="completeTask"
        style={{...(props.isComplete && {
          backgroundColor:"green",
          color: "black",
          cursor: "alias"
        }),
        }}
        onClick={() => props.completeTask(props.id)}
      >
        complete
      </button>
      <button className="deleteTask" onClick={() => props.deleteTask(props.id)}>
        X
      </button>
    </div>
  );
}
