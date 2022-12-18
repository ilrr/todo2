const { Image, RoiManager } = require("image-js")

/**
 * 
 * @param {Image} listImage  
 * @returns {Promise<Image[]>}
 */
const splitListImage = async listImage => {
  const filtered = listImage
    .grey()
    .blurFilter()
    .sobelFilter()
    //.colorDepth(8)
  
  const arr = [...Array(filtered.height).keys()].map(i => filtered.getRow(i).reduce((acc, val) => acc + val, 0))
  // const farr = filtered.getMatrix()
  // const arr = farr.map(row => row.reduce((acc, val) => acc + val, 0))
  const maxV = arr.reduce((acc, val) => val > acc ? val : acc, 0)
  const minV = arr.reduce((acc, val) => val < acc ? val : acc, arr[0])
  const normalizedArray = arr.map(el => (el - minV) / (maxV - minV))
  const splitIndexes = []
  let s = 0
  let e = 0
  let t = true
  for (let [row, value] of normalizedArray.entries()) {
    if (value < 0.3) {
      t = true
    } else {
      if (t && row - s >= listImage.height / 50) {
        splitIndexes.push(Math.floor((s + row) / 2))
        t = false
      } 
      s = row
    }
    e = row
  }
  splitIndexes.push(Math.floor((s + e) / 2))
  console.log(splitIndexes)

  return splitIndexes
    .map((v, i, a) =>
      listImage.crop({
        y: a[i - 1],
        height: v - (i ? a[i - 1] : 0)
      }))

  // splitIndexes
  //   .forEach((v, i, a) =>
  //     listImage.crop({
  //       y: a[i - 1],
  //       height: v - (i ? a[i - 1] : 0)
  //     })
  //       .save(`img/test_imgs/output/${i}.jpg`))
}

module.exports = splitListImage