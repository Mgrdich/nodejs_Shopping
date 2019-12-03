const path = require('path');
const {mainModule} = process;
module.exports = path.dirname(mainModule.filename);