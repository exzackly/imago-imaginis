const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
var diskspace = require('diskspace');

const config = require('../../config.js');

/**
 * Performs JWT verification. Returns true if JWT is valid and user is a paid user, otherwise returns error
 * Used for authenticated routes that can be accessible only by a paid user.
 */
var verifyAdmin = async function(user_id){
    let queryText = "SELECT * FROM ASP_USERS WHERE user_ID = $1;";
    let values = [user_id];
    result = await db.param_query(queryText, values)
    console.log(result.rows[0])
    if(result.rows[0].admin == null || result.rows[0].admin == false){
        getres.status(304);
        getres.statusMessage = "Unauthorized request";
        getres.send("Only admins may access this route");
        return false;
    }
    return true;
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
   * Get all system stats
   * Takes in the request query's parameters
   */
  app.get('/system/stats', async (req, getres) => {
    console.log("GET - system stats");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
        let queryText = "SELECT * FROM USAGE INNER JOIN STAT_TYPES ON USAGE.stat_id = STAT_TYPES.stat_id";
        console.log(queryText)
        db.query(queryText)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    }
  });
    
    // Get all flagged photos
app.get('/system/stats/photos/flagged', async (req, getres) => {
    console.log("GET - flagged photos");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        // If they're admin API user and trying to access API not thru website
        if(!isAdmin){
          // If they're not admin, isAdmin returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.flag = true";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all flagged videos
app.get('/system/stats/videos/flagged', async (req, getres) => {
    console.log("GET - flagged videos");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT videos.photo_id, user_video.user_id, videos.creation_date FROM photos, user_video WHERE videos.video_id = user_video.video_id AND videos.flag = true";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

    
 
// Get all photos being processed
app.get('/system/stats/photos/processing', async (req, getres) => {
    console.log("GET - processing photos");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT user_photo.unfiltered_photo_ID, user_photo.filter_id, user_photo.wait_time, user_photo.user_id FROM user_photo WHERE status = 'processing'";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });
    
    
// Get all videos being processed
app.get('/system/stats/videos/processing', async (req, getres) => {
    console.log("GET - processing videos");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT user_video.unfiltered_video_ID, user_video.filter_id, user_video.wait_time, user_video.user_id FROM user_video WHERE status = 'processing'";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });
       
    
// Get all uploads from past day
app.get('/system/stats/uploads/pastday', async (req, getres) => {
    console.log("GET - uploads from past day");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '1 day' AND LOCALTIMESTAMP";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });   

    
// Get all uploads from past week
app.get('/system/stats/uploads/pastweek', async (req, getres) => {
    console.log("GET - uploads from past week");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '7 days' AND LOCALTIMESTAMP";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });    
    

// Get all uploads from past month
app.get('/system/stats/uploads/pastmonth', async (req, getres) => {
    console.log("GET - uploads from past month");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '1 month' AND LOCALTIMESTAMP";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });    
  
    

//Get space used by DB
app.get('/system/stats/db/spaceused', async (req, getres) => {
    console.log("GET - space used by db");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    let queryText = "select pg_size_pretty(pg_database_size('aspdb'))";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });
    
// Get diskspace used by linux filesystem: free, used, and total (as well as health status)
app.get('/system/stats/filesystem/spaceused', async (req, getres) => {
    console.log("GET - space used by filesystem");
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if(user_id == null){
      return; // Authorization failed
    }
    else{
      var isAdmin = await verifyAdmin(user_id);
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
        if(!isAdmin){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
    diskspace.check('/', function (err, result)
    {
        getres.send(result);
    });
}
  }); 
    

// Get diskspace used by Windows filesystem: free, used, and total (as well as health status)
//app.get('/system/stats/filesystem/spaceused', (req, getres) => {
//    console.log("GET - space used by filesystem");
//      
//    diskspace.check('C', function (err, result)
//    {
//        getres.send(result);
//    });
//  }); 
  
  
}
