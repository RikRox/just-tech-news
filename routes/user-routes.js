const router = require('express').Router();
const { response } = require('express');
const {User} = require('../models');


//get /api/users
router.get('/', (req, res) => {
    //access our user model and run .findall() method findall equivalent of select * 
    User.findAll({
        attributes: {exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//get /api/users/1 sql equivalent to select * from users where id = 1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


//post /api/users
//sql =  insert into (username, email, password values ("rikayla", "rikaylaj@gmaIl.com", "password1234")
router.post('/', (req, res) => {
    //expects {username: 'rikayla', email: rikaylaj@gmail.com , password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.post('/login', (req, res) => {
    //query operation
    //expects {username: 'rikayla', email: rikaylaj@gmail.com , password: 'password1234'}
    User.findOne({
        where: {
            email:req.body.email
        }
    }).then (dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: 'No user with that email address!'});
            return;
        }
        //res.json({user: dbUserData});

        //verify user
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword){
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }
        res.json({user: dbUserData, message: 'You are now logged in!'});
    });
});




// put /api/users/1
//sql = update users set username = "rikayla", email:  rikaylaj@gmail.com",password: "password1234" where id = 1
router.put('/:id', (req, res) => {
     //expects {username: 'rikayla', email: rikaylaj@gmail.com , password: 'password1234'}

     //if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
     User.update(req.body, {
        individualHooks: "true",
        where: {
            id: req.params.id
        }
     })
     .then (dbUserData => {
        if(!dbUserData[0]){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
     })
     .catch(err => {
        console.log(err);
        res.status(500).json(err);
     });
});


// delete /api/users/1
router.delete('/:id', (res, req) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;