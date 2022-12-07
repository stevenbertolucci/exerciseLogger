/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
import 'dotenv/config';
import * as exercises from './exercise_model.js';
import express from 'express';
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const PORT = process.env.PORT;

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

// Validation Functions
function isEmpty(name, reps, weight, unit, date) {
  if (name === undefined || reps === undefined || weight === undefined || unit === undefined || date === undefined) {
      return false;
  } else {
      return true;
  }
}

function nameIsValid(name) {
  if (typeof name !== "string" || name.match(/^[0-9`!@#$%^&*()_+-={}'[;:'",<>./]+$/i) || name.length < 1) {
      return false;
  } else {
      return true;
  }
}

function repsIsValid(reps) {
  if (isNaN(reps) || reps < 1) {
      return false; 
  } else {
      return true;
  }
}

function weightIsValid(weight) {
  if (isNaN(weight) || weight < 1) {
      return false;
  } else {
      return true;
  }
}

function unitIsValid(unit) {
  if (typeof unit !== "string" || (unit !== 'kgs') && unit !== 'lbs') {
      return false;
  } else {
      return true;
  }
}

function isDateValid(date) {
  const format = /^\d\d-\d\d-\d\d$/;
  return format.test(date);
}

// Create a new exercise with name, reps, weight, unit, and date in the body
app.post('/exercises', (req, res) => {
  let filter = {}; 
  // Validate the req body. If it returns true, create the exercise and send a response. If it returns false, send 'Invalid request' 
  if (isEmpty(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date) 
          && nameIsValid(req.body.name)
          && repsIsValid(req.body.reps)
          && weightIsValid(req.body.weight)
          && unitIsValid(req.body.unit)
          && isDateValid(req.body.date)) {
              filter.name = req.body.name;
              filter.reps = req.body.reps;
              filter.weight = req.body.weight;
              filter.unit = req.body.unit;
              filter.date = req.body.date;

              exercises.createExercise(filter.name, filter.reps, filter.weight, filter.unit, filter.date)
              .then(exercises => {
                  res.status(201).json(exercises);
              })
              .catch(error => {
                  console.error(error);
                  res.sendStatus(400).json({Error: 'Invalid Request'});
              });
      } else {
      res.sendStatus(400).json(exercises);
      }
});

// Display (Retrieve) all exercises from the database
app.get('/exercises', (req, res) => {
  let filter = {}; 
  if (req.query.name != undefined) {
      filter.name = req.query.name; 
  }
  if (req.query.reps != undefined) {
      filter.reps = req.query.reps; 
  }
  if (req.query.weight != undefined) {
      filter.weight = req.query.weight; 
  }
  if (req.query.unit != undefined) {
      filter.unit = req.query.unit; 
  }
  if (req.query.date != undefined) {
      filter.date = req.query.date; 
  }

  exercises.findExercise(filter, '',  0)
      .then(exercises => {
          res.send(exercises);
      })
      .catch(error => {
          console.error(error);
          res.send({Error: 'Request failed'});
      });
});

// Display an exercise using the id provided in the URL
app.get('/exercises/:_id', (req, res) => {
  const exerciseId = req.params._id;
  exercises.findExerciseById(exerciseId)
      .then(exercises => {
          if (exercises !== null) {
              res.json(exercises);
          } else {
              res.status(404).json({Error: "Resource not found"});
          }
      })
      .catch(error => {
          res.status(400).json({Error: "Request failed"});
      });
});

// Update exercise using id that was provided in the path parameter and set the name, reps, weight, unit, and date  in the body
app.put('/exercises/:_id', (req, res) => {
  const filter = {};
  if (isEmpty(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date) 
          && nameIsValid(req.body.name)
          && repsIsValid(req.body.reps)
          && weightIsValid(req.body.weight)
          && unitIsValid(req.body.unit)
          && isDateValid(req.body.date)) {
              filter.name = req.body.name;
              filter.reps = req.body.reps;
              filter.weight = req.body.weight;
              filter.unit = req.body.unit;
              filter.date = req.body.date;
              exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
              .then(numUpdated => {
                  if (numUpdated === 1) {
                      res.json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date})
                  } else {
                      res.json(404).json({Error: 'Error: not found'});
                  }
              })
              .catch(error => {
                  console.error(error);
                  res.status(400).json({Error: 'Request failed'});
              });
  } else {
      res.sendStatus(400).json(exercises);
  }
});

// Delete exercise when provided by id in the query parameter
app.delete('/exercises/:_id', (req, res) => {
  exercises.deleteById(req.params._id)
      .then(deletedCount => {
          if (deletedCount === 1) {
              res.status(204).send()
          } else {
              res.status(404).json({Error: 'Error: not found'});
          }
      })
      .catch(error => {
          console.error(error);
          res.send({error: 'Request failed'});
      });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
