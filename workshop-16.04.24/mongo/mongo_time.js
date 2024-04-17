const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shelly')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

const Schema = mongoose.Schema;

// Define the Time schema with sunrise and sunset fields
const timeSchema = new Schema({
    sunrise: {
        type: String,
        required: true
    },
    sunset: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const Time = mongoose.model('Time', timeSchema);

const router = express.Router();

// Update the existing Time document with new sunrise and sunset times
router.put('/time/update', async (req, res) => {
    const { sunrise, sunset } = req.body;
    const updated_at = Date.now();

    try {
        // Use findOneAndUpdate with upsert option to update the existing document or create a new one if it does not exist
        const timeData = await Time.findOneAndUpdate(
            {},
            { sunrise, sunset, updated_at },
            { upsert: true, new: true }
        );
        res.send(timeData);
    } catch (error) {
        console.error('Error updating time data:', error);
        res.status(500).send(error);
    }
});

const app = express();

app.use(bodyParser.json());  // Middleware to parse JSON bodies
app.use('/', router);  // Use the router for all routes

app.listen(8080, () => {
    console.log('Server started on port 8080');
});
