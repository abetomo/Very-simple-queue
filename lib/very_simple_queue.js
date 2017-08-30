'use strict'

const fs = require('fs')

class VerySimpleQueue {
  constructor () {
    this.data = null
    this.filePath = null
  }

  _load (filePath) {
    if (fs.existsSync(filePath)) {
      const vsqData = JSON.parse(fs.readFileSync(filePath))
      if (vsqData.name !== 'VerySimpleQueue' || !Array.isArray(vsqData.value)) {
        throw new Error('not a data file of VerySimpleQueue')
      }
      return vsqData
    }
    const vsqData = {
      name: 'VerySimpleQueue',
      value: []
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
    return this.data.value.length
  }

  shift () {
    if (this.size() === 0) return null
    const value = this.data.value.shift()
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  pop () {
    if (this.size() === 0) return null
    const value = this.data.value.pop()
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  unshift (data) {
    this.data.value.unshift(data)
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }

  push (data) {
    this.data.value.push(data)
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }
}

module.exports = VerySimpleQueue
