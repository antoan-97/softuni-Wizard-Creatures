const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, 'Name should be at least 2 characters long!'],
    },
    species: {
        type: String,
        required: true,
        minLength: [3, 'Species should be at least 3 characters long!'],
    },
    skinColour: {
        type: String,
        required: true,
        minLength: [3, 'Skin Colour should be at least 3 characters long!'],
    },
    eyeColour: {
        type: String,
        required: true,
        minLength: [3, 'Eye Colour should be at least 3 characters long!'],
    },
    image: {
        type: String,
        required: true,
        match:[/^https?:\/\//, 'Invalid URL!']
    },
    description: {
        type: String,
        required: true,
        minLength: [5, 'Description should be between 5 - 500 characters long!'],
        maxLength: [500, 'Description should be between 5 - 500 characters long!'],
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
