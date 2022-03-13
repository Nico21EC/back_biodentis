'use strict'
const port = process.env.PORT || 3001;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const uuid = require("uuid");
const axios = require("axios");
const apiai = require("apiai");
const request = require("request");
const { structProtoToJson } = require("./dialogflow/structFunctions.js");
const dialogflow = require("./dialogflow/dialogflow.js");
const config = require("./config/config.js");
const mongooseMain = require('mongoose');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
var EsquemaCitaFacebookModel = require('./dialogflow/citaFacebookModel.ts');

//mongodb models
const chatBotCita = require("./dialogflow/citaFacebookModel.ts");

//Import Config file

const cors = require('cors');

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Content-Type', 'application/json');
  next();
});

// Messenger API parameters
chatBotCita.find({}, (err, res) => {
  console.log(res);
});

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

mongooseMain.connect(
  "mongodb+srv://nicolOnt:Imsherlock1854*@cluster0.emxpv.mongodb.net/Biodentis?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }, (err, res) => {
    if (err) return console.log("Hubo un error en la base de datos", err);
    console.log("BASE DE DATOS CONECTADA");
  }
);

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const router = express.Router();

app.use(cors());
app.use(express.json());

app.use('/messenger', router);

const loginRoute = require("./routes/login/loginRoute.ts");
const sucuRoute = require('./routes/sucursales/sucursalesRoute.ts');
const citaRoute = require('./routes/cita/citaRoute.ts');
const pacienteRoute = require('./routes/paciente/pacienteRoute.ts');
const diagnosticoRoute = require('./routes/diagnostico/diagnosticoRoute.ts');
const historiaClinicaRoute = require('./routes/historiaClinica/historiaClinicaRoute.ts');
const odontogramaRoute = require('./routes/odontograma/odontogramaRouter.ts');
const piezaRoute = require('./routes/odontograma/piezaRoute.ts');
const recetaRoute = require('./routes/receta/recetaRoute.ts');
const tratamientoRoute = require('./routes/tratamiento/tratamientoRoute.ts');
const reservaRoute = require('./routes/reserva/reservaRoute.ts');
const facebookRoute = require('./dialogflow/citaFacebookRouter.ts');

//const { config } = require("process");

sucuRoute(router);
citaRoute(router);
pacienteRoute(router);
diagnosticoRoute(router);
historiaClinicaRoute(router);
odontogramaRoute(router);
piezaRoute(router)
recetaRoute(router);
tratamientoRoute(router);
reservaRoute(router);
loginRoute(router);
sucuRoute(router);
facebookRoute(router);

app.get("/messenger", (req, res) => {
  return res.send("Chatbot Funcionando 🤖🤖🤖");
});


app.get("/messenger/webhook", function (req, res) {
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
});

app.listen(port, () => {
  console.log('Escuchando peticiones en el puerto', port);
});

var cita_fb = false
app.post("/messenger/webhook/", function (req, res) {
  var data = req.body;

  //console.log("POST DATA OBJECT: page",req.body);
  if (data.object == "page") {
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message.text == "Cita") {
          cita_fb = true
        }else{
          cita_fb = false
        }
        console.log("PAGE ENTRY MESSAGING:", messagingEvent.message)
        if (messagingEvent.postback) {
          console.log("Entrando al if de PAGE ENTRY");

          receivedPostback(messagingEvent);
        } else if (messagingEvent.message) {
          console.log("Entrando al if else de PAGE ENTRY");
          receivedMessage(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
    res.sendStatus(200);
  }
});

async function receivedMessage(event) {

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
    return new Promise(async (resolve, reject) => {
      await request(
        {
          uri: "https://graph.facebook.com/v6.0/me/messages",
          qs: { access_token: config.FB_PAGE_TOKEN, },
          method: "POST",
          json: messageData,
        },
        function (error, response, body) {
          console.log("")
          if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            if (messageId) {
              //Aqui estan los datos messageData
              console.log("call send API aaqui", messageData);
              console.log("mensaje de intent", messageData.message.text);
              if (cita_fb) {
                console.log("Entrando al if de cita")
                var palabra = "Felicidades"
                var index = messageData.message.text.indexOf(palabra)
                if (index >= 0) {
                  console.log("Felicidad detectada", index)
                  console.log(messageData.message.text[1])
                  //sendDataMongo(messageData.message.text[1],)
                } else {
                  console.log("mensaje cualquiera")
                }
              }
              console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
            } else {
              console.log("Successfully called Send API for recipient %s", recipientId);
            }
            resolve();
          } else {
            reject();
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
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
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text
      }
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


  function sendDataMongo(nombre, apellido, fecha, hora) {
    const citaFacebook = new EsquemaCitaFacebookModel();
    citaFacebook.nombre = nombre;
    citaFacebook.apellido = apellido;
    citaFacebook.fecha = fecha;
    citaFacebook.hora = hora;

    citaFacebook.save().then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(400).json({ message: 'Error al enviar cita Facebook' });
      }
    })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }

};