const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required!'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true, 
    },
    password: {
        type: String,
        required:  [true, 'Password is required!'],
    },
   
});


userSchema.virtual('repeatPassword')
    .set(function (value) {
        if (this.password !== value) {
            throw new Error('Password missmatch!')
        }
    })

userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
});


const User = mongoose.model('User', userSchema);

module.exports = User;


