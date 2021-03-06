
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
  t.plan(2)

  var broker = mqbroker()
    , msg    = {
          cmd: 'publish'
        , topic: 'hello'
        , payload: 'world'
      }
    , stream  = broker.stream()

  broker.on('publish', function(data, client) {
    t.deepEqual(data, msg)
    t.equal(client, stream)
  })

  stream.end(msg)
})

test('subscribe event', function(t) {
  t.plan(2)

  var broker = mqbroker()
    , msg    = {
          cmd: 'subscribe'
        , topic: 'hello'
      }
    , stream  = broker.stream()

  broker.on('subscribe', function(data, client) {
    t.deepEqual(data, msg)
    t.equal(client, stream)
  })

  stream.end(msg)
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

test('unsubscribe event', function(t) {
  t.plan(2)

  var broker = mqbroker()
    , msg    = {
          cmd: 'unsubscribe'
        , topic: 'hello'
      }
    , stream  = broker.stream()

  broker.on('unsubscribe', function(data, client) {
    t.deepEqual(data, msg)
    t.equal(client, stream)
  })

  stream.end(msg)
})

test('error with no topic', function(t) {
  t.plan(1)

  var broker = mqbroker()
    , msg    = {
          cmd: 'publish'
        , payload: 'world'
      }
    , stream  = broker.stream()

  stream.on('error', function(err) {
    t.equal(err.message, 'no topic specified')
  })

  stream.end(msg)
})
