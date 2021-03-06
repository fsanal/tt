const Comment = require('../models/Comment')
var mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

createComment = (req, res) => {
	const { requirementID, postID, newReleaseID,
			parentID, authorID, content } = req.body
	let comment = new Comment({
		author: ObjectId(authorID),
		created: new Date(),
		content
	})
	if (parentID) comment.parent = ObjectId(parentID);
	if (postID) { 
		comment.post = ObjectId(postID);
		comment.sourcePost = ObjectId(postID);
	} else if (requirementID) {
		comment.requirement = ObjectId(requirementID);
	} else if (newReleaseID) {
		comment.newRelease = ObjectId(newReleaseID);
	}
	comment.save((err, comment) => {
		if (err) return res.json({success: false, error: err})
		comment.populate('post').populate('requirement').populate('newRelease')
		.populate('parent').populate('source').populate('author', (err, comment) => {
			if (err) return res.json({success: false, error: err})
			return res.json(comment)
		});
	});
}

getComment = (req, res) => {
	Comment.findById(req.params.id).populate('post').populate('requirement').populate('newRelease')
	.populate('parent').populate('source').populate('author').exec(function(err, comment) {
		if (err) return res.json({success: false, error: err})
		return res.json(comment)
	});
}

editComment = (req, res) => {
	const { id } = req.params;
	const { content } = req.body;
	let update = {};
	if (content) update.content = content;
	Comment.findByIdAndUpdate ( id, { $set: update }, { new: true }, (err, comment) => {
		if (err) return res.json({success: false, error: err})
		comment.populate('post').populate('requirement').populate('newRelease')
		.populate('parent').populate('source').populate('author', (err, comment) => {
			if (err) return res.json({success: false, error: err})
			return res.json(comment)
		});
	});
}

deleteComment = (req, res) => {
	Comment.findByIdAndRemove ( req.params.id, ( err, comment) => {
		if (err) return res.json({success: false, error: err})
		comment.populate('post').populate('requirement').populate('newRelease')
		.populate('parent').populate('source').populate('author', (err, comment) => {
			if (err) return res.json({success: false, error: err})
			return res.json(comment)
		});
	});
}

retrieveComments = (req, res) => {
	const { postID, requirementID, newReleaseID, parentID, authorID, sourceCommentID, sort, limit, skip } = req.body;
	let query = Comment.find();
	if (postID) query.where('post').equals(postID);
	if (requirementID) query.where('requirement').equals(requirementID);
	if (newReleaseID) query.where('newRelease').equals(newReleaseID);
	if (parentID) query.where('parent').equals(parentID);
	if (authorID) query.where('author').equals(authorID);
	if (sourceCommentID) query.where('sourceComment').equals(sourceCommentID);
	if (limit) query.limit(Number(limit));
	if (skip) query.skip(Number(skip));
	query.populate('post').populate('requirement').populate('newRelease')
	.populate('parent').populate('sourcePost').populate('sourceComment').populate('author').exec((err, comments) => {
		if (err) return res.json({success: false, error: err });
		return res.json(comments);
	});
}


module.exports = { createComment, getComment, editComment, deleteComment, retrieveComments }