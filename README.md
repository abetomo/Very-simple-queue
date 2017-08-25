# Very-simple-queue

Very simple queue

## install
```
% npm install @abetomo/vsq
```

## Command example
### Use it like a queue
```
% vsq push -d /tmp/example.db -v 'value1'
% vsq push -d /tmp/example.db -v 'value2'
% vsq shift -d /tmp/example.db
value1
% vsq shift -d /tmp/example.db
value2
```

### Use it like a stack
```
% vsq push -d /tmp/example-stack.db -v '{"key": "value1"}'
% vsq push -d /tmp/example-stack.db -v '{"key": "value2"}'
% vsq pop -d /tmp/example-stack.db
{"key": "value2"}
% vsq pop -d /tmp/example-stack.db
{"key": "value1"}
```

## Usage example of Node.js API
```javascript
const VerySimpleQueue = require('@abetomo/vsq')
const vsq = new VerySimpleQueue()
const dbFile = '/tmp/test.db'

vsq.load(dbFile)

console.log('[unshift] data size: %s', vsq.unshift('value1'))
console.log('[unshift] data size: %s', vsq.unshift('value2'))
console.log('[push] data size: %s', vsq.push('value3'))
console.log('[push] data size: %s', vsq.push('value4'))

console.log('[shift]: %s', vsq.shift())
console.log('[shift]: %s', vsq.shift())
console.log('[pop]: %s', vsq.pop())
console.log('[pop]: %s', vsq.pop())

/*
 * Result:
 *
 * [unshift] data size: 1
 * [unshift] data size: 2
 * [push] data size: 3
 * [push] data size: 4
 * [shift]: value2
 * [shift]: value1
 * [pop]: value4
 * [pop]: value3
 */
```
