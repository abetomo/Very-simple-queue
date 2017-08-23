'use strict'

const fs = require('fs')

class VerySimpleQueue {
  constructor () {
    this.data = null
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
    fs.writeFileSync(filePath, vsqData)
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
}

module.exports = VerySimpleQueue
