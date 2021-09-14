#!/usr/bin/env node

'use srict'

const VerySimpleQueue = require('..')
const VerySimpleQueueLikeSQS = require('..').SQS
const { program } = require('commander')
const fs = require('fs')
const path = require('path')
const packageJson = fs.existsSync(path.join(process.cwd(), 'package.json')) ? require(path.join(process.cwd(), 'package.json')) : {}
const vsq = new VerySimpleQueue()
const vsqLikeSqs = new VerySimpleQueueLikeSQS()

program
  .command('unshift')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((options, command) => {
    if (options.db == null || options.value == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsq.load(options.db)
    vsq.unshift(options.value)
  })

program
  .command('push')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((options, command) => {
    if (options.db == null || options.value == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsq.load(options.db)
    vsq.push(options.value)
  })

program
  .command('shift')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .action((options, command) => {
    if (options.db == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsq.load(options.db)
    const value = vsq.shift()
    if (value != null) console.log(value)
  })

program
  .command('pop')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .action((options, command) => {
    if (options.db == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsq.load(options.db)
    const value = vsq.pop()
    if (value != null) console.log(value)
  })

program
  .command('send')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueueLikeSQS')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((options, command) => {
    if (options.db == null || options.value == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsqLikeSqs.load(options.db)
    console.log(vsqLikeSqs.send(options.value))
  })

program
  .command('receive')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueueLikeSQS')
  .action((options, command) => {
    if (options.db == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsqLikeSqs.load(options.db)
    console.log(JSON.stringify(vsqLikeSqs.receive(), null, '  '))
  })

program
  .command('delete')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueueLikeSQS')
  .option('-i, --id [DATA_ID]', 'Id of the data to delete')
  .action((options, command) => {
    if (options.db == null || options.id == null) {
      command.outputHelp()
      process.exit(255)
    }
    vsqLikeSqs.load(options.db)
    console.log(vsqLikeSqs.delete(options.id))
  })

program
  .version(packageJson.version)
  .showSuggestionAfterError()
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
  process.exit(255)
}
