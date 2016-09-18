const url = 'http://localhost:3000/stream'
const request = require('request')

jasmine.getEnv().defaultTimeoutInterval = 20000;

describe('stream', ()=>{

  describe('GET /', ()=>{
    it('returns a list of active streams', (done)=>{
      request.get(url, (error, response, body)=>{
        expect(body.length).toBeDefined()
        done()
      })
    })
  })

  describe('GET /:streamId', ()=>{
    describe(':streamId does not exist', ()=>{
      const nonExistantStreamSufix = '/0'
      it('returns null', (done)=>{
        request.get(url + nonExistantStreamSufix, (error, response, body)=>{
          expect(body).toBe('null')
          done()
        })
      })
    })
    describe(':streamId exists', ()=>{
      const existantStreamSufix = '/1'
      it('returns a page with a video element', (done)=>{
        request.get(url + existantStreamSufix, (error, response, body)=>{
          expect(body).toContain('</video>')
          done()
        })
      })
      it('creates a peer', (done)=>{
        done()
      })
      it('connects parent and child on a tree', (done)=>{
        done()
      })
    })
  })

  describe('GET /new', ()=>{
    const newStreamSufix = '/new'
    it('returns a form',(done)=>{
      request.get(url + newStreamSufix, (error, response, body)=>{
        expect(body).toContain('</form>')
        done()
      })
    })
  })

  describe('POST /:streamId', ()=>{
    const newStreamSufix = '/3'
    it('creates a peer',(done)=>{
      newStream = {
        url: url + newStreamSufix,
        form:{
          title: 'test stream',
          location: 'here',
          plataform: 'ubuntu',
          candidates: 'udp:1234'
        }
      }
      request.post(newStream, (error, response, body)=>{
        expect(response.statusCode).toBe(200)
        done()
      })
    })
    it('creates a stream',(done)=>{
      done()
    })
    it('returns the streamer application',(done)=>{
      request.post(url + newStreamSufix, (error, response, body)=>{
        expect(body).toContain('streamer.bundle.js')
        done()
      })
    })
  })
})
