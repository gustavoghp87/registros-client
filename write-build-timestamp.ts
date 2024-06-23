const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'src', 'build-timestamp.json')

const content = {
    buildTimestamp: Date.now()
}

fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8')
