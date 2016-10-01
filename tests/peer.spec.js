'use strict'
const Peer = require('src/peer')
describe('Peer', ()=>{
  it('is a class', (done)=>{
    const peer = new Peer()
    expect(peer).not.toBeNull()
    done()
  })
  it('has a public method start', (done)=>{
    const peer = new Peer()
    expect(peer.start).toBeDefined()
    done()
  })
})
