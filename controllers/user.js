const User = require('../models/User');
const bcrypte = require('bcrypt');
const token = require('jsonwebtoken');
const crypt = require('../middelware/masqueEmail')

exports.signup = (req, res) => {
    const email = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
    const password = /.{4,}/;
    if(!email.test(req.body.email) || !password.test(req.body.password)){
        res.status(501).json({message: 'la valadidation nes pas correcte'});
    }

    bcrypte.hash(req.body.password, 10)
    .then(hash => {
                const Email = crypt(req.body.email)
                const user = new User({
                    email: Email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({message: 'utilisateyr créé'}))
                    .catch(error => res.status(400).json({error}))
        })
    .catch(error => res.status(500).json({error}));
}

exports.login = async (req, res) => {
    if(!req.body.password || !req.body.email){
        res.status(500).json({message: "manque le mot de passe ou l'email"});
    }

    const Email = crypt(req.body.email);

        User.findOne({email: Email})
        .then(user => {
            if(!user){
                return res.status(401).json({error: 'utilisateur inexistant'});
            }
            bcrypte.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error: 'mauvais mot de passe'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: token.sign(
                            {userId: user._id},
                            process.env.DB_token,
                            {expiresIn: '24h'}
                        )
                    });
                })
        })
        .catch(error => res.status(400).json(error))
}