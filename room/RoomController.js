var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var Room = require('./Room');

// CREATES A NEW ROOM
router.post('/', function (req, res) {
    Room.create({
            id_creator: req.body.id_creator,
            name: req.body.name,
            description: req.body.description,
            status: "active"
        }, 
        function (err, room) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(room);
        });
});

// RETURNS ALL THE ROOMS IN THE DATABASE
router.get('/', function (req, res) {
    Room.find({}, function (err, rooms) {
        if (err) return res.status(500).send("There was a problem finding the rooms.");
        res.status(200).send(rooms);
    });
});

// GETS A SINGLE ROOM FROM THE DATABASE
router.get('/:id', function (req, res) {
    Room.findById(req.params.id, function (err, room) {
        if (err) return res.status(500).send("There was a problem finding the room.");
        if (!room) return res.status(404).send("No room found.");
        res.status(200).send(room);
    });
});

// DELETES A ROOM FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Room.findByIdAndRemove(req.params.id, function (err, room) {
        if (err) return res.status(500).send("There was a problem deleting the room.");
        res.status(200).send("Room: "+ room.name +" was deleted.");
    });
});

// UPDATES A SINGLE ROOM IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated room can put to this route
router.put('/:id', /* VerifyToken, */ function (req, res) {
    Room.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, room) {
        if (err) return res.status(500).send("There was a problem updating the room.");
        res.status(200).send(room);
    });
});


module.exports = router;