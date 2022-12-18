import { createImmutableStateInvariantMiddleware } from "@reduxjs/toolkit"
import axios from "axios"
import { useState } from "react"
import ReactCrop from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import { baseUrl } from "../services/api"

const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState()
  const [crop, setCrop] = useState()
  const [splittedImages, setSplittedImages] = useState([])
  const [wait, setWait] = useState(false)

  const onImageChange = event => {
    const imgUrl = URL.createObjectURL(event.target.files[0])
    setImageUrl(imgUrl)
  }

  const sendImage = () => {
    const w = document.getElementById("img").naturalWidth / 100
    const h = document.getElementById("img").naturalHeight / 100
    const canvas = document.createElement("canvas")
    let c = { x: 0, y: 0, width: 100, height: 100, unit: "%" }
    if (c) c = c
    canvas.width = c.width * w
    canvas.height = c.height * h
    const context = canvas.getContext("2d")
    context.drawImage(
      document.getElementById("img"),
      c.x * w,
      c.y * h,
      c.width * w,
      c.height * h,
      0,
      0,
      c.width * w,
      c.height * h
    )

    setWait(true)

    const formData = new FormData()
    canvas.toBlob(blob => {
      formData.append("file", blob)
      axios
        .post(`${baseUrl}/img`, formData)
        .then(({ data }) => { setSplittedImages(data); setWait(false) })
    }, "jpeg", ".9")
    //setImageUrl(null)

  }

  const SplittedImage = () => {
    return (
      <div>
        {splittedImages.map(data => <div style={{ marginBottom: "20px" }}><img alt="" src={data} style={{ maxWidth: "100%" }} /></div>)}
      </div>
    )
  }

  if (!wait)
    return (
      <div>
        {!imageUrl ? <input type="file" accept="image/*" onChange={onImageChange} /> : ""}
        {!splittedImages[0] ?
          <div style={{ width: "90%", margin: "5%" }}>
            {imageUrl ?
              <ReactCrop crop={crop} onChange={(_, per) => setCrop(per)} style={{ width: "100%" }}>
                <img id="img" src={imageUrl} style={{ width: "100%" }} alt="" />
              </ReactCrop> : ""}<br />
            <button style={{ fontSize: "100px" }} onClick={sendImage}>&mdash;&gt;</button><br />
          </div>
          :
          <SplittedImage />}
      </div>
    )
  return <div>ODOTA :)</div>
}
export default UploadImage