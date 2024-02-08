import "./App.css";
import { useState } from "react";
import { Task } from "./Components/Task.jsx";

function App() {
  const [todoList, setToDoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask,
      isComplete: false,
    };
    setToDoList([...todoList, task]);
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
      <div className="add-task">
        <input onChange={handleChange} onKeyDown={handleKeyDown} />
        <button onClick={addTask}>Add task</button>
      </div>

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
  );
}

export default App;
