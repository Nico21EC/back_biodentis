const Facebook=require('./citaFacebookController.js');
module.exports = (router) =>{
    router.get('/webhook/', Facebook.facebookVerification);
    router.post("/webhook/", Facebook.facebookDialog);
}