var express = require('express');
var http = require('http');
var session = require('express-session');
const app = express();

var server = http.createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: true
}));
var sess;
const admin = require('firebase-admin');
var serviceAccount = require("./contact-manager-89861-firebase-adminsdk-taeqj-6b873d1a2f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

app.post('/login', function(req, res) {
    var email = req.body.email;
    var upassword = req.body.upassword;
    var userref = db.collection('users');
    sess = req.session;
    var result = false;
    var query = userref.where('email', '==', email).where('upassword', '==', upassword).get()
        .then(snapshot => {
			snapshot.forEach(doc => {
                result = true;
                sess.email = email;
                sess.full_name = doc.data().full_name;

            });
            res.status(200).send(result);
		})
});

app.post('/register', function(req, res) {
    var full_name = req.body.full_name;
    var email = req.body.email;
    var upassword = req.body.upassword;
    var result = false;
    var user_ref = db.collection('users');
    var query = user_ref.where('email', '==', email).get()
        .then(snapshot => {
			snapshot.forEach(doc => {
                result = true;
			});

            if (result == false) {
                user_ref.doc(email).set({
                    full_name: full_name,
                    email: email,
                    upassword: upassword
                });
                res.status(200).send('Done');
            } else {
                res.status(200).send('Fail');
            }
        });
});

app.get('/user_contact_list', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
	var user_contact_ref = db.collection("user_contact").where('unique_email', '==', sess.email);
	user_contact_ref.get().then(snapshot => {
	var o = {};
	snapshot.forEach(doc => {
            result = true;
            o[doc.id] = [];
            o[doc.id].push(doc.data());
			});
        res.status(200).send(JSON.stringify(o));
		})
});

app.post('/user_contact', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var user_contact_ref = db.collection("user_contact");
    user_contact_ref.add({
        unique_email: sess.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });
	res.status(200).send('Done');
});

app.get('/user_contact', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var id = req.query.id;
    var user_contact_ref = db.collection("user_contact").doc(id);
	var getDoc = user_contact_ref.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(200).send('Not Found');
            } else {
                res.status(200).send(doc.data());
            }
        })
});

app.get('/contact_info', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var id = req.query.id;
    var contact_info_ref = db.collection("contact_info").doc(id);
	var getDoc = contact_info_ref.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(200).send('Not Found');
            } else {
                res.status(200).send(doc.data());
            }
        })
});

app.post('/contact_info', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var contact_info_ref = db.collection("contact_info");

    if (!req.body.group) {
        req.body.group = "";
    }
    if (!req.body.primary_email) {
        req.body.primary_email = "";
    }
    if (!req.body.primary_mobile) {
        req.body.primary_mobile = "";
    }
    if (!req.body.is_whatsapp) {
        req.body.is_whatsapp = "";
    }
    if (!req.body.work_phone) {
        req.body.work_phone = "";
    }
    if (!req.body.work_address) {
        req.body.work_address = "";
    }
    if (!req.body.home_address) {
        req.body.home_address = "";
    }

    contact_info_ref.doc(req.body.update_id).set({
        unique_email: sess.email,
		group: req.body.group,
        primary_email: req.body.primary_email,
        primary_mobile: req.body.primary_mobile,
        is_whatsapp: req.body.is_whatsapp,
        work_phone: req.body.work_phone,
        work_address: req.body.work_address,
        home_address: req.body.home_address
    });
	res.status(200).send('Done');
});

app.get('/additional_info', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var id = req.query.id;
    var additional_info_ref = db.collection("additional_info").doc(id);
	var getDoc = additional_info_ref.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(200).send('Not Found');
            } else {
                res.status(200).send(doc.data());
            }
        })
});

app.post('/additional_info', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var additional_info_ref = db.collection("additional_info");
    if (!req.body.gender) {
        req.body.gender = "";
    }
    if (!req.body.religion) {
        req.body.religion = "";
    }
    if (!req.body.date_of_birth) {
        req.body.date_of_birth = "";
    }
    if (!req.body.place_of_birth) {
        req.body.place_of_birth = "";
    }
    if (!req.body.height) {
        req.body.height = "";
    }
    if (!req.body.weight) {
        req.body.weight = "";
    }
    if (!req.body.company) {
        req.body.company = "";
    }
    if (!req.body.job_title) {
        req.body.job_title = "";
    }
    if (!req.body.industry) {
        req.body.industry = "";
    }

    additional_info_ref.doc(req.body.update_id).set({
        unique_email: sess.email,
        gender: req.body.gender,
        religion: req.body.religion,
        date_of_birth: req.body.date_of_birth,
        place_of_birth: req.body.place_of_birth,
        height: req.body.height,
        weight: req.body.weight,
        company: req.body.company,
        job_title: req.body.job_title,
        industry: req.body.industry
    });
	res.status(200).send('Done');
});

