import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";

const Column = ({ columnId, tasks, title }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: "#f0f0f0",
            padding: "1rem",
            width: "300px",
            minHeight: "400px",
            borderRadius: "6px",
          }}
        >
          <h2>{title}</h2>
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
