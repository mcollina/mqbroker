mqbroker&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/mqbroker.png)](https://travis-ci.org/mcollina/mqbroker)
=================================================================

Barebone Publish-Subscribe Broker node style, based on
[mqemitter](http://github.com/mcollina/mqemitter) and
[mqstreams](http://github.com/mcollina/mqstreams).

  * <a href="#install">Installation</a>
  * <a href="#basic">Basic Example</a>
  * <a href="#licence">Licence &amp; copyright</a>

<a name="install"></a>
## Installation

```bash
npm install mqbroker mqemitter --save
```

<a name="basic"></a>
## Basic Example

```js
var broker = require('mqbroker')()
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
  console.log(data)
})
```

## LICENSE

Copyright (c) 2014, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
