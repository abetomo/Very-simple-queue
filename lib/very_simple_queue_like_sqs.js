'use strict'

const nodeFs = require('fs')
const memfs = require('memfs')
const { v4: uuidv4 } = require('uuid')

module.exports = class VerySimpleQueueLikeSQS {
  constructor () {
    this.fs = nodeFs
    this.data = null
    this.filePath = null
  }

  _load (filePath) {
    if (this.fs.existsSync(filePath)) {
      const vsqData = JSON.parse(this.fs.readFileSync(filePath))
      if (
        vsqData.name !== 'VerySimpleQueueLikeSQS' ||
        Object.prototype.toString.call(vsqData.value) !== '[object Object]'
      ) {
        throw new Error('not a data file of VerySimpleQueueLikeSQS')
      }
      return vsqData
    }
    const vsqData = {
      name: 'VerySimpleQueueLikeSQS',
      value: {}
    }
    this.fs.writeFileSync(filePath, JSON.stringify(vsqData))
    return vsqData
  }

  load (filePath) {
    this.filePath = filePath
    if (filePath === ':memory:') {
      this.filePath = '/VerySimpleQueueLikeSQS-' + uuidv4()
      this.fs = memfs.fs
    }
    this.data = this._load(this.filePath)
    return this.data
  }

  size () {
    return Object.keys(this.data.value).length
  }

  id () {
    return `${parseInt((new Date()).getTime() / 10000)}-${uuidv4()}`
  }

  send (data) {
    const id = this.id()
    this.data.value[id] = data
    this.fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return id
  }

  receive () {
    if (this.size() === 0) return null
    const key = Object.keys(this.data.value).sort()[0]
    return {
      id: key,
      body: this.data.value[key]
    }
  }

  delete (id) {
    if (this.data.value[id] == null) return null
    const ret = delete this.data.value[id]
    this.fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return ret
  }
}
