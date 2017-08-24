#!/usr/bin/env node

'use srict'

const VerySimpleQueue = require('..')
const program = require('commander')
const fs = require('fs')
const path = require('path')
const packageJson = fs.existsSync(path.join(process.cwd(), 'package.json'))
  ? require(path.join(process.cwd(), 'package.json')) : {}
const vsq = new VerySimpleQueue()

program
  .command('unshift')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((prg) => {
    vsq.load(prg.db)
    vsq.unshift(prg.value)
  })

program
  .command('push')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((prg) => {
    vsq.load(prg.db)
    vsq.push(prg.value)
  })

program
  .command('shift')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .action((prg) => {
    vsq.load(prg.db)
    const value = vsq.shift()
    if (value != null) console.log(value)
  })

program
  .command('pop')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .action((prg) => {
    vsq.load(prg.db)
    const value = vsq.pop()
    if (value != null) console.log(value)
  })

program
  .version(packageJson.version)
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
  process.exit(255)
}
