import { useEffect, useState } from "react"
import taskService from "../services/task"
import AddTask from "./AddTask"

const TaskCard = ({ task, updateTask, edit, tasklistId, appendTask }) => {

  const [copy, setCopy] = useState(false)
  const [style, setStyle] = useState("idle")
  const [done, setDone] = useState(false)

  const toDate = date => Date.UTC(date.getYear(), date.getMonth(), date.getDate())

  const dateToString = (date) => {
    // console.log(date);
    if (!date) return "Ei vielä suoritettu"
    const now = new Date(Date.now())
    // console.log(now);
    const dMonth =
        (date.getYear() - now.getYear()) * 12
      + (date.getMonth() - now.getMonth())
      + (date.getDate() - now.getDate()) / 30
    if (dMonth >= 1) return `${Math.floor(dMonth)} kuukauden päästä`
    if (dMonth <= -1) return `${Math.floor(-dMonth)} kuukautta sitten`
    const timeString = `klo ${date.toLocaleTimeString()}` 
    const dDay = (toDate(date) - toDate(now)) / (1000 * 60 * 60 * 24)
    if (dDay === 0) return `tänään ${timeString}`
    if (dDay ===  1) return `huomenna ${timeString}`
    if (dDay ===  -1) return `eilen ${timeString}`
    if (dDay >= 0) return `${dDay} päivän päästä`
    if (dDay < 0) return `${-dDay} päivää sitten`
    return 'outo juttu :|'
  } 

  const deleteTask = () => {
    taskService.deleteTask(id)
    .then((res) => {
        setStyle(`${style} deleted`)
        setTimeout(()=>{
          updateTask(id, {delete:true})
        }, 1000)
    })
    .catch(alert)
  }

  const markAsDone = () => {
    taskService.markAsDone(id)
      .then(data =>{
        setStyle(`${style} completed`)
        setTimeout(()=>{
          updateTask(id, {
            justCompleted: true,
            ...data
          })
          setStyle("checked")
        }, 1500)
      })
      .catch(e => alert(e))
  }

  const {
    name,
    id,
    completedAt,
    frequency,
    timeFlexibility,
    earliest,
    latest,
    daysLeft,
    justCompleted
  } = task

  useEffect(() => {
    if (justCompleted) setStyle("checked")
    else if (latest === null) setStyle("unknown")
    else if (latest < 0) setStyle ("late")
    else if (daysLeft === 0) setStyle ("due")
    else if (daysLeft < 0) setStyle ("due-over" )
    else if (earliest === 0) setStyle ("early")
    else setStyle ("idle")
  }, [])

  useEffect(()=>{
    if (done) {
      setDone(false)
      markAsDone()
    }
  }, [done])
  

  const nextDeadline = completedAt
    ? new Date(new Date(completedAt).valueOf() + 1000*60*60*24*frequency)
    : null
  
  return (
    <div className={`task-card ${style}`}>
      <div className="task-time">
        {dateToString(nextDeadline)} &plusmn; {timeFlexibility} päivää ({nextDeadline ? nextDeadline.toLocaleDateString() : ""})
      </div>
      <div className="task-body">
        
        {name}
        <div>
          <button
            onClick={()=>setDone(true)/*markAsDone*/}
          >
            Tehty!
          </button>
        </div>
        {edit
          ? <div className="edit">
            <button onClick={() => setCopy(!copy)}>kopioi</button>
            <button onClick={deleteTask}>poista</button>
            {copy
              ? <div>
                <AddTask
                  appendTask={appendTask}
                  tasklistId={tasklistId}
                  presets={{ name, frequency }}
                />
                <button onClick={() => setCopy(false)}> peruuta </button>
              </div>
              : ""}
          </div>
          : ""
        }
      </div>
    </div>
  )
}

export default TaskCard