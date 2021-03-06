const express = require('express');
const router = express.Router();
const passport = require('passport');

const local_authentication_controller = require('../controllers/authentication_controllers/LocalAuthentication');
router.post('/authenticate/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user) {
        if (err) return res.json({ success: false, error: err });
        req.logIn(user, function(err) {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    })(req, res, next);
});
router.post('/authenticate/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user) {
        if (err) return res.json({ success: false, error: err });
        req.logIn(user, function(err) {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    })(req, res, next);
});
router.get('/authenticate/logout', local_authentication_controller.logout);

const facebook_authentication_controller = require('../controllers/authentication_controllers/FacebookAuthentication');
router.get('/authenticate/facebook', function(req, res, next) {
    passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    })(req, res, next);
});
router.get('/authenticate/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user) {
        if (err) return res.json({ success: false, error: err });
        req.logIn(user, function(err) {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    })(req, res, next);
});
router.get('/authenticate/facebook/logout', facebook_authentication_controller.logout);

const google_authentication_controller = require('../controllers/authentication_controllers/GoogleAuthentication');
router.get('/authenticate/google', function(req, res, next) {
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
});
router.get('/authenticate/google/callback', function(req, res, next) {
    passport.authenticate('google', function(err, user) {
        if (err) return res.json({ success: false, error: err });
        req.logIn(user, function(err) {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    })(req, res, next);
});
router.get('/authenticate/google/logout', google_authentication_controller.logout);

module.exports = router;