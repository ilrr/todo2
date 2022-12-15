
import { useEffect, useState } from "react"
import taskService from "../services/task"

const averageDaysInMonth = 365.25 / 12

const AddTask = ({ tasklistId, appendTask, presets }) => {

  let defaultFrequency = 1
  let defaultMultiplyer = 1
  let defaultName = ""

  if (presets) {
    defaultName = presets.name
    console.log(presets, defaultName)
    if (Math.round(presets.frequency + 0.5) % averageDaysInMonth <= 1) {
      defaultFrequency = Math.round(presets.frequency / averageDaysInMonth)
      defaultMultiplyer = averageDaysInMonth
    } else if (presets.frequency % 7 === 0) {
      defaultFrequency = presets.frequency / 7
      defaultMultiplyer = 7
    } else {
      defaultFrequency = presets.frequency
    }
  }

  const [name, setName] = useState(defaultName)
  const [frequency, setFrequency] = useState(defaultFrequency)
  const [frequencyMultiplyer, setFrequencyMultiplyer] = useState(defaultMultiplyer)
  const [timeFlexibility, setTimeFlexibility] = useState(0)
  const [timeFlexibilityMultiplyer, setTimeFlexibilityMultiplyer] = useState(1)

  // useEffect(()=>{
  //   if (presets) {
  //     setName(presets.name)
  //     if (Math.round(presets.frequency + 0.5) % averageDaysInMonth <= 1) {
  //       setFrequency(presets.frequency / averageDaysInMonth)
  //       setFrequencyMultiplyer(averageDaysInMonth)
  //     } else if (presets.frequency % 7 === 0) {
  //       setFrequency(presets.frequency / 7)
  //       setFrequencyMultiplyer(7)
  //     } else {
  //       setFrequency(presets.frequency)
  //     }
  // }}, [setName, setFrequency, setFrequencyMultiplyer, averageDaysInMonth, presets])

  const submitTask = (event) => {
    event.preventDefault()
    const taskToAdd = {
      name,
      frequency: Math.round(Number(frequency) * frequencyMultiplyer),
      timeFlexibility: Math.round(Number(timeFlexibility) * timeFlexibilityMultiplyer),
      hasSubtasks: false
    }
    setName("")
    setFrequency(1)
    taskService.newTask(tasklistId, taskToAdd).then(
      appendTask
    )
  }

  return (
    <div>
      <form onSubmit={submitTask}>
        Tehtävän nimi:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        /> <br />
        <TimeIntervalForm
          before={<> Toistuvuus:<br /> kerran  </>}
          value={frequency}
          setValue={setFrequency}
          multiplyer={frequencyMultiplyer}
          setMultiplyer={setFrequencyMultiplyer}
        />
        <TimeIntervalForm
          before={<> Joustavuus:<br /> </>}
          value={timeFlexibility}
          setValue={setTimeFlexibility}
          multiplyer={timeFlexibilityMultiplyer}
          setMultiplyer={setTimeFlexibilityMultiplyer}
          partitive={true}
        />
        <button type="submit">Lisää</button>
      </form>
    </div>
  )
}

const TimeIntervalForm = ({ value, setValue, multiplyer, setMultiplyer, before, after, partitive }) => {
  return (
    <div className="time-interval-form">
      {before}
      < input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min={partitive ? 0 : 1}
        step="any"
      />
      <label>
        <input
          type="radio"
          name={multiplyer.name}
          value={1}
          checked={multiplyer === 1}
          onChange={() => setMultiplyer(1)}
        />
        {partitive ? "päivää" : "päivässä"}
      </label>

      <label>
        <input
          type="radio"
          name={value.name}
          value={7}
          checked={multiplyer === 7}
          onChange={() => setMultiplyer(7)}
        />
        {partitive ? "viikkoa" : "viikossa"}
      </label>

      <label>
        <input
          type="radio"
          name={multiplyer.name}
          value={averageDaysInMonth}
          checked={multiplyer === averageDaysInMonth}
          onChange={() => setMultiplyer(averageDaysInMonth)}
        />
        {partitive ? "kuukautta" : "kuukaudessa"}
      </label>
      {after}
    </div>
  )
}

export default AddTask