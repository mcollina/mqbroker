
var mqstreams = require('mqstreams')
  , duplexer  = require('reduplexer')
  , through   = require('through2')

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

MQBroker.prototype.stream = function() {

  var readable = this._mq.readable()

    , writable = through.obj({
        highWaterMark: 1
      }, function(chunk, enc, done) {

        switch(chunk.cmd) {
          case "subscribe":
            readable.subscribe(chunk.topic)
            break
          case "publish":
            this.push(chunk)
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
