'use strict'

const os = require('os')
const { existsSync, unlinkSync } = require('node:fs')
const path = require('path')

const VerySimpleQueue = require(path.join(__dirname, '..', 'very_simple_queue'))

const fixturesPath = path.join(__dirname, 'fixtures')
const testFile = path.join(os.tmpdir(), 'test.json')

/* global describe, test, expect, beforeEach, afterEach */
describe('very_simple_queue', () => {
  let vsq = null
  beforeEach(() => {
    vsq = new VerySimpleQueue()
  })

  afterEach(() => {
    if (existsSync(testFile)) unlinkSync(testFile)
  })

  test('vsq is instanceOf VerySimpleQueue', () => {
    expect(vsq).toBeInstanceOf(VerySimpleQueue)
  })

  describe('_load(filePath)', () => {
    test('Files with correct content', () => {
      expect(vsq._load(path.join(fixturesPath, 'data_file.json')))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['1', '2', '3']
        })
    })

    test('Files that do not exist', () => {
      expect(vsq._load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: []
        })
    })

    test('File with incorrect content (name)', () => {
      expect(() => {
        vsq._load(path.join(fixturesPath, 'name_invalid_file.json'))
      })
        .toThrowError(new Error('not a data file of VerySimpleQueue'))
    })

    test('File with incorrect content (value)', () => {
      expect(() => {
        vsq._load(path.join(fixturesPath, 'value_invalid_file.json'))
      })
        .toThrowError(new Error('not a data file of VerySimpleQueue'))
    })
  })

  describe('load(filePath)', () => {
    test('Files with correct content', () => {
      const expected = {
        name: 'VerySimpleQueue',
        value: ['1', '2', '3']
      }
      const filePath = path.join(fixturesPath, 'data_file.json')
      expect(vsq.load(filePath)).toEqual(expected)
      expect(vsq.data).toEqual(expected)
      expect(vsq.filePath).toEqual(filePath)
    })
  })

  describe('size()', () => {
    test('queue is loaded', () => {
      vsq.load(path.join(fixturesPath, 'data_file.json'))
      expect(vsq.size()).toBe(3)
    })

    test('queue is not loaded', () => {
      vsq.load(testFile)
      expect(vsq.size()).toBe(0)
    })
  })

  describe('unshift(data)', () => {
    test('unshift', () => {
      vsq.load(testFile)

      expect(vsq.unshift('hoge')).toBe(1)
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['hoge']
        })

      expect(vsq.unshift('fuga')).toBe(2)
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['fuga', 'hoge']
        })
    })
  })

  describe('push(data)', () => {
    test('push', () => {
      vsq.load(testFile)

      expect(vsq.push('hoge')).toBe(1)
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['hoge']
        })

      expect(vsq.push('fuga')).toBe(2)
      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['hoge', 'fuga']
        })
    })
  })

  describe('shift()', () => {
    test('shift', () => {
      vsq.load(testFile)
      vsq.push('hoge')
      vsq.push('fuga')
      vsq.push('piyo')

      expect(vsq.size()).toBe(3)
      expect(vsq.shift()).toBe('hoge')
      expect(vsq.size()).toBe(2)
      expect(vsq.shift()).toBe('fuga')
      expect(vsq.size()).toBe(1)

      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['piyo']
        })

      expect(vsq.shift()).toBe('piyo')
      expect(vsq.size()).toBe(0)

      expect(vsq.shift()).toBeNull()
      expect(vsq.size()).toBe(0)
    })
  })

  describe('pop()', () => {
    test('pop', () => {
      vsq.load(testFile)
      vsq.push('hoge')
      vsq.push('fuga')
      vsq.push('piyo')

      expect(vsq.size()).toBe(3)
      expect(vsq.pop()).toBe('piyo')
      expect(vsq.size()).toBe(2)
      expect(vsq.pop()).toBe('fuga')
      expect(vsq.size()).toBe(1)

      expect(vsq.load(testFile))
        .toEqual({
          name: 'VerySimpleQueue',
          value: ['hoge']
        })

      expect(vsq.pop()).toBe('hoge')
      expect(vsq.size()).toBe(0)

      expect(vsq.pop()).toBeNull()
      expect(vsq.size()).toBe(0)
    })
  })
})

describe('very_simple_queue on memory', () => {
  const vsq = new VerySimpleQueue()

  test('push and pop on memory', () => {
    expect(vsq.load(':memory:')).toEqual({
      name: 'VerySimpleQueue',
      value: []
    })
    expect(vsq.push('1')).toEqual(1)
    expect(vsq.push('2')).toEqual(2)
    expect(vsq.size()).toBe(2)
    expect(vsq.pop()).toEqual('2')
    expect(vsq.pop()).toEqual('1')
    expect(vsq.size()).toBe(0)

    expect(vsq.filePath.startsWith('/VerySimpleQueue-')).toBeTruthy()
  })

  // wip
})
