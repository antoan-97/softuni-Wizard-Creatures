const router = require('express').Router();
const creatureManager = require('../managers/creatureManager');

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

module.exports = router;