app.get('/social', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var id = req.query.id;
    var social_ref = db.collection("social").doc(id);
	var getDoc = social_ref.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(200).send('Not Found');
            } else {
                res.status(200).send(doc.data());
            }
        })
});

app.post('/social', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var social_ref = db.collection("social");
    if (!req.body.email) {
        req.body.email = "";
    }
    if (!req.body.facebook) {
        req.body.facebook = "";
    }
    if (!req.body.twitter) {
        req.body.twitter = "";
    }
    if (!req.body.instagram) {
        req.body.instagram = "";
    }
    if (!req.body.linkedin) {
        req.body.linkedin = "";
    }
    if (!req.body.skype) {
        req.body.skype = "";
    }
    if (!req.body.website) {
        req.body.website = "";
    }
    if (!req.body.youtube) {
        req.body.youtube = "";
    }

    social_ref.doc(req.body.update_id).set({
        unique_email: sess.email,
        email: req.body.email,
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        linkedin: req.body.linkedin,
        skype: req.body.skype,
        website: req.body.website,
        youtube: req.body.youtube
    });
	res.status(200).send('Done');
});

app.get('/notes', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var id = req.query.id;
    var notes_ref = db.collection("notes").doc(id);

    var getDoc = notes_ref.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(200).send('Not Found');
            } else {
                res.status(200).send(doc.data());
            }
        })
});

app.post('/notes', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var notes_ref = db.collection("notes");
    if (!req.body.notes) {
        req.body.notes = "";
    }
    notes_ref.doc(req.body.update_id).set({
        unique_email: sess.email,
        notes: req.body.notes
    });
	res.status(200).send('Done');
});


app.post('/add_new_deal', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var deals_ref = db.collection("deals");
    if (!req.body.deal_date) {
        req.body.deal_date = "";
    }
    if (!req.body.deal_amount) {
        req.body.deal_amount = "";
    }
    if (!req.body.deal_remark) {
        req.body.deal_remark = "";
    }
    if (!req.body.current_id) {
        req.body.current_id = "";
    }
    if (!req.body.full_name) {
        req.body.full_name = "";
    }
	deals_ref.add({
        unique_email: sess.email,
        current_id: req.body.current_id,
        deal_date: req.body.deal_date,
        full_name: req.body.full_name,
        deal_amount: req.body.deal_amount,
        deal_remark: req.body.deal_remark
    });
	res.status(200).send('Done');
});

app.post('/add_new_event', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var events_ref = db.collection("events");
    if (!req.body.event_date) {
        req.body.event_date = "";
    }
    if (!req.body.event_time) {
        req.body.event_time = "";
    }
    if (!req.body.event_remark) {
        req.body.event_remark = "";
    }
    if (!req.body.current_id) {
        req.body.current_id = "";
    }
    if (!req.body.full_name) {
        req.body.full_name = "";
    }

    events_ref.add({
        unique_email: sess.email,
        current_id: req.body.current_id,
        event_date: req.body.event_date,
        full_name: req.body.full_name,
        event_time: req.body.event_time,
        event_remark: req.body.event_remark
    });
	res.status(200).send('Done');
});

app.get('/get_deal_all', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var deal_ref = db.collection("deals");
    var query = deal_ref.where('unique_email', '==', sess.email).get()
        .then(snapshot => {
            var o = {};
			snapshot.forEach(doc => {
                result = true;
                o[doc.id] = [];
                o[doc.id].push(doc.data());

            });
            res.status(200).send(JSON.stringify(o));
			})
});

app.get('/get_event_all', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var event_ref = db.collection("events");
    var query = event_ref.where('unique_email', '==', sess.email).get()
        .then(snapshot => {
            var o = {};
			snapshot.forEach(doc => {
                result = true;
                o[doc.id] = [];
                o[doc.id].push(doc.data());
			});
            res.status(200).send(JSON.stringify(o));
        })
});

