import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Task } from "./Components/Task.jsx";
import DateTimeComponent from "./Components/DateAndTimeComponent.jsx";
import Toggle from "react-toggle";
import useColorScheme from "./utils/useColorScheme.js";
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Importing necessary components
import { v4 as uuidv4 } from "uuid";

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

  useEffect(() => {
    inputRef.current.focus();
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
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
        id: uuidv4(), // generated unique id.
        taskName: `[${trimmedTopic}] - ${trimmedTask}`, // Use the trimmed value
        isComplete: false,
        timestamp: moment().toISOString(), // Use ISO string format
      };
      setToDoList([task, ...todoList]);
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
        return task.id === id ? { ...task, isComplete: true } : task;
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

  // Function to handle drag end
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedList = Array.from(todoList);
    const [movedTask] = reorderedList.splice(result.source.index, 1);
    reorderedList.splice(result.destination.index, 0, movedTask);

    setToDoList(reorderedList);
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
          />
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

        {/* DragDropContext Component */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                className="scroll-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="list">
                  {todoList.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task
                            taskName={task.taskName}
                            id={task.id}
                            isComplete={task.isComplete}
                            completeTask={completeTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
