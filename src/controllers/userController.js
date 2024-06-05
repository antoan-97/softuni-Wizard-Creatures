const router = require('express').Router();
const userManager = require('../managers/userManager');
const { getErrorMessage } = require('../utils/errorHelper');
const creatureManager = require('../managers/creatureManager');
const Creature = require('../models/Creature');
const User = require('../models/User');


router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await userManager.login(email, password);
        res.cookie('token', token);
        res.redirect('/');
    } catch (err) {
        res.render('users/login', { error: getErrorMessage(err), email });
    }

});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return res.render('users/register', { error: 'Passwords do not match!', email });
    };

    try {
        const token = await userManager.register({ firstName, lastName, email, password, repeatPassword });

        res.cookie('token', token)
        res.redirect('/');
    } catch (err) {
        res.render('users/register', { error: getErrorMessage(err), firstName, lastName, email, password, repeatPassword })
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

router.get('/profile', async (req, res) => {
    const { user } = req // getting user.id 

    try {
        const creatures = await creatureManager.getAll({ owner:  user?._id }).lean();
        const owner = await User.findById( user?._id).lean();
        const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
        res.render('users/profile', { creatures, ownerName });
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});


module.exports = router