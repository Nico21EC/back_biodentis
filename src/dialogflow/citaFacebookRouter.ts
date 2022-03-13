const Facebook=require('./citaFacebookController.js');

module.exports = (router) =>{
    router.get('/citasFacebook', Facebook.citasFacebook);
    //router.post('/messenger/webhook', Facebook.postFacebook);
}