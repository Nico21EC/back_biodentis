const Facebook=require('./citaFacebookController.js');
module.exports = (router) =>{
    router.get('/webhookget/', Facebook.facebookCitas);
    router.post("/webhookPost/", Facebook.facebookwebhook);
}