var fs = require('fs')
var FileWriter = require('./FileWriter.js')
var XmlDownloader = require('./XmlDownloader.js')
var PrefixIterator = require('./PrefixIterator.js')
var Envs = require('./Envs.js')
var Env = Envs.MainEnv

console.log("Running on Host: " + process.env.HOST);
downloadJsons()

function downloadJsons() {
    XmlDownloader.Download(Env, "sys_properties", "nameSTARTSWITHIntelCodeDownloadTools", function(records) {
        for (let record of records) {
            let value = record.value
            let filename = record.name + '.json'

            FileWriter.Write('./', filename, value, function() {
                console.log('wrote file: ' + filename)
            })
        }
    })
}