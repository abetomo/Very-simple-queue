'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')

const VerySimpleQueueLikeSQS =
  require(path.join(__dirname, '..', 'very_simple_queue_like_sqs'))

const fixturesPath = path.join(__dirname, 'fixtures')
const testFile = path.join(os.tmpdir(), 'test.json')

/* global describe, test, expect, beforeEach, afterEach */
describe('very_simple_queue_like_sqs', () => {
  let vsq = null
  beforeEach(() => {
    vsq = new VerySimpleQueueLikeSQS()
  })

  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
  })

  test('vsq is instanceOf VerySimpleQueue', () => {
    expect(vsq).toBeInstanceOf(VerySimpleQueueLikeSQS)
  })

  describe('_load(filePath)', () => {
    test('Files with correct content', () => {
      expect(vsq._load(path.join(fixturesPath, 'data_file_like_sqs.json')))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: {
            id1: '1',
            id2: '2',
            id3: '3'
          }
        })
    })

    test('Files that do not exist', () => {
      expect(vsq._load(testFile))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: {}
        })
    })

    test('File with incorrect content (name)', () => {
      expect(() => {
        vsq._load(path.join(fixturesPath, 'name_invalid_file.json'))
      })
        .toThrowError(new Error('not a data file of VerySimpleQueueLikeSQS'))
    })

    test('File with incorrect content (value)', () => {
      expect(() => {
        vsq._load(path.join(fixturesPath, 'value_invalid_file_like_sqs.json'))
      })
        .toThrowError(new Error('not a data file of VerySimpleQueueLikeSQS'))
    })
  })

  describe('load(filePath)', () => {
    test('Files with correct content', () => {
      const expected = {
        name: 'VerySimpleQueueLikeSQS',
        value: {
          id1: '1',
          id2: '2',
          id3: '3'
        }
      }
      const filePath = path.join(fixturesPath, 'data_file_like_sqs.json')
      expect(vsq.load(filePath)).toEqual(expected)
      expect(vsq.data).toEqual(expected)
      expect(vsq.filePath).toEqual(filePath)
    })
  })

  describe('size()', () => {
    test('queue is loaded', () => {
      vsq.load(path.join(fixturesPath, 'data_file_like_sqs.json'))
      expect(vsq.size()).toBe(3)
    })

    test('queue is not loaded', () => {
      vsq.load(testFile)
      expect(vsq.size()).toBe(0)
    })
  })

  describe('id()', () => {
    test('Return timestamp(parseInt(microsecond / 10,000)) + uuid', () => {
      expect(vsq.id())
        .toMatch(/\d{9}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
    })
  })

  describe('send(data)', () => {
    test('send', () => {
      vsq.load(testFile)

      vsq.id = () => 333
      expect(vsq.send('hoge')).toBe(333)
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: { 333: 'hoge' }
        })

      vsq.id = () => 444
      expect(vsq.send('fuga')).toBe(444)
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: {
            333: 'hoge',
            444: 'fuga'
          }
        })
    })
  })

  describe('receive()', () => {
    test('receive', () => {
      vsq.load(testFile)
      expect(vsq.size()).toBe(0)
      expect(vsq.receive()).toBeNull()

      vsq.id = () => '111'
      const hogeId = vsq.send('hoge')
      vsq.id = () => '222'
      const fugaId = vsq.send('fuga')
      vsq.id = () => '333'
      const piyoId = vsq.send('piyo')

      expect(vsq.size()).toBe(3)
      expect(vsq.receive()).toEqual({ id: '111', body: 'hoge' })
      expect(vsq.size()).toBe(3)
      expect(vsq.receive()).toEqual({ id: '111', body: 'hoge' })
      expect(vsq.size()).toBe(3)
      expect(vsq.receive()).toEqual({ id: '111', body: 'hoge' })

      const value = {}
      value[hogeId] = 'hoge'
      value[fugaId] = 'fuga'
      value[piyoId] = 'piyo'
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: value
        })
    })
  })

  describe('delete()', () => {
    test('delete', () => {
      vsq.load(testFile)
      expect(vsq.delete()).toBeNull()
      expect(vsq.delete('aaa')).toBeNull()

      const hogeId = vsq.send('hoge')
      const fugaId = vsq.send('fuga')
      const piyoId = vsq.send('piyo')

      expect(vsq.delete(hogeId)).toBeTruthy()
      expect(vsq.size()).toBe(2)

      const value = {}
      value[fugaId] = 'fuga'
      value[piyoId] = 'piyo'
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: value
        })

      expect(vsq.delete(fugaId)).toBeTruthy()
      expect(vsq.size()).toBe(1)

      expect(vsq.delete(piyoId)).toBeTruthy()
      expect(vsq.size()).toBe(0)

      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueueLikeSQS',
          value: {}
        })
    })
  })
})

describe('very_simple_queue_like_sqs on memory', () => {
  const vsq = new VerySimpleQueueLikeSQS()
  vsq.id = () => '111'

  test('send, receive and delete on memory', () => {
    expect(vsq.load(':memory:')).toEqual({
      name: 'VerySimpleQueueLikeSQS',
      value: {}
    })
    expect(vsq.send('hoge')).toEqual('111')
    expect(vsq.size()).toBe(1)

    expect(vsq.receive()).toEqual({ id: '111', body: 'hoge' })

    expect(vsq.delete('111')).toBeTruthy()
    expect(vsq.size()).toBe(0)

    const filePath = '/VerySimpleQueueLikeSQS'
    expect(vsq.filePath).toEqual(filePath)
    expect(fs.existsSync(filePath)).toBeFalsy()
  })

  // wip
})
