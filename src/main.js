'use strict'
const port = process.env.PORT || 3001;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const uuid = require("uuid");
const axios = require("axios");
const apiai = require("apiai");
const request = require("request");

const mongooseMain = require('mongoose');

//Import Config file
const config = require("./config/config.js")

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

/*
const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
  language: "es",
  requestSource: "fb"
});

const sessionIds = new Map();*/

app.listen(port, () => {
  console.log('Escuchando peticiones en el puerto', port);
});

app.post("/messenger/webhook/", function (req, res) {
  var data = req.body;
  console.log("post data object: page",req.body);
  if (data.object == "page") {
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      console.log("page entry:", pageEntry.id);
      console.log("page entry:", pageEntry.time);
      pageEntry.messaging.forEach(function (messagingEvent) {
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
});

function receivedMessage(event) {
  console.log("EVENTTTTTT", event)
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid);
  }

  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  if (messageText) {
    sendToApiAi(senderID, messageText);
  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderID);
  }
};

function sendToApiAi(sender, text) {
  sendTypingOn(sender);
  let apiaiRequest = apiAiService.textRequest(text, {
    sessionId: sessionIds.get(sender)
  });
  apiaiRequest.on("response", response => {
    if (isDefined(response.result)) {
      handleApiAiResponse(sender, response);
    } else {
      console.log("NO ENVIAAAAA")
    }
  });
  apiaiRequest.on("error", error => console.error(error));
  apiaiRequest.end();
};

const sendTypingOn = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };
  callSendAPI(messageData);
};

/*
const callSendAPI = async (messageData) => {
  const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;

  console.log(
    "MENSAJEEEE",messageData
  )
  await axios.post(url, messageData)
    .then(function (response) {
     console.log(response.data)
      if (response.status == 200) {
        var recipientId = response.data.recipient_id;
        var messageId = response.data.message_id;
        console.log(messageId)
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
      }else{
        console.log("error!!!")
      }
    })
    .catch(function (error) {
      console.log("HEADERS: ",error);
    });
};
*/

function callSendAPI(messageData) {
  /**
   *const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;

  console.log(
    "MENSAJEEEE",messageData
  )
  await axios.post(url, messageData)
    .then(function (response) {
   

    const config_axios = {
        method: 'post',
        url: "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN,
        headers: {'Authorization': `Basic `+ config.GOOGLE_PRIVATE_KEY}
    }
    let res = axios(config_axios, messageData)*/
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
        header: { 'Access-Control-Allow-Headers': 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method' },
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

const isDefined = (obj) => {
  if (typeof obj == "undefined") {
    return false;
  }
  if (!obj) {
    return false;
  }
  return obj != null;
};

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

const sendTypingOff = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };
  callSendAPI(messageData);
};

const sendTextMessage = async (recipientId, text) => {
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

function handleApiAiAction(sender, action, responseText, contexts, parameters) {
  switch (action) {
    case "send-text":
      var responseText = "This is example of Text message."
      sendTextMessage(sender, responseText);
      break;
    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }
};