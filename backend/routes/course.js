const express = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ================= GET ALL COURSES =================

router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json(courses);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
});


// ================= GET SINGLE COURSE =================

router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(course);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch course"
        });
    }
});


// ================= CREATE COURSE =================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const course = new Course(req.body);

        await course.save();

        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create course"
        });
    }
});


module.exports = router;