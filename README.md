# Very-simple-queue

[![npm version](https://badge.fury.io/js/%40abetomo%2Fvsq.svg)](https://badge.fury.io/js/%40abetomo%2Fvsq)
![Test](https://github.com/abetomo/Very-simple-queue/workflows/Test/badge.svg)

Very simple queue.
And a very simple SQS like queue.

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

### Use it like a SQS
```
% vsq send -d /tmp/example-sqs.db -v 'value1'
150390342-39bb8a1f-dd3c-488f-9ac8-f0b8383d9ae5
% vsq send -d /tmp/example-sqs.db -v 'value2'
150390342-1c95158b-381d-4735-b888-01e49f22bc3c
% vsq receive -d /tmp/example-sqs.db
{
  "id": "150390342-1c95158b-381d-4735-b888-01e49f22bc3c",
  "body": "value2"
}
% vsq delete -d /tmp/example-sqs.db -i "150390342-1c95158b-381d-4735-b888-01e49f22bc3c"
true
% vsq receive -d /tmp/example-sqs.db
{
  "id": "150390342-39bb8a1f-dd3c-488f-9ac8-f0b8383d9ae5",
  "body": "value1"
}
```

## Usage example of Node.js API
### Simple queue and stack
#### File
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

#### Memory
```javascript
const VerySimpleQueue = require('@abetomo/vsq')
const vsq = new VerySimpleQueue()

vsq.load(':memory:') // Specify ':memory:'

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

### SQS like
```javascript
const VerySimpleQueueLikeSQS = require('@abetomo/vsq').SQS
const vsq = new VerySimpleQueueLikeSQS()
const dbFile = '/tmp/test.sqs.db'

vsq.load(dbFile)

console.log('[send] data ID: %s', vsq.send('value1'))
console.log('[send] data Id: %s', vsq.send('value2'))

const data = vsq.receive()
console.log('[receive]: %s', JSON.stringify(data))
console.log('[delete]: %s', vsq.delete(data.id))

console.log('[receive]: %s', JSON.stringify(vsq.receive()))

/*
 * Result:
 *
 * [send] data ID: 150390381-43b055bb-cccb-446a-a460-07d4a35697bc
 * [send] data Id: 150390381-52795da6-0528-46c0-a0bd-8c535b292dc8
 * [receive]: {"id":"150390381-43b055bb-cccb-446a-a460-07d4a35697bc","body":"value1"}
 * [delete]: true
 * [receive]: {"id":"150390381-52795da6-0528-46c0-a0bd-8c535b292dc8","body":"value2"}
 */
```
