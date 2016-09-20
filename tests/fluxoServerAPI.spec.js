'use strict'
const storage = require('../src/storage')
const fluxo = require('../src/fluxoServerAPI')

jasmine.getEnv().defaultTimeoutInterval = 20000;

describe('Fluxo Server API', ()=>{
  const streamTitle = 'test'
  it('inserts peers', (done)=>{
    fluxo.insertPeer('here', 'linux', 'udp:123', (newPeer)=>{
      expect(newPeer._id).toBeDefined()
      done()
    })
  })
  it('inserts streams', (done)=>{
    const root = {_id: 0}
    fluxo.insertStream(streamTitle, root, (newStream)=>{
      expect(newStream._id).toBeDefined()
      done()
    })
  })
  it('finds a stream by title', (done)=>{
    fluxo.findStream(streamTitle, (result)=>{
      expect(result.title).toBe(streamTitle)
      done()
    })
  })

  it('lists all the active streams', (done)=>{
    fluxo.listStreams((results)=>{
      expect(results.length).toBeDefined()
      done()
    })
  })
})
