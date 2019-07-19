const TimeBlock = require('../../models/roadmap/TimeBlock');
var mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

getTimeBlock = (req, res) => {
    const id = req.params.id;
    TimeBlock.findById(id).populate('roadmap').exec(function(err, timeblock) {
        if (err) return res.json({success: false, error: err});
        return res.json(timeblock);
    });
}

createTimeBlock = (req, res) => {
    const { title, roadmapID, beginDate, endDate } = req.body;
    let timeblock = new TimeBlock(
        {
            created: new Date(),
            title: title,
            roadmap: ObjectId(roadmapID)
        }
    );
    if (beginDate) timeblock.beginDate = beginDate;
    if (endDate) timeblock.endDate = endDate;
    timeblock.save((err, timeblock) => {
        if (err) return res.json({success: false, error: err});
        timeblock.populate('roadmap', (err, timeblock) => {
            if (err) return res.json({success: false, error: err});
            return res.json(timeblock);
        });
    });
}

editTimeBlock = (req, res) => {
    const { id } = req.params;
    const { title, beginDate, endDate } = req.body;
    let update = {};
    if (title) update.title = title; 
    if (beginDate) update.beginDate = beginDate;
    if (endDate) update.endDate = endDate;
    TimeBlock.findByIdAndUpdate(id, {$set: update}, {new: true}, (err, timeblock) => {
        if (err) return res.json({ success: false, error: err });
        timeblock.populate('roadmap', (err, timeblock) => {
            if (err) return res.json({success: false, error: err});
            return res.json(timeblock);
        });
    });
}

deleteTimeBlock = (req, res) => {
    const id = req.params.id;
    TimeBlock.findByIdAndRemove(id, (err, timeblock) => {
        if (err) return res.send(err);
        timeblock.populate('roadmap', (err, timeblock) => {
            if (err) return res.json({success: false, error: err});
            return res.json(timeblock);
        });
    });
}

retrieveTimeBlocks = (req, res) => {
    const { roadmapID, title, beginDate, endDate } = req.body;
	let query = TimeBlock.find();
	if (roadmapID) query.where('roadmap').equals(roadmapID);
	query.populate('roadmap').exec((err, timeblocks) => {
		if (err) return res.json({success: false, error: err });
		return res.json(timeblocks);
	});
}

module.exports = { getTimeBlock, createTimeBlock, editTimeBlock, deleteTimeBlock, retrieveTimeBlocks };