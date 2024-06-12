export function Task(props) {
  return (
    <div
      className="task"
      style={{ backgroundColor: props.isComplete && "green" }}
    >
      <p style={{ backgroundColor: props.isComplete && "green" }}>
        {props.taskName.toUpperCase()}
      </p>
      <button
        className="completeTask"
        style={{
          ...(props.isComplete && {
            backgroundColor: "green",
            cursor: "alias",
          }),
        }}
        onClick={() => props.completeTask(props.id)}
      >
        complete
      </button>
      <button
        className="deleteTask"
        onClick={() => props.deleteTask(props.id)}
      >
        X
      </button>
    </div>
  );
}
