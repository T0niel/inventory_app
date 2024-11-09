const HttpError = require('../errors/httpError');

module.exports = function(req, res, next){
    const {password} = req.body;
    if(password === process.env.ADMIN_PASSWORD){
        next();
    }else{
        throw new HttpError('Unautherized', 403);
    }
}