app.get('/get_deal_id_wise', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var deal_ref = db.collection("deals");
    var query = deal_ref.where('current_id', '==', req.query.id).get()
        .then(snapshot => {
            var o = {};
			snapshot.forEach(doc => {
				result = true;
                o[doc.id] = [];
                o[doc.id].push(doc.data());
				});
            res.status(200).send(JSON.stringify(o));
			})
});

app.get('/get_event_id_wise', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var event_ref = db.collection("events");
    var query = event_ref.where('current_id', '==', req.query.id).get()
        .then(snapshot => {
            var o = {};
			snapshot.forEach(doc => {
                result = true;
                o[doc.id] = [];
                o[doc.id].push(doc.data());
				});
            res.status(200).send(JSON.stringify(o));
			})
});

app.post('/change_profile_image', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var profile_image_ref = db.collection("profile_image");
    if (!req.body.image_data) {
        req.body.image_data = "";
    }
    if (!req.body.full_name) {
        req.body.full_name = "";
    }
    profile_image_ref.doc(req.body.current_id).set({
        unique_email: sess.email,
        image_data: req.body.image_data,
        full_name: req.body.full_name
    });
	res.status(200).send('Done');
});

app.get('/get_profile_image', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var id = req.query.id;
    var profile_image_ref = db.collection("profile_image").doc(id);

    var getDoc = profile_image_ref.get()
        .then(doc => {
            if (!doc.exists) {
                res.status(200).send('Not Found');
            } else {
                res.status(200).send(doc.data());
            }
        })
});

app.get('/get_contact_cards', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var profile_image_ref = db.collection("profile_image");
    var query = profile_image_ref.where('unique_email', '==', sess.email).get()
        .then(snapshot => {
            var o = {};
			snapshot.forEach(doc => {
                result = true;
                o[doc.id] = [];
                o[doc.id].push(doc.data());
				});
            res.status(200).send(JSON.stringify(o));
			})
});
app.get('/check_session', function(req, res) {
    sess = req.session;
	if (!sess.email) {
        res.status(200).send('Not');
    } else {
        res.status(200).send(sess.full_name);
    }
});

app.get('/edit_profile', function(req, res) {
    sess = req.session;
    var result = false;
    if (!sess.email) {
        res.redirect('/index.html');
    }
	var users_ref = db.collection("users").where('email', '==', sess.email);
	users_ref.get().then(snapshot => {
		var o = {};
		snapshot.forEach(doc => {
            result = true;
            o[doc.id] = [];
            o[doc.id].push(doc.data());
		});
        res.status(200).send(JSON.stringify(o));
	})
});

app.post('/update_user_profile', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var users_ref = db.collection("users")
    if (!req.body.email) {
        req.body.email = "";
    }
    if (!req.body.upassword) {
        req.body.upassword = "";
    }
    if (!req.body.full_name) {
        req.body.full_name = "";
    }
    users_ref.doc(req.body.email).set({
        full_name: req.body.full_name,
        email: req.body.email,
        upassword: req.body.upassword
    });

    res.status(200).send('Done');
});

app.post('/delete_detail', function(req, res) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/index.html');
    }
    var which = req.body.which;
    var id = req.body.id;
    if (which == 'full_contact') {
        var deleteDoc = db.collection('user_contact').doc(id).delete();
        var deleteDoc = db.collection('social').doc(id).delete();
        var deleteDoc = db.collection('profile_image').doc(id).delete();
        var deleteDoc = db.collection('notes').doc(id).delete();
        var deleteDoc = db.collection('contact_info').doc(id).delete();
        var deleteDoc = db.collection('additional_info').doc(id).delete();

        var query = db.collection('deals').where('current_id', '==', id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var deleteDoc = db.collection('deals').doc(doc.id).delete();;
                });
            })
        var query = db.collection('events').where('current_id', '==', id).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var deleteDoc = db.collection('events').doc(doc.id).delete();;
                });
            })
    }
    if (which == 'deal') {
        var deleteDoc = db.collection('deals').doc(id).delete();
    }
    if (which == 'event') {
        var deleteDoc = db.collection('events').doc(id).delete();
    }
    res.status(200).send('Done');

});
app.use('/', express.static(__dirname + '/public/'));
app.listen(3003);