var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var Message = require('./Message');

// CREATES A NEW MESSAGE
router.post('/', function (req, res) {
    User.findById(req.body.id_sender, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        Room.findById(req.body.id_room, function (err, room) {
            if (err) return res.status(500).send("There was a problem finding the room.");
            if (!room) return res.status(404).send("No room found.");
            Message.create({
                id_sender : req.body.id_sender,
                id_room : req.body.id_room,
                content : req.body.content,
                status: "active"
            }, 
            function (err, message) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(message);
            });
        });
    });
});

// RETURNS ALL THE MESSAGES IN THE DATABASE
router.get('/', function (req, res) {
    Message.find({}, function (err, messages) {
        if (err) return res.status(500).send("There was a problem finding the messages.");
        res.status(200).send(messages);
    });
});

// GETS A SINGLE MESSAGE FROM THE DATABASE
router.get('/:id', function (req, res) {
    Message.findById(req.params.id, function (err, message) {
        if (err) return res.status(500).send("There was a problem finding the message.");
        if (!message) return res.status(404).send("No message found.");
        res.status(200).send(message);
    });
});

// DELETES A MESSAGE FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Message.findByIdAndRemove(req.params.id, function (err, message) {
        if (err) return res.status(500).send("There was a problem deleting the message.");
        res.status(200).send("Message: "+ message.name +" was deleted.");
    });
});

// UPDATES A SINGLE MESSAGE IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated message can put to this route
router.put('/:id', /* VerifyToken, */ function (req, res) {
    Message.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, message) {
        if (err) return res.status(500).send("There was a problem updating the message.");
        res.status(200).send(message);
    });
});


module.exports = router;