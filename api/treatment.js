const Treatment = require('../models/treatment');
const Counter = require('../models/counter');
const htmlspecialchars = require('htmlspecialchars');

module.exports = function (app, pageLocation) {
	
	//init treatment schema => _id is increment key
	var counter = new Counter({_id: Treatment.collection.collectionName});
	counter.save(err => {
		if(err) console.log('Counter of treatment is already exists');
	});
   
	//get all treatments
	app.get(pageLocation, function(req, res) {	
		if(!req.session.user) return res.json({response : 'Error'}); //block guests
		
		Treatment.find({}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			return res.json(result);
		});
	});
	
	//add new treatment
	app.post(pageLocation, function(req, res) {
		if(!req.session.user) return res.json({response : 'Error'}); //block guests
		
		Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
			if(err) return res.json({response : 'Error'});
			
			req.body._id = result.seq;
			var newTreatment = new Treatment(req.body);
			newTreatment.customer = htmlspecialchars(newTreatment.customer); //prevet html injection
			newTreatment.status = htmlspecialchars(newTreatment.status); //prevet html injection
			newTreatment.details = htmlspecialchars(newTreatment.details); //prevet html injection
			newTreatment.save((err, result) => {
				if(err) return res.json({response : 'Error'});
				
				return res.json({response : 'Success', msg : 'Treatment number ' + result._id + ' added'}); 
			});
		});
	});
	
	//update treatment
	app.put(pageLocation + '/:id', function(req, res) {
		if(!req.session.user) return res.json({response : 'Error'}); //block guests
		
		req.body._id = req.params.id;
		var updateTreatment =  new Treatment(req.body);
		updateTreatment.customer = htmlspecialchars(updateTreatment.customer); //prevet html injection
		updateTreatment.status = htmlspecialchars(updateTreatment.status); //prevet html injection
		updateTreatment.details = htmlspecialchars(updateTreatment.details); //prevet html injection
		updateTreatment.date = Date.now();
		Treatment.findByIdAndUpdate(updateTreatment, { $set: updateTreatment }, (err, result) => {
			if(err || result == null) return res.json({response : 'Error'});
			
			return res.json({response : 'Success', msg : 'Treatment number ' + updateTreatment._id + ' was updated'}); 
		});
	});
	
	//delete treatment
	app.delete(pageLocation + '/:id', function(req, res) {
		if(!req.session.user) return res.json({response : 'Error'}); //block guests

		Treatment.findByIdAndRemove({_id : Number(req.params.id)}, (err, result) => {
			if (err) return res.json({response : 'Error'});
			
			if(result == null) return res.json({response : 'Error', msg : 'Treatment doesnt exist'}); 
			return res.json({response : 'Success', msg : 'Treatment number ' + Number(req.params.id) + ' was deleted'}); 
		});
	});
};