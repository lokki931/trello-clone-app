'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ListCreate } from './_components/list-create';
import { ListComponent } from './_components/list';
import { Task } from '@prisma/client';
import { toast } from 'sonner';

export interface ListData {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

const BoardIdPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(false);
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    let updatedLists = [...lists];

    if (type === 'column') {
      // Reorder lists
      const newListOrder = Array.from(updatedLists);
      const [movedList] = newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, movedList);
      updatedLists = newListOrder.map((list, index) => ({
        ...list,
        order: index,
      }));

      // Send the updated list order to the server
      const success = await saveListOrder(updatedLists);
      if (!success) {
        console.log('Failed to update list order.');
      } else {
        toast('Update success!');
        console.log('Updated lists:', updatedLists);
      }
    }

    if (type === 'task') {
      const sourceList = updatedLists.find((list) => list.id === source.droppableId);
      const destinationList = updatedLists.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destinationList) return;

      // Reorder tasks within or across lists
      const sourceTasks = Array.from(sourceList.tasks);
      const destinationTasks = Array.from(destinationList.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);

      updatedLists = updatedLists.map((list) =>
        list.id === sourceList.id
          ? { ...list, tasks: sourceTasks }
          : list.id === destinationList.id
          ? { ...list, tasks: destinationTasks }
          : list,
      );

      // Send the updated task orders to the server
      const [sourceSuccess, destinationSuccess] = await Promise.all([
        saveTaskOrder(sourceList.id, sourceTasks),
        saveTaskOrder(destinationList.id, destinationTasks),
      ]);

      if (!sourceSuccess || !destinationSuccess) {
        console.log('Failed to update task order.');
      } else {
        toast('Task update success!');
        console.log('Updated tasks:', updatedLists);
      }
    }

    setLists(updatedLists); // Update state
  };

  // Function to save updated list order
  const saveListOrder = async (lists: ListData[]) => {
    try {
      const response = await fetch('/api/list/updateListOrder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lists }),
      });
      if (!response.ok) {
        console.error('Failed to update list order:', await response.text());
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in saveListOrder:', error);
      return false;
    }
  };

  // Function to save updated task order
  const saveTaskOrder = async (listId: string, tasks: Task[]) => {
    try {
      const response = await fetch(`/api/updateTaskOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listId, tasks }),
      });
      if (!response.ok) {
        console.error('Failed to update task order:', await response.text());
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!boardId) {
      console.log('Board ID is missing.');
      return;
    }

    async function getLists() {
      try {
        setLoading(true);
        const response = await fetch(`/api/list?boardId=${encodeURIComponent(boardId)}`);
        if (!response.ok) {
          const errorDetails = await response.json();
          console.log(errorDetails.message || 'Failed to load board');
          return;
        }
        const listsData = await response.json();
        setLists(listsData);
      } catch (err) {
        console.log(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    getLists();
  }, [boardId]);

  if (loading)
    return (
      <div className="mt-5">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="column">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="pt-5 flex items-start gap-x-5 overflow-x-auto min-h-full">
            {lists?.map((list, index) => (
              <Draggable draggableId={list.id} index={index} key={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}>
                    <div {...provided.dragHandleProps}>
                      <ListComponent data={list} setData={setLists} />
                    </div>
                    <Droppable droppableId={list.id} type="task">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ minHeight: 100 }}>
                          {list.tasks?.map((task, taskIndex) => (
                            <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
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
                                  {task.title}
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
            ))}
            {provided.placeholder}
            <ListCreate id={boardId} setData={setLists} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
    // <DragDropContext onDragEnd={onDragEnd}>
    //   <div className="pt-5 flex items-start gap-x-5 overflow-x-auto min-h-full">
    //     {lists?.map((list) => (
    //       <ListComponent key={list.id} data={list} setData={setLists} />
    //     ))}
    //     <ListCreate id={boardId} setData={setLists} />
    //   </div>
    // </DragDropContext>
  );
};

export default BoardIdPage;
