const express = require("express");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET QUIZ FOR A COURSE

router.get("/course/:courseId", authMiddleware, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            course: req.params.courseId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json(quiz);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch quiz"
        });
    }
});


// CREATE QUIZ

router.post("/", authMiddleware, async (req, res) => {
    try {
        const quiz = new Quiz(req.body);

        await quiz.save();

        res.status(201).json({
            message: "Quiz created successfully",
            quiz
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create quiz"
        });
    }
});

module.exports = router;