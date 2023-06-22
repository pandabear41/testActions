function single() {

    let hex = '0123456789abcdef'

    let i = 0

    let done = false

    return next

    function next() {

        if (done) return

        let value = hex[i]

        i++

        if (i == hex.length) {
            done = true
        }

        return value
    }
}


function double() {

    let hex = '0123456789abcdef'
    let i = 0
    let j = 0
    let done = false

    return next

    function next() {

        if (done) return

        let value = hex[j] + hex[i]

        i++

        if (i == hex.length) {
            i = 0
            j++

            if (j == hex.length) {
                done = true
            }
        }

        return value
    }
}

exports.Iterator = single