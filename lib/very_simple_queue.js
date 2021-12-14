'use strict'

const nodeFs = require('fs')
const memfs = require('memfs')

module.exports = class VerySimpleQueue {
  constructor () {
    this.fs = nodeFs
    this.data = null
    this.filePath = null
  }

  _load (filePath) {
    if (this.fs.existsSync(filePath)) {
      const vsqData = JSON.parse(this.fs.readFileSync(filePath))
      if (vsqData.name !== 'VerySimpleQueue' || !Array.isArray(vsqData.value)) {
        throw new Error('not a data file of VerySimpleQueue')
      }
      return vsqData
    }
    const vsqData = {
      name: 'VerySimpleQueue',
      value: []
    }
    this.fs.writeFileSync(filePath, JSON.stringify(vsqData))
    return vsqData
  }

  load (filePath) {
    this.filePath = filePath
    if (filePath === ':memory:') {
      this.filePath = '/VerySimpleQueue'
      this.fs = memfs.fs
    }
    this.data = this._load(this.filePath)
    return this.data
  }

  size () {
    return this.data.value.length
  }

  shift () {
    if (this.size() === 0) return null
    const value = this.data.value.shift()
    this.fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  pop () {
    if (this.size() === 0) return null
    const value = this.data.value.pop()
    this.fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  unshift (data) {
    this.data.value.unshift(data)
    this.fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }

  push (data) {
    this.data.value.push(data)
    this.fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }
}
