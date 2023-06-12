const jwt=require("jsonwebtoken")
const redis = require('redis');
const client = redis.createClient();



const auth=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1]
            if(token){
                const decoded= jwt.verify(token,"masai")
                if(decoded){
                req.body.userID=decoded.userID
                 next()
                }else{
                 res.status(400).send({"msg":"Please login first"})
                }
             }else{
                 res.status(400).send({"msg":"Please login first"})
             }
}

function blacklistToken(token){
    client.set(token, 'blacklisted', 1800, 'EX');
  };


function isTokenBlacklisted(token){
    client.get(token, (err, reply) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  };

  
  const validateCityName = (req, res, next) => {
    const city = req.params.city;
    if (/[^a-zA-Z\s]/.test(city)) {
      return res.status(400).json({ message: 'Invalid city name' });
    }
    next();
  };

module.exports=[auth, blacklistToken, isTokenBlacklisted, validateCityName]