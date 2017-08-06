// app/routes.js
var mysql = require('mysql');
var connection = mysql.createConnection(
  {
    host: 'sql3.freemysqlhosting.net',
    user: 'sql3188768',
    password: 'EWcTC7hBG1',
    database: 'sql3188768'
  }
);

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	app.get('/hello', function(req, res) {
		res.send("Hello World!");
	});
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	app.get('/profile', isLoggedIn, function(req, res) {

		connection.query("SELECT * FROM Books", function(err, rows) {


			if (err){
				console.log(err);
			}
			if (rows.length) {
				if(req.user.profile > 1){
					res.render('publisher.ejs', {
						user : req.user,
						books : rows
					});
				}else {
					res.render('reader.ejs', {
						user : req.user,
						books : rows
					});
				}
			}else {
				if(req.user.profile > 1){
					res.render('publisher.ejs', {
						user : req.user,
						books : rows
					});
				} else {
					res.render('reader.ejs', {
						user : req.user,
						books : rows
					});
				}
			}
		});


	});

	// =====================================
	// Save a ew Book ======================
	// =====================================
	app.post('/newbook',function (req,res) {
		var insertQuery = "INSERT INTO Books ( Nombre, Autor) values (?,?)";
		connection.query(insertQuery,[req.body.nombre, req.body.autor],function(err, rows) {
			if(err){
				console.log(err);
			}
		});
		res.redirect('/profile');
	});
	// =====================================
	// Delete a book =======================
	// =====================================
	app.post('/deletebook', function(req, res) {
		var insertQuery = "DELETE FROM Books WHERE id = ?";
		connection.query(insertQuery,[req.body.deletebook],function(err, rows) {
			if(err){
				console.log(err);
			}
		});
		res.redirect('/profile');
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
