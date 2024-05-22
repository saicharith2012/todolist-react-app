import "./App.css";
import { useState } from "react";
import { Task } from "./Components/Task.jsx";
import DateTimeComponent from "./Components/DateAndTimeComponent.jsx";

function App() {
  const [todoList, setToDoList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state


  const handleChange = (event) => {
    setNewTask(event.target.value);
    setErrorMessage(""); // Clear error message when typing

  };

  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (trimmedTask !== "") {
      const task = {
        id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
        taskName: trimmedTask, // Use the trimmed value
        isComplete: false,
      };
      setToDoList([task, ...todoList]);
      setNewTask("");
    } else {
      setErrorMessage("Task cannot be empty"); // Set error message
    }
  };

  const deleteTask = (id) => {
    setToDoList(todoList.filter((task) => task.id !== id));
  };

  const completeTask = (id) => {
    setToDoList(
      todoList.map((task) => {
        return task.id === id ? (task = { ...task, isComplete: true }) : task;
      })
    );
  };

  const handleKeyDown = (event) => event.key === "Enter" && addTask();

  return (
    <div className="App">
      <DateTimeComponent />
      <div className="add-task">
        <input
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={newTask}
        />
        <button onClick={addTask}>Add task</button>
        {/* Display error message if it exists */}
        {errorMessage && <p className="error-message">{errorMessage}</p>} 
      </div>

      <div className="scroll-container">
        <div className="list">
          {todoList.map((task) => (
            <Task
              taskName={task.taskName}
              id={task.id}
              isComplete={task.isComplete}
              completeTask={completeTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
