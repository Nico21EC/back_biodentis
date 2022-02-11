const response20 = require("express")

'üse strict'
const apiai = require("apiai");
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const axios = require("axios");

const config = require("../config/config.js");
const { receiveMessageOnPort } = require("worker_threads");
const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN,{
  language: "en",
  requestSource: "fb"
});

const sessionIds = new Map();

exports.facebookVerification = (req, res) => {
  console.log("request");
  console.log(req);
  if (
    
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === config.FB_VERIFY_TOKEN
  ) {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.log(res);
    console.error("Failed validation. Asegurese que los tokens coincidan");
    res.sendStatus(403);
  }
};

exports.facebookDialog = (req, res) => {
  var data = req.body;
  if(data.object == "page"){
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      pageEntry.messaging.forEach(function (messagingEvent){
        if(messagingEvent.message){
          receiveMessage(messagingEvent);
        }else{
          console.log("Webhook received unknown messagingEvent:", messagingEvent);
        }
      });
    });
    res.sendStatus(200);
  }
}

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  if(!sessionIds.has(senderID)){
    sessionIds.set(senderID,uuid.v1());
  }

  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  if(messageText){
    sendToApiAi (senderID, messageText);
  }else if(messageAttachments){
    handleMessageAttachments(messageAttachments, senderID);
  }
}

