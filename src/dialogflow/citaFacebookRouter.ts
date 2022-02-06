const Facebook=require('./citaFacebookController.ts');
module.exports = (router) =>{
    
    router.get('/webhook/', Facebook.facebookCitas);
    router.post("/webhook/", Facebook.facebookwebhook);
}