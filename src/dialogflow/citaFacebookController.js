const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const axios = require("axios");
const apiai = require("apiai");
const request = require("request");
const { structProtoToJson } = require("../dialogflow/structFunctions.js");
const dialogflow = require("../dialogflow/dialogflow.js");
const config = require("../config/config.js")

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


exports.facebookValidacion = (req, res) => {
  console.log(req);
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === config.FB_VERIFY_TOKEN
  ) {
    console.log("FACEBOOK VER:", res);
    res.status(200).send(req.query["hub.challenge"]);
    console.log("Validacion exitosa");
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
}
//.................................

exports.postFacebook = (req, res) => {
  var data = req.body;
  //console.log("POST DATA OBJECT: page",req.body);
  if (data.object == "page") {
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      pageEntry.messaging.forEach(function (messagingEvent) {
        console.log("PAGE ENTRY MESSAGING:", messagingEvent.message)
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
  }
}
//######################################
async function receivedMessage(event) {
  console.log("EVENTTTTTT", event)
  var senderId = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", senderId, recipientID, timeOfMessage);

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

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
    console.log("MENSAJE DEL USUARIO: ", messageText);
    await sendToDialogFlow(senderId, messageText);
  };

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
    console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
    this.elements = a;
    sendToDialogFlow(senderId, quickReplyPayload);
  }

  async function handleDialogFlowAction(sender, action, messages, contexts, parameters) {
    switch (action) {
      default:
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
            //await handleCardMessages(cards, sender);
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
    }
  }

  function sendTypingOn(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    callSendAPI(messageData);
  };

  function callSendAPI(messageData) {
    console.log("call send API", messageData);
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
          if (!error && response.statusCode == 200)
           {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            if (messageId) {
              console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
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
        sendToDialogFlow(senderId, payload);
        break;
    }
    console.log("Received postback for user %d and page %d with payload '%s' " + "at %d", senderId, recipientID, payload, timeOfPostback);
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


  function handleApiAiResponse(sender, response) {
    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;
    sendTypingOff(sender);
    if (responseText == "" && !isDefined(action)) {
      //api ai could not evaluate input.
      console.log("Unknown query" + response.result.resolvedQuery);
      sendTextMessage(
        sender,
        "I’m not sure what you want. Can you be more specific?"
      );
    } else if (isDefined(action)) {
      handleApiAiAction(sender, action, responseText, contexts, parameters);
    } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
      try {
        console.log("Response as formatted message" + responseData.facebook);
        sendTextMessage(sender, responseData.facebook);
      } catch (err) {
        sendTextMessage(sender, err.message);
      }
    } else if (isDefined(responseText)) {
      sendTextMessage(sender, responseText);
    }
  };


  function sendTypingOff(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId,
      },
      sender_action: "typing_off",
    };
    callSendAPI(messageData);
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
  }
}
