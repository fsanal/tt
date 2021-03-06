const User = require('../models/User');
var mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;

createUser = (req, res) => {
    const { externalID, name, email, password, personaIDs, 
        isAuth, notificationPref, url, imageUrl } = req.body
	let user = new User({
		name,
		created: new Date(),
	})
	if (externalID) user.externalID = externalID;
    if (email) user.email = email;
    if (password) user.password = password;
    if (isAuth) { user.isAuth = isAuth; } else { user.isAuth = false; }
    if (personaIDs) user.personas = personaIDs.map(personaID => ObjectId(personaID));
    if (notificationPref) user.notificationPref = notificationPref;
    if (url) user.url = url;
    if (imageUrl) user.imageUrl = imageUrl;
	user.save((err, user) => {
		if (err) return res.json({success: false, error: err});
		user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(user);
		});
	});
}

getUser = (req, res) => {
	User.findById(req.params.id).populate('personas').exec(function(err, user) {
		if (err) return res.json({success: false, error: err});
		return res.json(user);
	});
}

editUser = (req, res) => {
	const { id } = req.params;
	const { name, email, url, imageUrl, password, notificationPref } = req.body;
	let update = {};
	if (name) update.name = name;
	if (email) update.email = email;
	if (url) update.url = url;
	if (imageUrl) update.imageUrl = imageUrl;
	if (password) update.password = password;
	User.findByIdAndUpdate ( id, { $set: update }, { new: true }, (err, user) => {
		if (err) return res.json({success: false, error: err});
		user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(user);
		});
	});
}

deleteUser = (req, res) => {
	User.findByIdAndRemove ( req.params.id, (err, user) => {
	    if (err) return res.json({success: false, error: err});
		user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			fields = user.customFields;
            for (const fieldID of fields) {
                CustomField.findByIdAndRemove(fieldID, (err, field) => {
                    if (err) return res.json({ success: false, error: err });
                });
            }
			return res.json(user);
		});
	});
}

addPersona = (req, res) => {
	const { id } = req.params;
	const { personaID } = req.body
	update = {}
	update.personas = ObjectId(personaID)
    User.findByIdAndUpdate ( id, { $push: update }, { new: true }, (err, user) => {
		if (err) return res.json({success: false, error: err});
		user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(user);
		});
	});
}

deletePersona = (req, res) => {
	const { id } = req.params;
	const { personaID } = req.body
	update = {}
	update.personas = ObjectId(personaID)
    User.findByIdAndUpdate ( id, { $pull: update }, { new: true }, (err, user) => {
		if (err) return res.json({success: false, error: err});
		user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(user);
		});
	});
}

createCustomField = (req, res) => {
    const { id } = req.params;
    const { fieldID } = req.body;
    let update = {};
    if (fieldID) update.customFields = ObjectId(fieldID);
    User.findByIdAndUpdate(id, {$push: update}, {new: true}, (err, user) => {
        if (err) return res.json({ success: false, error: err });
        user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			return res.json(user);
		});
    });
}

deleteCustomField = (req, res) => {
    const { id } = req.params;
    const { fieldID } = req.body;
    let update = {};
    if (fieldID) update.customFields = ObjectId(fieldID);
    User.findByIdAndUpdate(id, {$pull: update}, {new: true}, (err, user) => {
        if (err) return res.json({ success: false, error: err });
        user.populate('personas', (err, user) => {
			if (err) return res.json({success: false, error: err});
			CustomField.findByIdAndRemove(fieldID, (err, field) => {
                if (err) return res.json({ success: false, error: err });
                return res.json(user);
            });
		});
    });
}

module.exports = { createUser, getUser, editUser, deleteUser, addPersona, deletePersona,
createCustomField, deleteCustomField }