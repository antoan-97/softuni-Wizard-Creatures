const router = require('express').Router();
const creatureManager = require('../managers/creatureManager');
const User = require('../models/User');


const { getErrorMessage } = require('../utils/errorHelper');


router.get('/', async (req,res) =>{
    const creatures = await creatureManager.getAll().lean();
    res.render('creatures', { creatures })
});

router.get('/create', (req, res) => {
    res.render('creatures/create');
});

router.post('/create', async (req, res) => {
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


router.get('/:creatureId/details', async (req,res) =>{
    const { user } = req;
    const creatureId = req.params.creatureId;
    const creature = await creatureManager.getOne(creatureId).lean();

    const voters = await User.find({ _id: { $in: creature.votes } }, 'email').lean();
    const voterEmails = voters.map(voter => voter.email);
   
  
     const owner = await User.findById(creature.owner).lean();
     const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
     console.log(user);


    
    const isOwner = req.user?._id == creature.owner?._id;
    const hasVoted = creature.votes?.some((v) => v?.toString() === user?._id);

    res.render('creatures/details', { isOwner, user, creature, hasVoted, ownerName,voterEmails  })

})

module.exports = router;