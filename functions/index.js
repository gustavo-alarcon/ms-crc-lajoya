const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const gcs = require('@google-cloud/storage')();
// const os = require('os');
// const path = require('path');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');
// const Busboy = require('busboy');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
let app = admin.initializeApp();

exports.msCreateUser = functions.https.onRequest((req, res) => {

  cors(req, res, () => {
    var params = req.query;

    app.auth().createUser({
      email: params['email'],
      emailVerified: false,
      password: params['password'],
      displayName: params['displayName'],
      disabled: false
    })
      .then(userRecord => {
        console.log("Successfully created new user:", userRecord.uid);
        res.send({
          result: "OK",
          uid: userRecord.uid
        })
        return true;
      })
      .catch(error => {
        console.log("Error creating new user:", error);
        res.send({
          result: "ERROR",
          code: error['errorInfo']['code']
        })
        return false;
      });
  })

});

exports.msUpdateUser = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var params = req.query;
    console.log(params);

    app.auth().updateUser(params['uid'], {
      displayName: params['displayName'],
      email: params['email'],
      password: params['password']
    })
      .then(userRecord => {
        console.log("Successfully updated user");
        res.send({
          result: "OK"
        })
        return true;
      })
      .catch(error => {
        res.send({
          result: "ERROR",
          code: error['errorInfo']['code']
        })
        console.log("Error updating user:", error);
        return false;
      })
  })
})

exports.msDeleteUser = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var params = req.query;

    admin.auth().deleteUser(params['uid'])
      .then(() => {
        console.log('Successfully deleted user');
        res.send({
          result: "OK"
        })
        return true;
      })
      .catch(error => {
        console.log('Error deleting user:', error);
        res.send({
          result: "ERROR",
          code: error['errorInfo']['code']
        })
        console.log("Error updating user:", error);
        return false;
      });
  })
})

exports.msUpdatePassword = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var params = req.query;

    app.auth().updateUser(params['uid'], {
      password: params['password']
    })
      .then(userRecord => {
        console.log("Successfully updated user");
        res.send({
          result: "OK"
        })
        return true;
      })
      .catch(error => {
        res.send({
          result: "ERROR",
          code: error['errorInfo']['code']
        })
        console.log("Error updating user:", error);
        return false;
      })
  })
})

exports.msMailer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var params = req.query;
    console.log(params);
    let receivers = params.receivers.split(',');
    let subject = '';
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'gestioncrclajoya@meraki-s.com', // generated ethereal user
        pass: 'gestioncrclajoya2019' // generated ethereal password
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    // send mail with defined transport object
    transporter.sendMail({
      from: '"Gestión CRC La Joya" <gestioncrclajoya@meraki-s.com>', // sender address
      to: 'galarcon@meraki-s.com',//"bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: 
      `
        <h1>Gestión CRC La Joya</h1>
        
      `
    }, (err,info) => {

      console.log(err);
      
      console.log("Message sent: %s", info);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      res.send({
        result: {
          info: info,
          receivers: receivers
        }
      })
      return true;
    });

    

    
    
  })
})

