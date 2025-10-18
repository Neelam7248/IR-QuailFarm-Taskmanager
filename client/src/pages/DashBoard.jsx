import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  // State for tasks grouped by status
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // State for Add Task Modal
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    content: "",
    priority: "Low",
    status: "todo",
    assignedTo: "",
  });

  // Modal handlers
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Add new task
  const handleAddTask = () => {
    if (!newTask.content) {
      alert("Task name is required!");
      return;
    }
    const taskWithId = { ...newTask, id: uuidv4() };
    setTasks({
      ...tasks,
      [newTask.status]: [...tasks[newTask.status], taskWithId],
    });
    setNewTask({
      content: "",
      priority: "Low",
      status: "todo",
      assignedTo: "",
    });
    handleClose();
  };

  // Delete task
  const deleteTask = (taskId) => {
    const updatedTasks = { ...tasks };
    for (let col in updatedTasks) {
      updatedTasks[col] = updatedTasks[col].filter((t) => t.id !== taskId);
    }
    setTasks(updatedTasks);
  };

  // Drag-and-drop handler
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceCol]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destTasks = Array.from(tasks[destCol]);
    movedTask.status = destCol; // Update status when moved
    destTasks.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    });
  };

  // Update task status from dropdown inside the card
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = { ...tasks };
    for (let col in updatedTasks) {
      const index = updatedTasks[col].findIndex((t) => t.id === taskId);
      if (index > -1) {
        const [task] = updatedTasks[col].splice(index, 1);
        task.status = newStatus;
        updatedTasks[newStatus].push(task);
        break;
      }
    }
    setTasks(updatedTasks);
  };

  // Priority + status color class
  const getCardStyle = (task) => {
    if (task.status === "done") return "bg-success text-white"; // Completed tasks green
    switch (task.priority) {
      case "High":
        return "border border-danger";
      case "Medium":
        return "border border-warning";
      default:
        return "border border-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h2>Task Management Dashboard</h2>
      <Button variant="primary" className="my-3" onClick={handleShow}>
        Add Task
      </Button>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                value={newTask.content}
                onChange={(e) =>
                  setNewTask({ ...newTask, content: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control
                type="text"
                value={newTask.assignedTo}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value="todo">To Start</option>
                <option value="inProgress">In Process</option>
                <option value="done">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Task Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row">
          {["todo", "inProgress", "done"].map((status) => (
            <div className="col-md-4" key={status}>
              <h4>
                {status === "todo"
                  ? "To Start"
                  : status === "inProgress"
                  ? "In Process"
                  : "Completed"}
              </h4>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-vh-50 p-2 bg-light rounded"
                  >
                    {tasks[status].length === 0 && (
                      <div className="text-muted text-center">
                        No tasks yet
                      </div>
                    )}

                    {tasks[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`card mb-2 p-2 ${getCardStyle(task)}`}
                          >
                            <Button
                              variant="danger"
                              size="sm"
                              className="float-end"
                              onClick={() => deleteTask(task.id)}
                            >
                              ✕
                            </Button>

                            <strong>{task.content}</strong>
                            <br />
                            <small>Priority: {task.priority}</small>
                            <br />
                            <small>Assigned To: {task.assignedTo}</small>
                            <br />
                            <Form.Select
                              size="sm"
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(task.id, e.target.value)
                              }
                            >
                              <option value="todo">To Start</option>
                              <option value="inProgress">In Process</option>
                              <option value="done">Completed</option>
                            </Form.Select>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
