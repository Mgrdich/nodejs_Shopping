const fs = require('fs');
const {error500} = require("./utility");

exports.deleteFile = (filePath,next) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            return error500(next, err);
        }
    });
};
