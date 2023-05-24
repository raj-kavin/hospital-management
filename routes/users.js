
		const express = require('express');
		const router = express.Router();
		const bcrypt = require('bcryptjs');
		const passport = require('passport');

			router.get('/login', (req, res) => res.render('login'));

			router.get('/register', (req, res) => res.render('register'));

			const Doctor = require('../models/Doctors');

			//REGISTRATION HANDLE
			router.post('/register', (req, res) => {
				// console.log(req.body);
				// res.send("Hello");

				const {firstname, lastname, gender, phoneNumber, qualification, specialization, nationality, registrationNumber, hospitalName, username, password, password1} = req.body;
			
			let errors = [];
			//Check Required Fields
			if(!firstname || !lastname || !gender || !phoneNumber || !qualification || !specialization || !nationality || !registrationNumber || !hospitalName || !username || !password || !password1) {
				errors.push({msg:"No field should be empty"});
			}

			if(password !== password1) errors.push({msg: "Passwords do not match"});

			if(password.length < 6){
				errors.push({msg:"password should be atleast 6 characters"});
			}

					if(errors.length > 0) {
				res.render('register', {
					errors,
					firstname,
					lastname,
					gender,
					phoneNumber,
					qualification,
					specialization,
					nationality,
					registrationNumber,
					hospitalName,
					username,
					password,
					password1
				});
			} else {
				Doctor.findOne({username:username})
				.then(doctor => {
					if(doctor){
						errors.push({msg:"You can't use this username. Please opt for another"});
						res.render('register', {
							errors,
							firstname,
							lastname,
							gender,
							phoneNumber,
							qualification,
							specialization,
							nationality,
							registrationNumber,
							hospitalName,
							username,
							password,
							password1
						});
					} else {
						const newDoctor = new Doctor({

							firstname,
							lastname,
							gender,
							phoneNumber,
							qualification,
							specialization,
							nationality,
							registrationNumber,
							hospitalName,
							username,
							password
							
						});

					bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newDoctor.password, salt, (err,hash) =>{

					if(err) throw err;

					//SET PASSWORD TO HASHED
					newDoctor.password = hash;

					//SAVE NEW USER
					newDoctor.save()   //THIS WILL GIVE US A PROMISE
					.then(doctor => {   //GIVE US THE USER BACK AND REDIRECT TO LOGIN PAGE
							req.flash('success_msg', "You are now registered and can login");
							res.redirect('/login');
					})
					.catch(err => console.log(err));
						} ))
					}
				})
			};

	});


	//Login Handle\
		router.post('/login', (req, res, next) => {
			passport.authenticate('local', {
				successRedirect: '/dashboard',
				failureRedirect: '/login',
				failureFlash: true
			})(req, res, next);
		});



		//Logout Handle
		router.get('/logout', (req, res) =>{
			req.logout();
			req.flash('success_msg', 'You are now logged out');
			res.redirect('/login');
		})



		module.exports = router;