const mongoose = require('mongoose');

//treatment schema
const treatmentSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	carid: {type: Number, required: true},
	customername: {type: String, required: true},
	customerid: {type: Number, required: true},
	status: {type: String, enum : ['Waiting','In process', 'Done'], required: true},
	details: {type: String, required: true},
	date: {type: Date, default: Date.now, required: true}
});

module.exports = Treatment = mongoose.model('Treatment',treatmentSchema);