import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useState } from 'react'

const initialTasks = [
    {
      id: "1",
      text: "React.js"
    },
    {
      id: "2",
      text: "HTML/CSS"
    },
    {
      id: "3",
      text: "AWS"
    },
    {
      id: "4",
      text: "JavaScript"
    }
]

const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

type droppableType = {
    id: string
    content: string
}

export const TestingPage = () => {
    const [tasks, setTasks] = useState(initialTasks)

    const getItems = (count: number, offset = 0): droppableType[] =>
        Array.from({ length: count }, (v, k) => k).map(k => ({
            id: `item-${k + offset}-${new Date().getTime()}`,
            content: `item ${k + offset}`
        })
    )
    
    const [state, setState] = useState<droppableType[][]>([getItems(10), getItems(5, 10)]);

    const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
        const sourceClone = Array.from(source)
        const destClone = Array.from(destination)
        const [removed] = sourceClone.splice(droppableSource.index, 1)
        destClone.splice(droppableDestination.index, 0, removed)
        const result: any = { }
        result[droppableSource.droppableId] = sourceClone
        result[droppableDestination.droppableId] = destClone
        return result
    }

    const grid = 8

    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
        // change background colour if dragging
        background: isDragging ? "lightgreen" : "grey",
        // styles we need to apply on draggables
        ...draggableStyle
    })

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid,
        width: 250
    })

    const onDragEnd = (result: DropResult): void => {
        const { source, destination } = result
        // dropped outside the list
        if (!destination) return
        const sInd = +source.droppableId
        const dInd = +destination.droppableId
        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index)
            const newState = [...state]
            newState[sInd] = items
            setState(newState)
        } else {
            const result = move(state[sInd], state[dInd], source, destination)
            const newState = [...state]
            newState[sInd] = result[sInd]
            newState[dInd] = result[dInd]
            setState(newState.filter(group => group.length))
        }
    }

    return (
        <>
            <style> {`
                h1 {
                    font-size: 3rem;
                    color: #2d3233;
                }

                .task-container {
                    margin: 0;
                    list-style: none;
                    padding: 5px;
                    border-radius: 5px;
                    font-size: 3rem;
                    display: inline-flex;
                    flex-direction: column;
                }

                .task-item {
                    color: rgb(250, 82, 52);
                    box-shadow: 0px 2px 4px #4a4c4e;
                    border-radius: 5px;
                    padding: 0.3em 0.5em;
                    background-color: whitesmoke;
                    text-align: center;
                    margin: 5px;
                    border: 2px solid transparent;
                }

                .task-item:focus {
                    outline: none;
                    border: 2px solid #4a9af5;
                }
            `} </style>
            
            <DragDropContext
                onDragEnd={(result: DropResult) => {
                    const { source, destination } = result
                    if (!destination) return
                    if (source.index === destination.index && source.droppableId === destination.droppableId) return
                    setTasks((prevTasks) => reorder(prevTasks, source.index, destination.index))
                }}
            >
                <div className="app">

                    <h1>Estudiar</h1>

                    <Droppable droppableId="tasks">
                        {(droppableProvided) => (
                            <ul
                                { ...droppableProvided.droppableProps }
                                ref={droppableProvided.innerRef}
                                className="task-container"
                            >
                                {tasks.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(draggableProvided) => (
                                            <li
                                            {...draggableProvided.draggableProps}
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.dragHandleProps}
                                            className="task-item"
                                            >
                                            {task.text}
                                            </li>
                                        )}
                                    </Draggable>
                                ))}

                                {droppableProvided.placeholder}

                            </ul>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>

            <div>
                <button
                    type="button"
                    onClick={() => {setState(x => [...x, []])}}
                >
                    Add new group
                </button>

                <button
                    type="button"
                    onClick={() => {setState([...state, getItems(1)]);}}
                >
                    Add new item
                </button>

                <div style={{ display: "flex" }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {state.map((el, ind) => (
                            <Droppable key={ind} droppableId={`${ind}`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {el.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        <div
                                                            style={{
                                                            display: "flex",
                                                            justifyContent: "space-around"
                                                            }}
                                                        >
                                                            {item.content}
                                                            <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newState = [...state];
                                                                newState[ind].splice(index, 1);
                                                                setState(
                                                                newState.filter(group => group.length)
                                                                );
                                                            }}
                                                            >
                                                            delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                </div>
            </div>
        </>
    )
}
