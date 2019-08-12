'use strict'

const fs = require('fs')
const uuidv4 = require('uuid/v4')

module.exports = class VerySimpleQueueLikeSQS {
  constructor () {
    this.data = null
    this.filePath = null
  }

  _load (filePath) {
    if (fs.existsSync(filePath)) {
      const vsqData = JSON.parse(fs.readFileSync(filePath))
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
    fs.writeFileSync(filePath, JSON.stringify(vsqData))
    return vsqData
  }

  load (filePath) {
    this.data = this._load(filePath)
    this.filePath = filePath
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
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
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
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return ret
  }
}
