var express = require('express');
const { gfsBucket } = require('../db');
var router = express.Router();

router.get('/name/:filename', async function (req, res) {
    const bucket = gfsBucket();

    console.log(`Searching for file: ${req.params.filename}`);
    const files = await bucket.find({ filename: req.params.filename })
    if (!await files.hasNext()) {
        return res.status(404).send('File not found');
    }
    const file = await files.next();
    bucket.openDownloadStream(file._id).pipe(res);
});

module.exports = router;