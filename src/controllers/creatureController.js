const router = require('express').Router();
const creatureManager = require('../managers/creatureManager');
const User = require('../models/User');
const { isAuth, isOwner } = require('../middlewares/authMiddleware');


const { getErrorMessage } = require('../utils/errorHelper');


router.get('/', async (req, res) => {
    const creatures = await creatureManager.getAll().lean();
    res.render('creatures', { creatures })
});

router.get('/create', isAuth, (req, res) => {
    res.render('creatures/create');
});

router.post('/create', isAuth, async (req, res) => {
    const creatureData = {
        ...req.body,
        owner: req.user._id,
    }

    try {
        await creatureManager.create(creatureData);
        res.redirect('/creatures')
    } catch (err) {
        res.render('creatures/create', { error: getErrorMessage(err) })
    }
});


router.get('/:creatureId/details', async (req, res) => {
    const { user } = req;
    const creatureId = req.params.creatureId;
    const creature = await creatureManager.getOne(creatureId).lean();

    const voters = await User.find({ _id: { $in: creature.votes } }, 'email').lean();
    const voterEmails = voters.map(voter => voter.email).join(', ');


    const owner = await User.findById(creature.owner).lean();
    const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';




    const isOwner = req.user?._id == creature.owner?._id;
    const hasVoted = creature.votes?.some((v) => v?.toString() === user?._id);

    res.render('creatures/details', { isOwner, user, creature, hasVoted, ownerName, voterEmails })

});

router.get('/:creatureId/vote', isAuth, async (req, res) => {
    const creatureId = req.params.creatureId;
    const userId = req.user._id;

    try {
        await creatureManager.vote(creatureId, userId);
        res.redirect(`/creatures/${creatureId}/details`);
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) })
    }
});


router.get('/:creatureId/edit', isAuth, isOwner, async (req, res) => {
    const creatureId = req.params.creatureId;


    try {
        const creature = await creatureManager.getOne(creatureId).lean();
        console.log(creature);
        res.render('creatures/edit', { creature })
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});

router.post('/:creatureId/edit', isAuth, isOwner, async (req, res) => {
    const creatureId = req.params.creatureId;
    const creatureData = req.body;

    try {
        await creatureManager.edit(creatureId, creatureData);
        res.redirect(`/creatures/${creatureId}/details`);
    } catch (err) {
        res.render('creatures/edit', { creature: { ...creatureData, _id: creatureId }, error: getErrorMessage(err) })
    }

});



router.get('/:creatureId/delete', isAuth, isOwner, async (req, res) => {
    const creatureId = req.params.creatureId;

    try {
        await creatureManager.delete(creatureId);
        res.redirect('/creatures');
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) })
    }

});

module.exports = router;