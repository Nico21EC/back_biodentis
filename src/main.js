'use strict'
const port = process.env.PORT || 3001;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const uuid = require("uuid");
const axios = require("axios");
const apiai = require("apiai");

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
  res.header('Content-Type','application/json');
  next();

});



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
const { text } = require("body-parser");

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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Content-Type','application/json');
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === config.FB_VERIFY_TOKEN
  ) {
    res.status(200).send(req.query["hub.challenge"]);
    console.log("Validacion exitosa");
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
  language: "es",
  requestSource: "fb"
});

const sessionIds = new Map();

app.listen(port, () => {
  console.log('Escuchando peticiones en el puerto', port);
});

app.post("/messenger/webhook/", function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Content-Type','application/json');
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
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
    //Assume all went well,
    //You must send back a 200, within 20 seconds
  }
});

function receivedMessage(event) {
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

const callSendAPI = async (messageData) => {
  const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;
  await axios.post(url, messageData)
    .then(function (response) {
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
      console.log("HEADERS: ",error.response.headers);
    });
};

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