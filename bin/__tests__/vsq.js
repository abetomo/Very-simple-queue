'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const binVsq = path.join(__dirname, '..', 'vsq.js')
const testFile = path.join(os.tmpdir(), 'test.json')

/* global describe, test, expect, afterEach */
describe('bin/vsq.js', () => {
  afterEach(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
  })

  test('The current version is displayed', () => {
    const packageJson = require(path.join(__dirname, '../..', 'package.json'))
    const ret = execSync(`node ${binVsq} --version`)
    expect(ret.toString().trim()).toBe(packageJson.version)
  })

  describe('unshift and shift', () => {
    let ret = null
    test('Test the result of the command', () => {
      ret = execSync(`node ${binVsq} unshift -d ${testFile} -v v1`)
      expect(ret.toString()).toBe('')
      ret = execSync(`node ${binVsq} unshift -d ${testFile} -v v2`)
      expect(ret.toString()).toBe('')

      ret = execSync(`node ${binVsq} shift -d ${testFile}`)
      expect(ret.toString().trim()).toBe('v2')
      ret = execSync(`node ${binVsq} shift -d ${testFile}`)
      expect(ret.toString().trim()).toBe('v1')
      ret = execSync(`node ${binVsq} shift -d ${testFile}`)
      expect(ret.toString().trim()).toBe('')
    })
  })

  describe('push and pop', () => {
    let ret = null
    test('Test the result of the command', () => {
      ret = execSync(`node ${binVsq} push -d ${testFile} -v v1`)
      expect(ret.toString()).toBe('')
      ret = execSync(`node ${binVsq} push -d ${testFile} -v v2`)
      expect(ret.toString()).toBe('')

      ret = execSync(`node ${binVsq} pop -d ${testFile}`)
      expect(ret.toString().trim()).toBe('v2')
      ret = execSync(`node ${binVsq} pop -d ${testFile}`)
      expect(ret.toString().trim()).toBe('v1')
      ret = execSync(`node ${binVsq} pop -d ${testFile}`)
      expect(ret.toString().trim()).toBe('')
    })
  })

  describe('SQS-like commands', () => {
    let ret = null
    let id1 = ''
    let id2 = ''
    const idRegExp =
      /\d{9}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/

    test('Test the result of the command', () => {
      ret = execSync(`node ${binVsq} send -d ${testFile} -v v1`)
      id1 = ret.toString().trim()
      expect(id1).toMatch(idRegExp)

      ret = execSync(`node ${binVsq} send -d ${testFile} -v v2`)
      id2 = ret.toString().trim()
      expect(id2).toMatch(idRegExp)

      ret = execSync(`node ${binVsq} receive -d ${testFile}`)
      let data = JSON.parse(ret.toString().trim())
      expect(data.id).toMatch(idRegExp)
      expect(data.body).toMatch(/^v\d$/)

      ret = execSync(`node ${binVsq} delete -d ${testFile} -i ${id1}`)
      expect(ret.toString().trim()).toBe('true')

      ret = execSync(`node ${binVsq} receive -d ${testFile}`)
      data = JSON.parse(ret.toString().trim())
      expect(data.id).toBe(id2)
      expect(data.body).toBe('v2')
    })
  })
})
