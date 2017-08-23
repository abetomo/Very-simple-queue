'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')

const VerySimpleQueue = require(path.join(__dirname, '..', 'very_simple_queue'))

const fixturesPath = path.join(__dirname, 'fixtures')

/* global describe, test, expect, beforeEach, afterEach */
describe('very_simple_queue', () => {
  let vsq = null
  beforeEach(() => {
    vsq = new VerySimpleQueue()
  })

  const testFile = path.join(os.tmpdir(), 'test.json')
  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
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
})
