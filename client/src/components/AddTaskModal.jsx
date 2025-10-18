import React, { useState } from "react";

const AddTaskModal = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo"); // todo / inProgress / done

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName) return;

    const newTask = {
      id: Date.now().toString(),
      content: taskName,
      priority,
      status,
    };

    onAddTask(newTask);
    setTaskName("");
    setPriority("Medium");
    setStatus("todo");
  };

  return (
    <form className="mb-3 d-flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />
      <select
        className="form-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select
        className="form-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="todo">To Start</option>
        <option value="inProgress">In Process</option>
        <option value="done">Done</option>
      </select>
      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskModal;
