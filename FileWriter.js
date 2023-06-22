var fs = require('fs')

exports.Write = function(dir, filename, data, cb) {

	if (!data) {
		cb()
		return
	}

	if (!fs.existsSync(dir)) 
	    fs.mkdirSync(dir, { recursive: true })
	    
    fs.writeFile(dir + '/' + filename, data, cb)	
}
