const express=require("express")
const weatherRouter=express.Router()
const [auth, blacklistToken, isTokenBlacklisted, validateCityName]=require("../middleware/auth.middleware")
const Redis = require("ioredis");
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const redis = new Redis();

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, 
    max: 1, 
    message: 'Too many requests from this IP, please try again later.',
  });

weatherRouter.get("/:city", validateCityName,auth, limiter, (req, res) => {
  const { city } = req.params;
  const apiKey = "XMZNVXAYAG9W2TC7EQTD8FC2G";
  
  axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`)
    .then(response => {
      const weatherData=response.data
      redis.setex("weatherData", 1800, JSON.stringify(weatherData));
      console.log(response.data);
      res.json(response.data); 
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});






module.exports={weatherRouter}