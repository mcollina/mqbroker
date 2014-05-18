
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

test('publish event', function(t) {
  t.plan(1)

  var broker = mqbroker()
    , msg    = {
          cmd: 'publish'
        , topic: 'hello'
        , payload: 'world'
      }

  broker.on('publish', function(data) {
    t.deepEqual(data, msg)
  })

  broker.stream().end(msg)
})

test('subscribe event', function(t) {
  t.plan(1)

  var broker = mqbroker()
    , msg    = {
          cmd: 'subscribe'
        , topic: 'hello'
      }

  broker.on('subscribe', function(data) {
    t.deepEqual(data, msg)
  })

  broker.stream().end(msg)
})

test('unsubscribe', function(t) {
  var broker = mqbroker()
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
    sub.cmd = 'unsubscribe'
    stream.write(sub, function() {
      broker.stream().end(msg, function() {
        t.end()
      })
    })
  })

  stream.on('data', function(data) {
    t.ok(false, 'never emits data')
  })
})
