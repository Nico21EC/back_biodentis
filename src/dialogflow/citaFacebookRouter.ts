const Facebook=require('./citaFacebookController.js');
module.exports = (router) =>{
    //router.get('/messenger/webhook', Facebook.facebookValidacion);
    router.post('/messenger/webhook', Facebook.postFacebook);
}