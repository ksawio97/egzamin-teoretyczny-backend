var express = require('express');
var router = express.Router();
var Question = require('../models/Question');

// get all questions 
router.get('/', async function(req, res, next) {
    const questions = await Question.find().select('-correctIndex');
    if (!questions)
        return res.status(404).send('Questions not found');
    res.json(questions);
});

// get one question by id
router.get('/:id', async function(req, res, next) {
    try {
        const question = await Question.findById(req.params.id).select('-correctIndex');
        if (!question)
            return res.status(404).send('Question not found');
        res.json(question);
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});

// get count random questions (count in range 1 to 40)
router.get('/random/:count', async function(req, res, next) {
    const count = parseInt(req.params.count, 10);

    if (count === NaN)
        return res.status(401).send('Number was expected at the end of request path');
    if (count < 1 || count > 40)
        return res.status(401).send('Number at the end of request path should be in range 1 to 40');

    try {
        const questions = await Question.aggregate([
            { $sample: { size: count }},
            { $project: { correctIndex: 0 } }
        ]);
        res.json(questions);
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});
module.exports = router;