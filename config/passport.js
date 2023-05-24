
	const LocalStrategy = require('passport-local').Strategy,
	      mongoose = require('mongoose'),
	      bcrypt = require('bcryptjs');

	 const Personnel = require('../models/Doctors');

	 module.exports = function(passport){
	 	passport.use(
	 		new LocalStrategy({usernameField:'username'}, (username, password, done) =>{
	 			//Match User
	 			Personnel.findOne({username:username})
	 			.then(doctor => {
	 				if(!doctor){
	 					return done(null, false, {message:'Unregistered Username'});
	 				}

	 				//MATCH PASSWORD
	 				bcrypt.compare(password, doctor.password, (err, isMatch)=>{
	 					if(err) throw err;

	 					if(isMatch){
	 						return done(null, doctor);
	 					} else {
	 						return done(null, false, {message:'Password Incorrect'});
	 					}
	 				});
	 			})
	 			.catch(err => console.log(err));
	 		})
	 		);

	 			passport.serializeUser((doctor, done) => {
		  			done(null, doctor.id);
		  		});

		  		passport.deserializeUser((id, done) => {

		  			Personnel.findById(id, (err, doctor) => {
		  				done(err, doctor);
		  			});
		  		});

	 }