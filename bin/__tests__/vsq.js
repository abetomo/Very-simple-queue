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

  describe('Validity of argument', () => {
    describe('unshift', () => {
      const expected = `
  Usage: unshift [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
    -v, --value [VALUE]      Data to be added (string)
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} unshift`,
        `node ${binVsq} unshift -d ${testFile}`,
        `node ${binVsq} unshift -v value`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('push', () => {
      const expected = `
  Usage: push [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
    -v, --value [VALUE]      Data to be added (string)
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} push`,
        `node ${binVsq} push -d ${testFile}`,
        `node ${binVsq} push -v value`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('shift', () => {
      const expected = `
  Usage: shift [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} shift`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('pop', () => {
      const expected = `
  Usage: pop [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} pop`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('send', () => {
      const expected = `
  Usage: send [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueueLikeSQS
    -v, --value [VALUE]      Data to be added (string)
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} send`,
        `node ${binVsq} send -d ${testFile}`,
        `node ${binVsq} send -v value`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('receive', () => {
      const expected = `
  Usage: receive [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueueLikeSQS
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} receive`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('delete', () => {
      const expected = `
  Usage: delete [options]

  Options:

    -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueueLikeSQS
    -i, --id [DATA_ID]       Id of the data to delete
    -h, --help               output usage information
`
      ;[
        `node ${binVsq} delete`,
        `node ${binVsq} delete -d ${testFile}`,
        `node ${binVsq} delete -i id`
      ].forEach((command) => {
        expect(() => execSync(command)).toThrow()
        try {
          execSync(command)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })
  })
})
