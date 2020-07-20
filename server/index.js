const { loadNuxt, build } = require('nuxt')
const bodyParser = require('body-parser')

const app = require('express')()

require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

// Import passport setup for twitter
require('./passport')(app)

// Import api setup
require('./api')(app)

async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }
  // Listen the server
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

start()
