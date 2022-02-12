const Facebook=require('./citaFacebookController.js');
module.exports = (router) =>{
    router.get('/webhook/', Facebook.facebookCitas);
    router.post("/webhook/", Facebook.facebookConnection);
}