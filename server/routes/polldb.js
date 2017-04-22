// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the game model
let game = require('../models/polldb');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

/* GET polldb List page. READ */
router.get('/', (req, res, next) => {
    // find all polldb in the polldb collection
    game.find((err, polldb) => {
        //if (err) {
        //  return console.error(err);
        //} else {
        res.render('polldb/index', {
            title: 'Poll',
            polldb: polldb,
            displayName: req.user.displayName
        });
        //}
    });

});

//  GET the Game Details page in order to add a new Game
router.get('/add', requireAuth, (req, res, next) => {
    res.render('polldb/details', {
        title: "Add a new Poll",
        polldb: '',
        displayName: req.user.displayName
    });
});

// POST process the Poll page and create a new poll scenario - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    let newGame = game({
        "question": req.body.question,
        "option1": req.body.option1,
        "option2": req.body.option2,
        "option3": req.body.option3
    });

    game.create(newGame, (err, game) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/polldb');
        }
    });
});

// Get details of poll added
router.get('/:id', requireAuth, (req, res, next) => {

    try {
        // get a reference to the id from the url
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        // find one game by its id
        game.findById(id, (err, polldb) => {
            if (err) {
                console.log(err);
                res.end(error);
            } else {
                // show the game details view
                res.render('polldb/details', {
                    title: 'Poll Details',
                    polldb: polldb,
                    displayName: req.user.displayName
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect('/errors/404');
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
    // get a reference to the id from the url
    let id = req.params.id;

    let updatedGame = game({
        "_id": id,
        "question": req.body.question,
        "option1": req.body.option1,
        "option2": req.body.option2,
        "option3": req.body.option3
    });

    game.update({ _id: id }, updatedGame, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the game List
            res.redirect('/polldb');
        }
    });

});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
    // get a reference to the id from the url
    let id = req.params.id;

    game.remove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the polldb list
            res.redirect('/polldb');
        }
    });
});


module.exports = router;