const fs = require('fs');
const request = require('request');
const config = require('../../config.js');

const selectImagePath = 'style/selectImage';
const insertImagePath = 'style/insertImage';
const selectRunPath = 'style/selectRun';
const insertRunPath = 'style/insertRun';

const log = (msg) => {console.log("DB: " + msg)};

module.exports = {

  // Retrieve an image from the database
  selectImage: async function(imageId) {
    let options = {
      form: { imageId: imageId },
      url: config.dbUrl + selectImagePath,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    request(options, (err, res, body) => {
      fs.writeFile(`${config.imageDir}/image-${imageId}.jpg`, body, () => {
        // Action after file is written
        if (err) {
          // On file write error
          log(err);
        }
      });
    });
  },

  // Load an image into the database
  insertImage: async function(imageId) {
    let imagePath = `${config.imageDir}/image-${imageId}.jpg`;
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.log(`Could not read image ${imagePath}.`);
        return;
      }

      options = { 
        form: {
          imageData: data,
          imageId: imageId
        },
        url: `${config.dbUrl}${insertImagePath}`,
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data'},
      };
      request(options, (err, res, body) => {
        if (err) {
          log(err);
        }
        console.log('send complete');
      });
    });
  },

  // Get run information from database
  selectRun: async function(runId) {
    // Sample data

    let requestSettings = {
      url: config.dbUrl + getImagePath,
      method: 'GET',
      encoding: null,
      qs: { runId: runId }
    };

    request(requestSettings, (err, res, body) => {
      if (err) {
        // Action on error
        log(err);
      }
      console.log(body);
      return body;
    });

    /*
    let runParams = {
      runId : 2401,
      contentPath : config.imageDir + 'cornell.jpg',
      contentSize : 32,
      stylePath : config.imageDir + 'woman_in_peasant_dress.jpg',
      styleSize : 32
    };
    return runParams;
    */
  },

  // Send run information to database
  insertRun: async function(run) {
    options = { 
      body: run,
      url: `http://localhost:8001/${sendImagePath}`,
      encoding: null,
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}
    };
    request(options, (err, res, body) => {
      console.log('send complete');
    });
  }
}
