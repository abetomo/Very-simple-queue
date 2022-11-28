'use strict'

const os = require('os')
const { existsSync, unlinkSync } = require('node:fs')
const path = require('path')
const { execFileSync } = require('child_process')

const binVsq = path.join(__dirname, '..', 'vsq.js')
const testFile = path.join(os.tmpdir(), 'test.json')

const execCmd = (options) => {
  return execFileSync('node', [binVsq].concat(options))
}

/* global describe, test, expect, afterEach */
describe('bin/vsq.js', () => {
  afterEach(() => {
    if (existsSync(testFile)) unlinkSync(testFile)
  })

  test('The current version is displayed', () => {
    const packageJson = require(path.join(__dirname, '../..', 'package.json'))
    const ret = execCmd(['--version'])
    expect(ret.toString().trim()).toBe(packageJson.version)
  })

  describe('unshift and shift', () => {
    let ret = null
    test('Test the result of the command', () => {
      ret = execCmd(['unshift', '-d', testFile, '-v', 'v1'])
      expect(ret.toString()).toBe('')
      ret = execCmd(['unshift', '-d', testFile, '-v', 'v2'])
      expect(ret.toString()).toBe('')

      ret = execCmd(['shift', '-d', testFile])
      expect(ret.toString().trim()).toBe('v2')
      ret = execCmd(['shift', '-d', testFile])
      expect(ret.toString().trim()).toBe('v1')
      ret = execCmd(['shift', '-d', testFile])
      expect(ret.toString().trim()).toBe('')
    })
  })

  describe('push and pop', () => {
    let ret = null
    test('Test the result of the command', () => {
      ret = execCmd(['push', '-d', testFile, '-v', 'v1'])
      expect(ret.toString()).toBe('')
      ret = execCmd(['push', '-d', testFile, '-v', 'v2'])
      expect(ret.toString()).toBe('')

      ret = execCmd(['pop', '-d', testFile])
      expect(ret.toString().trim()).toBe('v2')
      ret = execCmd(['pop', '-d', testFile])
      expect(ret.toString().trim()).toBe('v1')
      ret = execCmd(['pop', '-d', testFile])
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
      ret = execCmd(['send', '-d', testFile, '-v', 'v1'])
      id1 = ret.toString().trim()
      expect(id1).toMatch(idRegExp)

      ret = execCmd(['send', '-d', testFile, '-v', 'v2'])
      id2 = ret.toString().trim()
      expect(id2).toMatch(idRegExp)

      ret = execCmd(['receive', '-d', testFile])
      let data = JSON.parse(ret.toString().trim())
      expect(data.id).toMatch(idRegExp)
      expect(data.body).toMatch(/^v\d$/)

      ret = execCmd(['delete', '-d', testFile, '-i', id1])
      expect(ret.toString().trim()).toBe('true')

      ret = execCmd(['receive', '-d', testFile])
      data = JSON.parse(ret.toString().trim())
      expect(data.id).toBe(id2)
      expect(data.body).toBe('v2')
    })
  })

  describe('Validity of argument', () => {
    describe('unshift', () => {
      const expected = `Usage: vsq unshift [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
  -v, --value [VALUE]      Data to be added (string)
  -h, --help               display help for command
`
      ;[
        ['unshift'],
        ['unshift', '-d', testFile],
        ['unshift', '-v', 'value']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('push', () => {
      const expected = `Usage: vsq push [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
  -v, --value [VALUE]      Data to be added (string)
  -h, --help               display help for command
`
      ;[
        ['push'],
        ['push', '-d', testFile],
        ['push', '-v', 'value']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('shift', () => {
      const expected = `Usage: vsq shift [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
  -h, --help               display help for command
`
      ;[
        ['shift']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('pop', () => {
      const expected = `Usage: vsq pop [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueue
  -h, --help               display help for command
`
      ;[
        ['pop']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('send', () => {
      const expected = `Usage: vsq send [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueueLikeSQS
  -v, --value [VALUE]      Data to be added (string)
  -h, --help               display help for command
`
      ;[
        ['send'],
        ['send', '-d', testFile],
        ['send', '-v', 'value']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('receive', () => {
      const expected = `Usage: vsq receive [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueueLikeSQS
  -h, --help               display help for command
`
      ;[
        ['receive']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })

    describe('delete', () => {
      const expected = `Usage: vsq delete [options]

Options:
  -d, --db [DB_FILE_PATH]  Path of DB file used by VerySimpleQueueLikeSQS
  -i, --id [DATA_ID]       Id of the data to delete
  -h, --help               display help for command
`
      ;[
        ['delete'],
        ['delete', '-d', testFile],
        ['delete', '-i', 'id']
      ].forEach((args) => {
        expect(() => execCmd(args)).toThrow()
        try {
          execCmd(args)
        } catch (error) {
          expect(error.status).toBe(255)
          expect(error.stdout.toString()).toBe(expected)
        }
      })
    })
  })
})
