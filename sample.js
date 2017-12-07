'use strict';

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // An action is a string used to identify what needs to be done in fulfillment
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters

  // Parameters are any entites that Dialogflow has extracted from the request.
  const parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters

  // Initialize DialogflowApp
  const app = new DialogflowApp({request: request, response: response});

  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    'input.game': () => {
      const hands = [ 'rock', 'paper', 'scissor' ];
      const hand = hands[ Math.floor( Math.random() * hands.length ) ] ;
      console.log('User hand: ' + parameters.hand + ', Game hand: ' + hand);
      switch (parameters.hand) {
        case 'rock':
          app.ask('グー、あいこで…');
          break;
        case 'paper':
          app.ask('パー、あいこで…');
          break;
        case 'scissor':
          app.ask('チョキ、あいこで…');
          break;
      }
    },
    // Default handler for unknown or undefined actions
    'default': () => {
      app.tell('なんかエラーかも'); // Send simple response to user
    }
  };

  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();
});
