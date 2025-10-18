import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: "10px",
            margin: "8px 0",
            backgroundColor:
              task.priority === "High" ? "#ff6666" :
              task.priority === "Medium" ? "#ffd966" :
              "#66ff66",
            borderRadius: "6px",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            ...provided.draggableProps.style,
          }}
        >
          <strong>{task.content}</strong>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>Priority: {task.priority}</div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
