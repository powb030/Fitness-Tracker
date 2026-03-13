const Workout = require("../models/Workout");
const { errorHandler } = require("../auth");

// POST /workouts
module.exports.addWorkout = (req, res) => {

    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        userId: req.user.id,
        status: req.body.status || "planned"
    });

    newWorkout.save()
        .then(savedWorkout => res.status(201).send(savedWorkout))
        .catch(err => errorHandler(err, req, res));

};

// GET /workouts
module.exports.getMyWorkouts = (req, res) => {

    Workout.find({ userId: req.user.id })
        .then(workouts => {

            if (workouts.length > 0) {
                return res.status(200).send({ workouts });
            } else {
                return res.status(200).send({ message: "No workouts found." });
            }

        })
        .catch(err => errorHandler(err, req, res));

};

// GET /workouts/:id
module.exports.getWorkoutById = (req, res) => {

    Workout.findById(req.params.id)
        .then(workout => {

            if (!workout) {
                return res.status(404).send({ error: "Workout not found" });
            }

            if (workout.userId !== req.user.id) {
                return res.status(403).send({ error: "Forbidden. You do not have access to this workout." });
            }

            return res.status(200).send({ workout });

        })
        .catch(err => errorHandler(err, req, res));

};

// PATCH /workouts/update/:id
module.exports.updateWorkout = (req, res) => {

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status
    };

    return Workout.findByIdAndUpdate(req.params.id, updatedWorkout, { new: true })
        .then(workout => {

            if (workout) {
                res.status(200).send({ message: "Workout updated successfully", updatedWorkout: workout });
            } else {
                res.status(404).send({ error: "Workout not found" });
            }

        })
        .catch(err => errorHandler(err, req, res));

};

// PATCH /workouts/delete/:id
module.exports.deleteWorkout = (req, res) => {

    return Workout.findByIdAndDelete(req.params.id)
        .then(workout => {

            if (workout) {
                res.status(200).send({ message: "Workout deleted successfully" });
            } else {
                res.status(404).send({ error: "Workout not found" });
            }

        })
        .catch(err => errorHandler(err, req, res));

};

// PATCH /workouts/complete/:id
module.exports.completeWorkoutStatus = (req, res) => {

    return Workout.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true })
        .then(workout => {

            if (workout) {
                res.status(200).send({ message: "Workout status updated successfully", updatedWorkout: workout });
            } else {
                res.status(404).send({ error: "Workout not found" });
            }

        })
        .catch(err => errorHandler(err, req, res));

};