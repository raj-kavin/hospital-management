
		const express = require('express');
		const router = express.Router();
		const Patient = require('../models/Patient');
		const Diagnosis = require('../models/Diagnosis');
		const {ensureAuthenticated} = require('../config/auth');

			router.get('/', (req, res) => res.render('welcome'));

			router.get('/dashboard', ensureAuthenticated, (req, res) => 
				res.render('dashboard', {
					user:req.user.username,
					id: req.user.id
				}));

			router.get('/addpatient', ensureAuthenticated, (req, res) =>
				res.render('add_patient',{user:req.user.username, id: req.user.id}));

			router.post('/addpatient', (req, res) => {
				const {firstname, lastname, sex, phoneNumber,status, bg, genotype, nationality} = req.body;
				//console.log(req.body);
				let errors = [];

 if(!firstname || !lastname || !sex || !phoneNumber || !status || !bg || !genotype || !nationality) {
			 
				errors.push({msg: "Some fields are missing. Please fill all the fields"});
			}

			if(errors.length > 0) {
				res.render('add_patient', {
					user:req.user.username,
					id: req.user.id,
					errors,
					firstname,
					lastname,
					sex,
					phoneNumber,
					status,
					bg,
					genotype,
					nationality
				});
			} else {

			const newPatient = new Patient({
				firstname,
				lastname,
				sex,
				phoneNumber,
				maritalStatus:status,
				bloodGroup:bg,
				genotype,
				nationality,
				username:req.user.username
			});

				//console.log(newMember);
				newPatient.save()   //THIS WILL GIVE US A PROMISE
					.then(patient => {   //GIVE US THE USER BACK AND REDIRECT TO LOGIN PAGE
							req.flash('success_msg', "Data Successfully Captured");
							res.redirect('/addpatient');
					})
					.catch(err => console.log(err));
				}
			});





			router.get('/viewpatient', ensureAuthenticated, (req, res) =>

				Patient.find({username:req.user.username}, (err, result) => {

						if(err) throw err;
						res.render('view_patient', {
						user:req.user.username,
						id: req.user.id,
						result:result
				 	})
				})
		);


			router.get('/adddiagnosis', ensureAuthenticated, (req, res) =>
				res.render('add_diagnosis',{
					user:req.user.username,
					id: req.user.id
				}));


			router.post('/adddiagnosis', (req, res) => {
			const {patientid, complaint, recommendation} = req.body;

			const newDiagnosis = new Diagnosis({
				patientid,
				username:req.user.username,
				complaint,
				recommendation,
				
			});

				//console.log(newMember);
				newDiagnosis.save()   //THIS WILL GIVE US A PROMISE
					.then(diagnosis => {   //GIVE US THE USER BACK AND REDIRECT TO LOGIN PAGE
							req.flash('success_msg', "Data Successfully Captured");
							res.redirect('/adddiagnosis');
					})
					.catch(err => console.log(err));
		});


		router.get('/viewdiagnosis/:patientid', ensureAuthenticated, (req, res) =>

				Diagnosis.find({patientid:req.params.patientid}, (err, result) => {

						if(err) throw err;
						//console.log(result);
						res.render('view_diagnosis', {
						user:req.user.username,
						id: req.user.id,
						result:result
				 	})

				})
		);


		module.exports = router;