/*
const config = require("../config/config");
var Esquema=require('./citaFacebookModel.ts');
const dialogflow = require("./dialogflow");
const uuid = require("uuid");
const axios = require("axios");
const { structProtoToJson } = require("./structFunctions");
const request = require("express");
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
*/
/*
exports.facebookCitas =(req, res) => {
        if (
          req.query["hub.mode"] === "subscribe" &&
          req.query["hub.verify_token"] === config.FB_VERIFY_TOKEN
        ) {
          res.status(200).send(req.query["hub.challenge"]);
        } else {
          console.error("Failed validation. Make sure the validation tokens match.");
          res.sendStatus(403);
        }
 };

 
 exports.facebookConnection = (req, res)=> {
  const agent = new WebhookClient({ request:req , response:res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function IniciarConversacion(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
 }
 

 
 exports.facebookwebhook= (req, res) => {
   
        var data = req.body;
        // Make sure this is a page subscription
        if (data.object == "page") {
          // Iterate over each entry
          // There may be multiple if batched
          data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
      
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
              if (messagingEvent.message) {
                receivedMessage(messagingEvent);
              } else if (messagingEvent.postback) {
                receivedPostback(messagingEvent);
              } else {
                console.log(
                  "Webhook received unknown messagingEvent: ",
                  messagingEvent
                );
              }
            });
          });
        }
    };


// Messenger API parameters
if (!config.FB_PAGE_TOKEN) {
  throw new Error("missing FB_PAGE_TOKEN");
}
if (!config.FB_VERIFY_TOKEN) {
  throw new Error("missing FB_VERIFY_TOKEN");
}
if (!config.GOOGLE_PROJECT_ID) {
  throw new Error("missing GOOGLE_PROJECT_ID");
}
if (!config.DF_LANGUAGE_CODE) {
  throw new Error("missing DF_LANGUAGE_CODE");
}
if (!config.GOOGLE_CLIENT_EMAIL) {
  throw new Error("missing GOOGLE_CLIENT_EMAIL");
}
if (!config.GOOGLE_PRIVATE_KEY) {
  throw new Error("missing GOOGLE_PRIVATE_KEY");
}
if (!config.FB_APP_SECRET) {
  throw new Error("missing FB_APP_SECRET");
}

const sessionIds = new Map();

// for Facebook verification


//for webhook facebook

async function receivedMessage(event) {
  var senderId = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  console.log(
    "Received message for user %d and page %d at %d with message:",
    senderId,
    recipientID,
    timeOfMessage
  );

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    handleEcho(messageId, appId, metadata);
    return;
  } else if (quickReply) {
    handleQuickReply(senderId, quickReply, messageId);
    return;
  }
  if (messageText) {
    //send message to dialogflow
    console.log("MENSAJE DEL USUARIO: ", messageText);
    await sendToDialogFlow(senderId, messageText);
  //} else if (messageAttachments) {
    //handleMessageAttachments(messageAttachments, senderId);
  //}
}
}


function handleMessageAttachments(messageAttachments, senderId) {
  //for now just reply
  sendTextMessage(senderId, "Archivo adjunto recibido... gracias! .");
}

async function setSessionAndUser(senderId) {
  try {
    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, uuid.v1());
    }
  } catch (error) {
    throw error;
  }
}

async function handleQuickReply(senderId, quickReply, messageId) {
  let quickReplyPayload = quickReply.payload;
  
  console.log(
    "Quick reply for message %s with payload %s",
    messageId,
    quickReplyPayload
  );
  this.elements = a;
  // send payload to api.ai
  sendToDialogFlow(senderId, quickReplyPayload);
}

async function handleDialogFlowAction(
  sender,
  action,
  messages,
  contexts,
  parameters
) {
  switch (action) {
    default:
      //unhandled action, just send back the text
      handleMessages(messages, sender);
  }
}

async function handleMessage(message, sender) {
  switch (message.message) {
    case "text": // text
      for (const text of message.text.text) {
        if (text !== "") {
          await sendTextMessage(sender, text);
        }
      }
      break;
    case "quickReplies": // quick replies
      let replies = [];
      message.quickReplies.quickReplies.forEach((text) => {
        let reply = {
          content_type: "text",
          title: text,
          payload: text,
        };
        replies.push(reply);
      });
      await sendQuickReply(sender, message.quickReplies.title, replies);
      break;
      
    case "image": // image
      await sendImageMessage(sender, message.image.imageUri);
      break;
    case "payload":
      let desestructPayload = structProtoToJson(message.payload);
      var messageData = {
        recipient: {
          id: sender,
        },
        message: desestructPayload.facebook,
      };
      await callSendAPI(messageData);
      break;
    default:
      break;
  }
}

async function handleCardMessages(messages, sender) {
  let elements = [];
  for (let m = 0; m < messages.length; m++) {
    let message = messages[m];
    let buttons = [];
    for (let b = 0; b < message.card.buttons.length; b++) {
      let isLink = message.card.buttons[b].postback.substring(0, 4) === "http";
      let button;
      if (isLink) {
        button = {
          type: "web_url",
          title: message.card.buttons[b].text,
          url: message.card.buttons[b].postback,
        };
      } else {
        button = {
          type: "postback",
          title: message.card.buttons[b].text,
          payload:
            message.card.buttons[b].postback === ""
              ? message.card.buttons[b].text
              : message.card.buttons[b].postback,
        };
      }
      buttons.push(button);
    }

    let element = {
      title: message.card.title,
      image_url: message.card.imageUri,
      subtitle: message.card.subtitle,
      buttons,
    };
    elements.push(element);
  }
  await sendGenericMessage(sender, elements);
}

async function handleMessages(messages, sender) {
  try {
    let i = 0;
    let cards = [];
    while (i < messages.length) {
      switch (messages[i].message) {

        case "card":
          for (let j = i; j < messages.length; j++) {
            if (messages[j].message === "card") {
              cards.push(messages[j]);
              i += 1;
            } else j = 9999;
          }
          await handleCardMessages(cards, sender);
          cards = [];
          break;

        case "text":
          await handleMessage(messages[i], sender);
          break;
        case "image":
          await handleMessage(messages[i], sender);
          break;
        case "quickReplies":
          await handleMessage(messages[i], sender);
          break;
        case "payload":
          await handleMessage(messages[i], sender);
          break;
        default:
          break;
      }
      i += 1;
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendToDialogFlow(senderId, messageText) {
  sendTypingOn(senderId);
  try {
    let result;
    setSessionAndUser(senderId);
    let session = sessionIds.get(senderId);
    result = await dialogflow.sendToDialogFlow(
      messageText,
      session,
      "FACEBOOK"
    );
    handleDialogFlowResponse(senderId, result);
  } catch (error) {
    console.log("salio mal en sendToDialogflow...", error);
  }
}

function handleDialogFlowResponse(sender, response) {
  let responseText = response.fulfillmentMessages.fulfillmentText;
  let messages = response.fulfillmentMessages;
  let action = response.action;
  let contexts = response.outputContexts;
  let parameters = response.parameters;

  sendTypingOff(sender);

  if (isDefined(action)) {
    handleDialogFlowAction(sender, action, messages, contexts, parameters);
  } else if (isDefined(messages)) {
    handleMessages(messages, sender);
  } else if (responseText == "" && !isDefined(action)) {
    //dialogflow could not evaluate input.
    sendTextMessage(sender, "No entiendo lo que trataste de decir ...");
  } else if (isDefined(responseText)) {
    sendTextMessage(sender, responseText);
  }
}
async function getUserData(senderId) {
  console.log("consiguiendo datos del usuario...");
  let access_token = config.FB_PAGE_TOKEN;
  try {
    let userData = await axios.get(
      "https://graph.facebook.com/v6.0/" + senderId,
      {
        params: {
          access_token,
        },
      }
    );
    return userData.data;
  } catch (err) {
    console.log("algo salio mal en axios getUserData: ", err);
    return {
      first_name: "",
      last_name: "",
      profile_pic: "",
    };
  }
}

async function sendTextMessage(recipientId, text) {
  if (text.includes("{first_name}") || text.includes("{last_name}")) {
    let userData = await getUserData(recipientId);
    text = text
      .replace("{first_name}", userData.first_name)
      .replace("{last_name}", userData.last_name);
  }
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: text,
    },
  };
  await callSendAPI(messageData);
}

async function sendImageMessage(recipientId, imageUrl) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl,
        },
      },
    },
  };
  await callSendAPI(messageData);
}

async function sendButtonMessage(recipientId, text, buttons) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: text,
          buttons: buttons,
        },
      },
    },
  };
  await callSendAPI(messageData);
}

async function sendGenericMessage(recipientId, elements) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements,
        },
      },
    },
  };

  await callSendAPI(messageData);
}

async function sendQuickReply(recipientId, text, replies, metadata) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: text,
      metadata: isDefined(metadata) ? metadata : "",
      quick_replies: replies,
    },
  };

  await callSendAPI(messageData);
}

function sendTypingOn(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: "typing_on",
  };

  callSendAPI(messageData);
}

function sendTypingOff(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: "typing_off",
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: "https://graph.facebook.com/v6.0/me/messages",
        qs: {
          access_token: config.FB_PAGE_TOKEN,
        },
        method: "POST",
        json: messageData,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;

          if (messageId) {
            console.log(
              "Successfully sent message with id %s to recipient %s",
              messageId,
              recipientId
            );
          } else {
            console.log(
              "Successfully called Send API for recipient %s",
              recipientId
            );
          }
          resolve();
        } else {
          reject();
          console.error(
            "Failed calling Send API",
            response.statusCode,
            response.statusMessage,
            body.error
          );
        }
      }
    );
  });
}

async function receivedPostback(event) {
  var senderId = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  var payload = event.postback.payload;
  switch (payload) {
    default:
      //unindentified payload
      sendToDialogFlow(senderId, payload);
      break;
  }

  console.log(
    "Received postback for user %d and page %d with payload '%s' " + "at %d",
    senderId,
    recipientID,
    payload,
    timeOfPostback
  );
}

function isDefined(obj) {
  if (typeof obj == "undefined") {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj != null;
}
*/