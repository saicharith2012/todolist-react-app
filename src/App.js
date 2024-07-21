import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Task } from "./components/Task.jsx";
import DateTimeComponent from "./components/DateAndTimeComponent.jsx";
import Toggle from "react-toggle";
import useColorScheme from "./utils/useColorScheme.js";
import moment from "moment";

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
  const [topic, setTopic] = useState("");
  const [newTask, setNewTask] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state
  const [isDarkMode, setIsDarkMode] = useColorScheme();
  const inputRef = useRef(null);

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

  useEffect(() => {
    inputRef.current.focus();
  }, [todoList]);

  // Save tasks to local storage whenever todoList changes
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    // console.log(localStorage.getItem("todoList"));
  }, [todoList]);

  const handleTaskChange = (event) => {
    setNewTask(event.target.value);
    setErrorMessage(""); // Clear error message when typing
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
    setErrorMessage("");
  };

  const addTask = () => {
    const trimmedTask = newTask.trim();
    const trimmedTopic = topic.trim();
    if (trimmedTask !== "" && trimmedTopic !== "") {
      const task = {
        id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
        taskName: `[${trimmedTopic}] - ${trimmedTask}`, // Use the trimmed value
        isComplete: false,
        timestamp: moment().toISOString(), // Use ISO string format
      };
      setToDoList([...todoList, task]);
      setNewTask("");
      setTopic("");
    } else {
      setErrorMessage("Task/Topic cannot be empty"); // Set error message
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
    if (todoList.length === 0) {
      window.alert("There are no tasks to delete.");
    } else {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete all tasks?"
      );
      if (confirmDelete) {
        setToDoList([]);
        window.location.reload();
      }
    }
  };

  const handleKeyDown = (event) => event.key === "Enter" && addTask();

  const updateTask = (id, newTaskName) => {
    setToDoList(
      todoList.map((task) =>
        task.id === id && newTaskName !== ""
          ? { ...task, taskName: newTaskName }
          : task
      )
    );
  };

  return (
    <div className="App">
      <div className="todo-list-container">
        <DateTimeComponent />
        <div className="add-task">
          <input
            onChange={handleTaskChange}
            onKeyDown={handleKeyDown}
            value={newTask}
            ref={inputRef}
            placeholder="Add task here..."
          />
          <input
            value={topic}
            onChange={handleTopicChange}
            onKeyDown={handleKeyDown}
            placeholder="Topic"
          ></input>
          <button onClick={addTask}>Add task</button>
          {/* Display error message if it exists */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <button onClick={deleteAllTasks} className="delete-all-button">
          Delete All
        </button>

        <div className="toggle-container">
          <Toggle
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            icons={{ checked: "", unchecked: "" }}
            aria-label="Dark mode toggle"
          />
        </div>

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
                  updateTask={updateTask}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
