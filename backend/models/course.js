const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        youtubeUrl: {
            type: String,
            required: true
        },

        order: {
            type: Number,
            required: true
        }
    },
    {
        _id: true
    }
);

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        instructor: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            required: true
        },

        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },

        image: {
            type: String,
            default: ""
        },

        videos: {
            type: [videoSchema],
            default: []
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);