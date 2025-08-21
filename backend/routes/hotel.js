const express = require('express');
const router = express.Router();
const roomCtrl = require('../controllers/roomController');
const guestCtrl = require('../controllers/guestController');
const reservationCtrl = require('../controllers/reservationController');

// Rooms
router.get('/rooms', roomCtrl.list);
router.get('/rooms/:id', roomCtrl.get);
router.post('/rooms', roomCtrl.create);
router.put('/rooms/:id', roomCtrl.update);
router.delete('/rooms/:id', roomCtrl.delete);

// Guests
router.get('/guests', guestCtrl.list);
router.get('/guests/:id', guestCtrl.get);
router.post('/guests', guestCtrl.create);
router.put('/guests/:id', guestCtrl.update);
router.delete('/guests/:id', guestCtrl.delete);

// Reservations
router.get('/reservations', reservationCtrl.list);
router.get('/reservations/:id', reservationCtrl.get);
router.post('/reservations', reservationCtrl.create);
router.put('/reservations/:id', reservationCtrl.update);
router.delete('/reservations/:id', reservationCtrl.delete);


module.exports = router;
