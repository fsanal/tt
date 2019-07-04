const NewRelease = require('../../models/feedback_forum/NewRelease');
var mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;

createNewRelease = (req, res) => {
    const { forumID, bucketID, requirementID, authorID, formID, title, body, url } = req.body;
    let newRelease = new NewRelease(
        {
            title, 
            body,
            forum: ObjectId(forumID),
            requirement: ObjectId(requirementID),
            author: ObjectId(authorID),
            created: new Date(),
        }
    );
    if (url) newRelease.url = url;
    if (bucketID) newRelease.bucket = ObjectId(bucketID);
    if (formID) newRelease.form = ObjectId(formID);
    newRelease.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(newRelease);
    });
}

getNewRelease = (req, res) => {
    NewRelease.findById(req.params.id, (err, newRelease) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(newRelease);
    });
}

editNewRelease = (req, res) => {
    const { id } = req.params;
    const { title, body, formID, forumID, bucketID, url } = req.body;
    let update = {};
    if (title) update.title = title;
    if (body) update.body = body;
    if (bucketID) update.bucket = ObjectId(bucketID);
    if (formID) update.form = ObjectId(formID);
    if (forumID) update.forum = ObjectId(forumID); 
    if (url) update.url = url
    NewRelease.findByIdAndUpdate(id, {$set: update}, {new: true}, (err, newRelease) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(newRelease);
    });
}

deleteNewRelease = (req, res) => {
    const { id } = req.params;
    NewRelease.findByIdAndRemove(id, (err, newRelease) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(newRelease);
    });
}

module.exports = { createNewRelease, getNewRelease, editNewRelease, deleteNewRelease }


