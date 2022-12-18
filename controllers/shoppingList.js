const router = require('express').Router()
const { Image } = require("image-js")
const splitListImage = require('../img/img')

const fileUpload = require('express-fileupload')
router.use(fileUpload())

router.post('/', async (req, res) => {
  console.log(req.files.file.data)
  Image
    .load(req.files.file.data)
    .then(image => {
      splitListImage(image)
        .then(images =>
          res
            .status(200)
            .json(
              images
                .map(images => images.toDataURL())
            ))
    })
})

module.exports = router