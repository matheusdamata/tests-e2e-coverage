const { once } = require('events')
const http = require('http')

const DEFAULT_USER = {
  username: 'matheus',
  password: '123'
}

const routes = {
  '/contact:get': (req, res) => {
    res.write('contact us page')
    return res.end()
  },
  // curl -i -X POST H "Content-Type: application/json" -d "{\"username\": \"matheus\", \"password\": \"123\"}" localhost:3000/login
  '/login:post': async (req, res) => {
    const user = JSON.parse(await once(req, "data"))
    const toLower = (text) => text.toLowerCase()

    if (toLower(user.username) !== toLower(DEFAULT_USER.username) ||
        user.password !== DEFAULT_USER.password
    ) {
      res.writeHead(401)
      res.end('username or password incorrect')
      return
    }

    return res.end('logged in success')
  },
  default(_, res) {
    res.writeHead(404)
    return res.end('not found')
  }
}

function handler(req, res) {
  const { url, method } = req

  const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`

  const chosen = routes[routeKey] || routes.default

  return chosen(req, res)
}

const app = http.createServer(handler)

app.listen(3000, () => console.log('Running at 3000'))

module.exports = app