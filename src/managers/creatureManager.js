const Creature = require('../models/Creature');

exports.create = (creatureData) => Creature.create(creatureData);

exports.getAll = () => Creature.find().populate('owner');

exports.getOne = (creatureId) => Creature.findById(creatureId).populate('owner');

