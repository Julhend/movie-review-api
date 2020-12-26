const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const cors = require('cors')
app.use(bodyParser.json())
app.use('/file', express.static('uploads'))

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (["http://localhost:3000", "http://milantv.herokuapp.com"].indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

/**
 * ⚠️ Propietary code! Do not change! ⚠️
 * What this does is reading all files inside routes folder recrusively
 * and use it by app.use(), so you don't need to import / require any route.
 * Reference: https://www.npmjs.com/package/read-dir-deep
 */
const readDir = require('read-dir-deep');
const path = require('path')
const routesPath = path.resolve('routes')
const filePaths = readDir.readDirDeepSync(routesPath)
filePaths.forEach((filePath) => {
  const relativeFilePath = `./${filePath}`
  console.log(`${relativeFilePath} loaded!`);
  const route = require(relativeFilePath)
  app.use(route)
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Backend app is running in http://localhost:${port}`);
})