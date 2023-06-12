const express=require("express")
const userRouter=express.Router()
const {Usermodel}=require("../model/user.model")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const [auth, blacklistToken, isTokenBlacklisted, validateCityName]=require("../middleware/auth.middleware")
const rateLimit = require('express-rate-limit');
  
userRouter.post("/register",async(req,res)=>{
    const {name,email,password,city}=req.body
    try {
        bcrypt.hash(password, 5,async(err, hash)=>{
            if(err){
                res.status(500).send("something went wrong")
            }
            if(hash){
                const user=new Usermodel({name,email,password:hash,city})
                await user.save()
                res.status(200).send({"msg":"Registration has been done!"})
            } 
        });
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
    
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await Usermodel.findOne({email})
       if(user){
        bcrypt.compare(password, user.password,async(err, result)=> {
            if(result){
                res.status(200).send({"msg":"login successfull","token":jwt.sign({"userID":user._id},"masai")})
            }else{
                res.status(400).send({"msg":"Wrong credentials"})
            }
          
        });
        //console.log(user)
       }
        } catch (error) {
            res.status(400).send({"msg":error.message})
        }
})

userRouter.post('/logout', (req, res) => {
    const token=req.headers.authorization
    blacklistToken(token);
    res.status(200).send('Logged out successfully');
  });
  

  const Ratelimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 1,
  });

 

module.exports={userRouter}