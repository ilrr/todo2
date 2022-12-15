import { Link } from "react-router-dom"

const TasklistCard = ({ tasklist }) => {
  return (
    <>
      <Link to={`/lista/${tasklist.id}`}>
        <div className="tasklist-card">
          {tasklist.name}
        </div>
      </Link>
    </>
  )
}

export default TasklistCard