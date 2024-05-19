const { describe, it, after, before } = require('mocha')
const supertest = require('supertest')
const assert = require('assert')

describe('API suite test', () => {
  let app
  before((done) => {
    app = require('./api')
    app.once('listening', done)
  })

  after(done => app.close(done))

  describe('/contact:get', () => {
    it('should request the contact route and return HTTP Status 200', async () => {
      const res = await supertest(app).get('/contact').expect(200)

      assert.strictEqual(res.text, 'contact us page')
    })
  })

  describe('/login:post', () => {
    it('should request the login and return HTTP Status 200', async () => {
      const res = await supertest(app)
                    .post('/login')
                    .send({
                      username: 'matheus',
                      password: '123'
                    })
                    .expect(200)

      assert.strictEqual(res.text, 'logged in success')
    })

    it('should request the login and return HTTP Status 401', async () => {
      const res = await supertest(app)
                    .post('/login')
                    .send({
                      username: 'mts',
                      password: '12345'
                    })
                    .expect(401)

      assert.ok(res.unauthorized)
      assert.strictEqual(res.text, 'username or password incorrect')
    })

    
  })

  describe('/hi:get - 404', () => {
    it('should request and existing route and return HTTP Status 404', async () => {
      const res = await supertest(app).get('/hi').expect(404)

      assert.strictEqual(res.text, 'not found')
    })
  })
})