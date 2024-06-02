var express = require('express');
var router = express.Router();
var Question = require('../models/Question');

// get all answers
router.get('/', async function(req, res) {
    const answers = await Question.find().select('_id correctIndex');
    if (!answers)
        return res.status(404).send('Answers not found');
    res.json(answers);
});

// get multiple answers by provided ids
router.get('/:ids', async function(req, res) {
    const ids = req.params.ids.split(',');
    if (ids.length === 0)
        return res.status(401).send('Ids not provided');
    try {
        const answers = await Question.find({ _id: { $in: ids }}).select('_id correctIndex');
        if (!answers)
            return res.status(404).send('Answers not found');
        res.json(answers);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;