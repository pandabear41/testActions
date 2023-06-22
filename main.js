

var fs = require('fs')
var FileWriter = require('./FileWriter.js')
var XmlDownloader = require('./XmlDownloader.js')
var PrefixIterator = require('./PrefixIterator.js')
var Envs = require('./Envs.js')
var Env = Envs.devInstance

// GRAB after downloading jsons
var intelUsers = require('./IntelCodeDownloadTools.getUsers.json')
var ScriptClasses = require('./IntelCodeDownloadTools.getClasses.json')

var ScriptClassIterator = function() {

    let index = 0

    return next

    function next() {

        if (index == ScriptClasses.length) return

        let def = ScriptClasses[index]

        index++

        if (def.classname == "sysauto_script") {
            // skip over sysauto_script
            if (index == ScriptClasses.length) return
            let def = ScriptClasses[index]
            index++
        }

        return def
    }
}

var Root = './StaticCodeAnalysis'
fs.mkdir(Root, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});
var MaxThreads = 3
var thread_count = 0
var NextClassDef = ScriptClassIterator()
processClassDef(NextClassDef())


function processClassDef(def) {
    if (!def) return

    let nextPrefixFunc = PrefixIterator.Iterator()

    console.log('Processing "' + def.classname + '" -> "' + def.field )

    processPrefix(def, nextPrefixFunc)
}

function processPrefix(def, nextPrefixFunc) {

    let prefix = nextPrefixFunc()

    if (!prefix) {
        // we have gone through all the prefixes, time to go to next class
        setTimeout( function() {
            processClassDef(NextClassDef())
        }, 10)

        return
    }

    thread_count++    
    //console.log('Running threads = ' + thread_count)
    
    let classname = def.classname
    let field = def.field

    let scriptRoot = Root + '/' + classname + '/' + field

    //console.log('Processing "' + classname + '" -> "' + field + '" -> "' + prefix )
    prefix = 'sys_idSTARTSWITH' + prefix

    XmlDownloader.Download(Env, classname, prefix, function(records) {

        if (records.length == 0) {
            thread_count--
            
            if (thread_count < MaxThreads) {
                setTimeout( function() {
                    processPrefix(def, nextPrefixFunc)
                }, 10)
            }
        }

        for (let record of records) {
            if (DoNotStore(classname, record)) {
                //console.log("$$$$$$$ SKIPPING " + record.sys_created_by)

                // if this was the last one go to next prefix
                if ( record === records[records.length - 1] ) {
                    thread_count--
                    
                    if (thread_count < MaxThreads) {
                        setTimeout( function() {
                            processPrefix(def, nextPrefixFunc)
                        }, 10)
                    }
                }

                continue
            }

            let script = record[field]
            let filename = record.sys_id + '.js'

            FileWriter.Write(scriptRoot, filename, script, function() {

                // if this was the last one go to next prefix
                if ( record === records[records.length - 1] ) {
                    thread_count--
                    if (thread_count < MaxThreads) {
                        setTimeout( function() {
                            processPrefix(def, nextPrefixFunc)
                        }, 10)
                    }
                }
            })
        }
    })

    if (thread_count < MaxThreads) {
        setTimeout( function() {
            processPrefix(def, nextPrefixFunc)
        }, 10)
    }
}


function DoNotStore(classname, record) {
    var DO_NOT_STORE = true;
    var STORE = false;

    if (!intelUsers[record.sys_created_by]) return DO_NOT_STORE;

    if (classname == 'sysauto_script') {
        return DO_NOT_STORE;
    }

    if (classname == 'sys_script_execution_history') {
        return DO_NOT_STORE;
    }

    if (classname == 'wf_workflow_version') {
        if ((record.published + '') == 'false') {
            return DO_NOT_STORE;
        }
    }

    return STORE;
}