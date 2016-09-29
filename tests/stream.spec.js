'use strict'
const url = 'http://localhost:3000/api'
const request = require('request')
const fluxo = require('../src/fluxoServerAPI')

jasmine.getEnv().defaultTimeoutInterval = 20000;

describe('Fluxo API', ()=>{

  describe('GET /', ()=>{
    it('returns a list of active streams', (done)=>{
      request.get(url, (error, response, body)=>{
        expect(body.length).toBeDefined()
        done()
      })
    })
  })

  describe('POST /new', ()=>{
    const newStreamSufix = '/new'
    const newStream = {
      url: url + newStreamSufix,
      form:{
        title: 'test stream',
        location: 'here',
        plataform: 'ubuntu',
        candidates: 'udp:1234'
      }
    }
    it('creates a peer, a stream and returns the streamer',(done)=>{
      request.post(newStream, (error, response, body)=>{
        expect(response.statusCode).toBe(200)
        done()
      })
    })
  })
})
