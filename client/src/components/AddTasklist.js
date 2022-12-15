
import { useEffect, useState } from "react"
import tasklistService from "../services/tasklist"

const AddTasklist = ( ) => {

  let defaultName = ""

  const [name, setName] = useState(defaultName)

  const submitTasklist = (event) => {
    event.preventDefault()
    setName("")
    tasklistService.newList(name).then(({id}) => window.location.href=`/lista/${id}`)
  }

  return (
    <div>
      Luo uusi tehtävälista:
      <form onSubmit={submitTasklist}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        /> <br />
        <button type="submit">Luo</button>
      </form>
    </div>
  )
}

export default AddTasklist