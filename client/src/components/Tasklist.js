import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
//import tasklist from "../services/tasklist"
import tasklistService from "../services/tasklist";
import AddTask from "./AddTask";
import Share from "./Share";
import TaskCard from "./TaskCard";

const Tasklist = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [tasks, setTasks] = useState([]);
  const [tasklist, setTasklist] = useState({});
  const [edit, setEdit] = useState(false);

  const appendTask = task => {
    setTasks([task, ...tasks]);
  };

  const updateTask = (id, data) => {
    console.log(data);
    setTasks(tasks.filter(task => !(task.id === id)).concat(data.delete ? [] : data));
  };

  useEffect(() => {
    if (userInfo.token) {
      tasklistService.getTasks(listId).then(setTasks);
      tasklistService.getTasklistInfo(listId).then(setTasklist);
    }
  }, [userInfo.token, listId]);

  return (
    <div>
      {userInfo.token ? (
        <div className="tasklist">
          <div style={{ float: "right" }}>
            <input type="checkbox" checked={edit} onChange={() => setEdit(!edit)} />
          </div>
          <h1>{tasklist.name}</h1>
          {tasks
            .filter(({ timeLeft }) => timeLeft === 0)
            .map(task => (
              <TaskCard
                task={task}
                updateTask={updateTask}
                key={task.id}
                edit={edit}
                tasklistId={listId}
                appendTask={appendTask}
              />
            ))}
          <div className="today-separator" style={{ display: tasks[0] ? "block" : "none" }} />
          {tasks
            .filter(({ timeLeft }) => timeLeft !== 0)
            .map(task => (
              <TaskCard
                task={task}
                updateTask={updateTask}
                key={task.id}
                edit={edit}
                tasklistId={listId}
                appendTask={appendTask}
              />
            ))}
          {edit ? (
            <>
              <h2>Luo uusi tehtävä</h2>
              <AddTask tasklistId={listId} appendTask={appendTask} />
            </>
          ) : (
            ""
          )}
          <label>
            <input type="checkbox" checked={edit} onChange={() => setEdit(!edit)} />
            muokkaa
          </label>
          <Share listId={listId} />
        </div>
      ) : (
        "Kirjaudu!"
      )}
    </div>
  );
};

export default Tasklist;
