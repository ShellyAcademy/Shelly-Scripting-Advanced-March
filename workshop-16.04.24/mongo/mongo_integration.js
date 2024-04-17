const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1/shelly')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const switchSchema = new Schema({
    device_id: {
        type: String,
        required: true
    },
    switch_id: {
        type: Number,
        required: true
    },
    output: {
        type: Boolean,
        required: true
    },
    voltage: {
        type: Number,
        required: true
    },
    apower: {
        type: Number,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

Switch = mongoose.model('Switch', switchSchema);

const router = express.Router();

// Get all switches
router.get('/switch', async (req, res) => {
    try {
        const shellySwitches = await Switch.find({});
        res.send(shellySwitches);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Get switch by device id and switch id
router.get('/switch/:device_id/:switch_id', async (req, res) => {
    const { device_id, switch_id } = req.params;

    try {
        const shellySwitches = await Switch.find({device_id, switch_id});
        res.send(shellySwitches);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Create a switch
router.post('/switch', async (req, res) => {
    const { device_id, switch_id, output, voltage, apower } = req.body;

    try {
        const shellySwitch = new Switch({ device_id, switch_id, output, voltage, apower });
        await shellySwitch.save();
        res.send(shellySwitch);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Update a switch
router.put('/switch/:deviceId/:switchId', async (req, res) => {
    const { deviceId, switchId } = req.params;
    const { device_id, switch_id, output, voltage, apower } = req.body;
    const updated_at = Date.now();
    try {
        const shellySwitch = await Switch.findOneAndUpdate(
            { device_id: deviceId, switch_id: switchId },
            { device_id, switch_id, output, voltage, apower, updated_at },
            { upsert: true, new: true });
        res.send(shellySwitch);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Delete a user
router.delete('/switch/:deviceId/:switchId', async (req, res) => {
    const { deviceId, switchId } = req.params;

    try {
        const shellySwitch = await Switch.findOneAndDelete({ device_id: deviceId, switch_id: switchId });
        res.send(shellySwitch);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

const app = express();

app.use(bodyParser.json());

app.use('/', router);

app.listen(8080, () => {
    console.log('Server started on port 8080');
});
