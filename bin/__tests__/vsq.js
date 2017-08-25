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
    ret = execSync(`node ${binVsq} unshift -d ${testFile} -v 'v1'`)
    expect(ret.toString()).toBe('')
    ret = execSync(`node ${binVsq} unshift -d ${testFile} -v 'v2'`)
    expect(ret.toString()).toBe('')

    ret = execSync(`node ${binVsq} shift -d ${testFile}`)
    expect(ret.toString().trim()).toBe('v2')
    ret = execSync(`node ${binVsq} shift -d ${testFile}`)
    expect(ret.toString().trim()).toBe('v1')
    ret = execSync(`node ${binVsq} shift -d ${testFile}`)
    expect(ret.toString().trim()).toBe('')
  })

  describe('push and pop', () => {
    let ret = null
    ret = execSync(`node ${binVsq} push -d ${testFile} -v 'v1'`)
    expect(ret.toString()).toBe('')
    ret = execSync(`node ${binVsq} push -d ${testFile} -v 'v2'`)
    expect(ret.toString()).toBe('')

    ret = execSync(`node ${binVsq} pop -d ${testFile}`)
    expect(ret.toString().trim()).toBe('v2')
    ret = execSync(`node ${binVsq} pop -d ${testFile}`)
    expect(ret.toString().trim()).toBe('v1')
    ret = execSync(`node ${binVsq} pop -d ${testFile}`)
    expect(ret.toString().trim()).toBe('')
  })
})
