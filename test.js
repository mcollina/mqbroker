
var test      = require('tap').test
  , mqemitter = require('mqemitter')
  , mqbroker  = require('./')

function subscribeAndPublish(t, mq) {
  t.plan(1)

  var broker = mqbroker(mq)
    , stream = broker.stream()
    , sub    = {
          cmd: 'subscribe'
        , topic: 'hello'
      }
    , msg    = {
          cmd: 'publish'
        , topic: 'hello'
        , payload: 'world'
      }

  stream.write(sub, function() {
    broker.stream().end(msg)
  })

  stream.on('data', function(data) {
    t.deepEqual(data, msg)
  })
}

test('subscribing and publishing', function(t) {
  subscribeAndPublish(t)
})

test('subscribing and publishing with a given mq', function(t) {
  subscribeAndPublish(t, mqemitter())
})
