'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ListCreate } from './_components/list-create';
import { Task } from '@prisma/client';
import { toast } from 'sonner';
import { ListOption } from './_components/list/list-option';
import { CreateTask } from './_components/list/create-task';
import { ListTitle } from './_components/list/list-title';
import TaskDialog from './_components/dialog';

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
  const [selectedTask, setSelectedTask] = useState<Task>();
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return; // No valid drop target

    let updatedLists: ListData[] = [...lists]; // Shallow copy of lists

    if (type === 'column') {
      // Reorder lists
      const [movedList] = updatedLists.splice(source.index, 1);
      updatedLists.splice(destination.index, 0, movedList);

      updatedLists = updatedLists.map((list, index) => ({ ...list, order: index }));

      try {
        const success = await saveListOrder(updatedLists);
        if (success) {
          toast('List order updated!');
        } else {
          toast.error('Failed to update list order.');
        }
      } catch (error) {
        console.error('Error saving list order:', error);
        toast.error('An error occurred while saving the list order.');
      }
    } else if (type === 'task') {
      const sourceList = updatedLists.find((list) => list.id === source.droppableId);
      const destinationList = updatedLists.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destinationList) {
        console.error('Source or destination list not found');
        return;
      }

      const sourceTasks = [...sourceList.tasks];
      const destinationTasks = [...destinationList.tasks];

      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (sourceList.id === destinationList.id) {
        // Move task within the same list
        sourceTasks.splice(destination.index, 0, movedTask);
        updatedLists = updateListTasks(updatedLists, sourceList.id, sourceTasks);

        try {
          const success = await saveTaskOrder(sourceList.id, sourceTasks);
          if (success) {
            toast('Task order updated!');
          } else {
            toast.error('Failed to save task order.');
          }
        } catch (error) {
          console.error('Error saving task order:', error);
          toast.error('An error occurred while saving task order.');
        }
      } else {
        // Move task to a different list
        destinationTasks.splice(destination.index, 0, movedTask);
        const updatedDestinationTasks = destinationTasks.map((task) => ({
          ...task,
          listId: destinationList.id,
        }));

        updatedLists = updateListTasks(
          updateListTasks(updatedLists, sourceList.id, sourceTasks),
          destinationList.id,
          updatedDestinationTasks,
        );

        try {
          const [sourceSuccess, destinationSuccess] = await Promise.all([
            saveTaskOrder(sourceList.id, sourceTasks),
            saveTaskOrder(destinationList.id, destinationTasks),
          ]);

          if (sourceSuccess && destinationSuccess) {
            toast('Task order updated!');
          } else {
            toast.error('Failed to save task order for one or more lists.');
          }
        } catch (error) {
          console.error('Error saving task orders:', error);
          toast.error('An error occurred while saving task orders.');
        }
      }
    }

    setLists(updatedLists); // Update the state
  };

  // Helper function to update a specific list's tasks
  const updateListTasks = (lists: ListData[], listId: string, newTasks: Task[]) => {
    return lists.map((list) => (list.id === listId ? { ...list, tasks: newTasks } : list));
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
      const response = await fetch(`/api/list/updateTaskOrder`, {
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
      <div className="mt-5 fixed right-5 bottom-5">
        <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <>
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
                      className="min-w-[228px] bg-slate-900 text-white p-2 rounded-sm shadow-sm"
                      style={{
                        ...provided.draggableProps.style,
                      }}>
                      <div {...provided.dragHandleProps}>
                        <div className="flex justify-between items-center gap-x-2 h-8 p-2">
                          <ListTitle id={list.id} title={list.title} setData={setLists} />
                          <ListOption id={list.id} boardId={boardId} setData={setLists} />
                        </div>
                      </div>
                      <Droppable droppableId={list.id} type="task">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="py-2">
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
                                      color: '#000',
                                      borderRadius: 4,
                                      boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                                      ...provided.draggableProps.style,
                                    }}>
                                    <div onClick={() => setSelectedTask(task)}>{task.title}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <CreateTask id={list.id} setData={setLists} />
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
      {selectedTask && (
        <TaskDialog
          data={selectedTask}
          setData={setLists}
          onClose={() => setSelectedTask(undefined)}
        />
      )}
    </>
  );
};

export default BoardIdPage;
