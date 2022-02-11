const Facebook=require('./citaFacebookController.js');
module.exports = (router) =>{
    router.get('/webhook1/', Facebook.facebookVerification);
    router.post("/webhook2/", Facebook.facebookDialog);
}