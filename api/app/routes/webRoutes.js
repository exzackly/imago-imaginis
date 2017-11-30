const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require('../../config.js');

/**
 * Performs JWT verification. Returns true if JWT is valid and user is a paid user, otherwise returns error
 * Used for authenticated routes that can be accessible only by a paid user.
 */
var verifyPaid = async function(user_id){
    // Return true if jwt is paid user, else return false
    // Look up user id and see if they're a paid user
    let queryText = "SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE user_ID = $1;";
    let values = [user_id];
    result = await db.param_query(queryText, values)
    console.log(result.rows[0])
    if(result.rows[0].paid_id != null){
      return true;
    }
    else{
      // They are a free user
      return false;
    }
  }
  
  // Verifies if JWT is good
  var getUserIdFromJWT = function(req, getres){
    console.log("Performing JWT verification")
    var token;
    // JWT is passed either in query or in body
    if(req.query.jwt != null){
        token = req.query.jwt;
    }
    else if(req.body.jwt != null){
        token = req.body.jwt;
    }
    try{
        var decoded = jwt.verify(token, "thisisthekey");
        return decoded.user_id;
    }
    catch(err){
      getres.status(800);
      getres.statusMessage = "Invalid JWT token";
      getres.send("Invalid JWT token. Please pass a valid JWT token.");
      return null;
    }
  }

module.exports = function(app) {
    /**
     * Returns all filter ids and their names
     */
    app.get('/filters', async (req, getres) => {
        console.log("GET - filters");
        // Making sure paid user or website is accessing the API
        // This performs the JWT authorization
        if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // This performs the JWT authorization
            var user_id = getUserIdFromJWT(req, getres);
            if(user_id == null){
              return; // Authorization failed
            }
            var isPaid = await verifyPaid(user_id);
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(0);
        let queryText = 'SELECT * FROM filters WHERE preset = true';
        db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    });


    /**
     * Get filter path based on passed filter_id
     * Takes in the request query's parameters
     */
    app.get('/filter', async (req, getres) => {
        console.log("GET - filter path for id");
        if(req.query.id == null){
            getres.send(310);
            getres.statusMessage = "Missing Filter ID";
            getres.send("Please specify a filter id.")
        }
        // Making sure paid user or website is accessing the API
        // This performs the JWT authorization
        if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // This performs the JWT authorization
            var user_id = getUserIdFromJWT(req, getres);
            if(user_id == null){
              return; // Authorization failed
            }
            var isPaid = await verifyPaid(user_id);
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(0);
        var id = req.query.id;
        let queryText = "SELECT path FROM FILTERS WHERE filter_id = $1";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Set a photo as reported on passed photo_id
     * Takes in the request body's parameters
     */
    app.post('/report/photo', async (req, getres) => {
        console.log("POST - set photo reported with id");
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          var isPaid = await verifyPaid(user_id);
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(0);
        var id = req.body.id;
        var queryText = "UPDATE PHOTOS SET flag = TRUE WHERE photo_id = $1;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                if (res != undefined) {
                    console.log("Photo flagging successful!");
                    getres.send("Photo flagging successful!");
                } else {
                    getres.send("Photo flagging failed");
                }
            })
            .catch(e => console.error(e.stack))
        }
    });
	
}