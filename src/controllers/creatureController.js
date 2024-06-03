const router = require('express').Router();
const creatureManager = require('../managers/creatureManager');

const { getErrorMessage } = require('../utils/errorHelper');

router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create', async (req, res) => {
    const creatureData = {
        ...req.body,
        owner: req.user._id,
    }

    try {
        await creatureManager.create(creatureData);
        res.redirect('/')
    } catch (err) {
        res.render('creatures/create', { error: getErrorMessage(err) })
    }
});

module.exports = router;