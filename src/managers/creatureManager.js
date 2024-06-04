const Creature = require('../models/Creature');

exports.create = (creatureData) => Creature.create(creatureData);

exports.getAll = () => Creature.find().populate('owner');

exports.getOne = (creatureId) => Creature.findById(creatureId).populate('owner');

exports.edit = (creatureId,creatureData) => Creature.findByIdAndUpdate(creatureId,creatureData);

exports.delete = (creatureId) => Creature.findByIdAndDelete(creatureId);

exports.vote = async (creatureId, userId) => {
    const creature = await Creature.findById(creatureId);

    if (!creature) {
        throw new Error('Creature not found');
    }

    // Check if the user has already voted
    if (creature.votes.includes(userId)) {
        return;
    }

    creature.votes.push(userId);
    return creature.save();
};

