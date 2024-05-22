import "./App.css";
import { useState, useEffect } from "react";
import { Task } from "./Components/Task.jsx";
import DateTimeComponent from "./Components/DateAndTimeComponent.jsx";

function App() {
  const [todoList, setToDoList] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem("todoList")) || [];
    const validTasks = storedTasks.filter((task) => {
      const currentTime = new Date().getTime();
      const taskTime = new Date(task.timestamp).getTime();
      return currentTime - taskTime < 172800000; // 2 days
    });
    return validTasks;
  });
  const [newTask, setNewTask] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state

  // Load tasks from local storage on initial render
  // useEffect(() => {
  //   const storedTasks = JSON.parse(localStorage.getItem("todoList")) || [];
  //   if (storedTasks) {
  //     const validTasks = storedTasks.filter((task) => {
  //       // Check if the task has expired (replace '3600000' with your desired time in milliseconds)
  //       const currentTime = new Date().getTime();
  //       const taskTime = new Date(task.timestamp).getTime();
  //       return currentTime - taskTime < 172800000; // 2 days
  //     });
  //     setToDoList(validTasks);
  //   }
  // }, []);

  // Save tasks to local storage whenever todoList changes
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    console.log(localStorage.getItem("todoList"));
  }, [todoList]);

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
        timestamp: new Date().toISOString(), // Use ISO string format
      };
      setToDoList([...todoList, task]);
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

  const deleteAllTasks = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (confirmDelete) {
      setToDoList([]);
      window.location.reload();
    }
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

      <button onClick={deleteAllTasks} className="delete-all-button">
        Delete All
      </button>

      <div className="scroll-container">
        <div className="list">
          {todoList
            .slice()
            .reverse()
            .map((task, key) => (
              <Task
                taskName={task.taskName}
                id={task.id}
                isComplete={task.isComplete}
                completeTask={completeTask}
                deleteTask={deleteTask}
                key={key}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
