const express = require("express");
const mongoose = require("mongoose");

const workoutRoutes = require("./routes/workoutRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// MongoDB database
mongoose.connect("mongodb+srv://admin:admin@batch593.fscmxoj.mongodb.net/fitness-tracker=Batch593");

mongoose.connection.once('open', () => {
    console.log('Now connected to MongoDB');
});


app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);


if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || port}`);
    });
}

module.exports = {app, mongoose};
