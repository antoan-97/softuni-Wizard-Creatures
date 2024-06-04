const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    skinColour: {
        type: String,
        required: true,
    },
    eyeColour: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        match:[/^https?:\/\//, 'Invalid URL!']
    },
    description: {
        type: String,
        required: true,
    },
    votes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
})

const Creature = mongoose.model('Creature', creatureSchema);

module.exports = Creature;
