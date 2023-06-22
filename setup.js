var fs = require('fs')
var FileWriter = require('./FileWriter.js')
var XmlDownloader = require('./XmlDownloader.js')
var PrefixIterator = require('./PrefixIterator.js')
var Envs = require('./Envs.js')
var Env = Envs.devInstance

console.log('what')
downloadJsons()

function downloadJsons() {
    console.log("hi")
    XmlDownloader.Download(Env, "sys_properties", "nameSTARTSWITHIntelCodeDownloadTools", function(records) {
        console.log("hi no")
        for (let record of records) {
            console.log(record)
            let value = record.value
            let filename = record.name + '.json'

            FileWriter.Write('./', filename, value, function() {
                console.log('wrote file: ' + filename)
            })
        }
    })
}