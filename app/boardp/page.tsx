'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Define types for our data structure
interface Item {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  items: Item[];
}

interface Data {
  columns: Record<string, Column>;
  columnOrder: string[];
}

// Initial data with unique IDs for each item
const initialData: Data = {
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: '1-task-1', content: 'Task 1' },
        { id: '2-task-2', content: 'Task 2' },
      ],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      items: [{ id: '3-task-3', content: 'Task 3' }],
    },
    done: { id: 'done', title: 'Done', items: [{ id: '4-task-4', content: 'Task 4' }] },
  },
  columnOrder: ['todo', 'inProgress', 'done'],
};

const Board: React.FC = () => {
  const [data, setData] = useState<Data>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    // Handle column drag
    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      const [movedColumnId] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, movedColumnId);

      setData((prevData) => ({
        ...prevData,
        columnOrder: newColumnOrder,
      }));
      return;
    }

    // Handle item drag within columns
    if (type === 'item') {
      const sourceColumn = data.columns[source.droppableId];
      const destinationColumn = data.columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destinationItems = Array.from(destinationColumn.items);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      setData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [sourceColumn.id]: { ...sourceColumn, items: sourceItems },
          [destinationColumn.id]: { ...destinationColumn, items: destinationItems },
        },
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: 'flex', gap: '16px' }}>
            {data.columnOrder.map((columnId, index) => {
              const column = data.columns[columnId];
              return (
                <Draggable draggableId={column.id} index={index} key={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        padding: 16,
                        background: '#eee',
                        borderRadius: 4,
                        width: 200,
                      }}>
                      <h3 {...provided.dragHandleProps}>{column.title}</h3>
                      <Droppable droppableId={column.id} type="item">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ minHeight: 100 }}>
                            {column.items.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: 8,
                                      margin: '8px 0',
                                      background: '#fff',
                                      borderRadius: 4,
                                      boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                                      ...provided.draggableProps.style,
                                    }}>
                                    {item.content}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
