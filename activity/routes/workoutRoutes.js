const express = require("express");
const workoutController = require("../controllers/workoutController");
const { verify } = require("../auth");

const router = express.Router();

// All workout routes require authentication
router.post("/", verify, workoutController.addWorkout);
router.get("/", verify, workoutController.getMyWorkouts);
router.get("/:id", verify, workoutController.getWorkoutById);
router.patch("/update/:id", verify, workoutController.updateWorkout);
router.patch("/delete/:id", verify, workoutController.deleteWorkout);
router.patch("/complete/:id", verify, workoutController.completeWorkoutStatus);


module.exports = router;