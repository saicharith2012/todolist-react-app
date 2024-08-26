import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Task } from "./Components/Task";
import DateTimeComponent from "./Components/DateAndTimeComponent";
import Toggle from "react-toggle";
import useColorScheme from "./utils/useColorScheme";
import moment from "moment";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"; // Importing necessary components
import { v4 as uuidv4 } from "uuid";
import Tooltip from "./Components/Tooltip";

interface taskType {
  id: string;
  taskName: string;
  isComplete: boolean;
  timestamp: string;
}

function App() {
  const [todoList, setToDoList] = useState<taskType[]>(() => {
    const storedTasks: taskType[] = JSON.parse(
      localStorage.getItem("todoList") || "[]"
    );
    const validTasks: taskType[] = storedTasks.filter((task: taskType) => {
      const currentTime = new Date().getTime();
      const taskTime = new Date(task.timestamp).getTime();
      return currentTime - taskTime < 172800000; // 2 days
    });
    return validTasks;
  });
  const [topic, setTopic] = useState("");
  const [newTask, setNewTask] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state
  const { isDarkMode, setIsDarkMode } = useColorScheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
    setErrorMessage(""); // Clear error message when typing
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const deleteTask = (id: string) => {
    setToDoList(todoList.filter((task: taskType) => task.id !== id));
  };

  const completeTask = (id: string) => {
    setToDoList((prevList) => {
      const updatedList = prevList.map((task: taskType) =>
        task.id === id ? { ...task, isComplete: true } : task
      );

      // Sort the list to move completed tasks to the bottom
      return updatedList.sort((a, b) => {
        if (a.isComplete === b.isComplete) return 0;
        return a.isComplete ? 1 : -1;
      });
    });
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
    event.key === "Enter" && addTask();

  const updateTask = (id: string, newTaskName: string) => {
    setToDoList(
      todoList.map((task: taskType) =>
        task.id === id && newTaskName !== ""
          ? { ...task, taskName: newTaskName }
          : task
      )
    );
  };

  // Function to handle drag end
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedList = Array.from(todoList);
    const [movedTask] = reorderedList.splice(result.source.index, 1);
    reorderedList.splice(result.destination.index, 0, movedTask);

    setToDoList(reorderedList);
  };

  // console.log(isDarkMode);

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
                <div
                  className="list"
                  style={todoList.length === 0 ? { border: "none" } : {}}
                >
                  {todoList.map((task: taskType, index: number) => (
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
                          <Tooltip text={"Drag and drop to reorder"}>
                            <Task
                              taskName={task.taskName}
                              id={task.id}
                              isComplete={task.isComplete}
                              completeTask={completeTask}
                              deleteTask={deleteTask}
                              updateTask={updateTask}
                            />
                          </Tooltip>
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
