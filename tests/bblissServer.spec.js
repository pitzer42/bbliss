'use strict'

const bbliss = require('../server/bblissServer')

describe('Fluxo Server', ()=>{
  it('creates streams', done=>{
    const title = 'test'
    const location = {lat:0, lng:0}
    const root = 'rootid'
    const expectStreamToBeInserted = stream=>{
      expect(stream._id).toBeDefined()
      done()
    }
    bbliss.insertStream(title, location, root, expectStreamToBeInserted)
  })
  it('gets a stream by name', done=>{
    const title = 'test'
    const expectStreamNotToBeNull = stream=>{
      expect(stream).toBeTruthy()
      done()
    }
    bbliss.findStream(title, expectStreamNotToBeNull)
  })
  it('adds peers to a stream', done=>{
    const title = 'test'
    const location = {lat:0, lng:0}
    const peerId = 'testpeer'
    const expectStreamToHaveMoreThanOnePeer = peers=>{
      expect(peers.length).toBeGreaterThan(1)
      done()
    }
    bbliss.addPeer(title, location, peerId)
    bbliss.availablePeers(title, expectStreamToHaveMoreThanOnePeer)
  })
  it('pops peers from a stream', done=>{
    const title = 'test'
    let before = 0
    let after = 0
    const getPeerCountBefore = peers =>{
      before = peers.length
    }
    const getPeerCountAfter = peers=>{
      after = peers.length
      expect(before).toBeGreaterThan(after)
      done()
    }
    bbliss.availablePeers(title, getPeerCountBefore)
    bbliss.popPeer(title)
    bbliss.availablePeers(title, getPeerCountAfter)
  })
})
