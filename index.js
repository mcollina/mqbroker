
var mqstreams = require('mqstreams')
  , duplexer  = require('reduplexer')
  , through   = require('through2')
  , inherits  = require('inherits')
  , events    = require('events')

function MQBroker(mq) {
  if (!(this instanceof MQBroker))
    return new MQBroker(mq)

  if (!mq) {
    try {
      mq = require('mqemitter')()
    } catch(err) {
      console.err('missing mqemitter, install it with')
      console.err('npm install mqemitter --save')
      process.exit(-1)
    }
  }

  this._mq = mqstreams(mq)
}

inherits(MQBroker, events.EventEmitter)

MQBroker.prototype.stream = function() {

  var readable = this._mq.readable()
    , that     = this

    , writable = through.obj({
        highWaterMark: 1
      }, function(chunk, enc, done) {

        switch(chunk.cmd) {
          case 'subscribe':
            readable.subscribe(chunk.topic)
            that.emit('subscribe', chunk)
            break
          case 'publish':
            this.push(chunk)
            that.emit('publish', chunk)
            break
        }
        done()

      })

  writable.pipe(this._mq.writable())

  return duplexer(writable, readable, {
      objectMode: true
    , highWaterMark: 1
  })
}

module.exports = MQBroker
