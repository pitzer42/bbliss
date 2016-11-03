'use strict'

const fluxo = require('../server/fluxoServer')

describe('Fluxo Server', ()=>{
  it('creates streams', done=>{
    const title = 'test'
    const location = {lat:0, lng:0}
    const root = 'rootid'
    const expectStreamToBeInserted = stream=>{
      expect(stream._id).toBeDefined()
      done()
    }
    fluxo.insertStream(title, location, root, expectStreamToBeInserted)
  })
  it('gets a stream by name', done=>{
    const title = 'test'
    const expectStreamNotToBeNull = stream=>{
      expect(stream).toBeTruthy()
      done()
    }
    fluxo.findStream(title, expectStreamNotToBeNull)
  })
  it('adds peers to a stream', done=>{
    const title = 'test'
    const location = {lat:0, lng:0}
    const peerId = 'testpeer'
    const expectStreamToHaveMoreThanOnePeer = peers=>{
      expect(peers.length).toBeGreaterThan(1)
      done()
    }
    fluxo.addPeer(title, location, peerId)
    fluxo.availablePeers(title, expectStreamToHaveMoreThanOnePeer)
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
    fluxo.availablePeers(title, getPeerCountBefore)
    fluxo.popPeer(title)
    fluxo.availablePeers(title, getPeerCountAfter)
  })
})
