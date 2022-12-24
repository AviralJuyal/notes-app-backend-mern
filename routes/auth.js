const express = require('express');
const User = require('../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const router = express.Router();

//to apply validation while taking the input 
const { body, validationResult } = require('express-validator');

const jwt_token = "avi@messi";


router.post('/createUser',
    [body('name' , 'Name must be 3 characters long').isLength({ min: 3 }),
    body('email' , 'Enter a valid email').isEmail(), 
    body('password' , 'Password must be 5 characters long').isLength({ min: 5 })]
,async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      let user = await User.findOne({ email: req.body.email });
      if(user)
        return res.status(400).json({error : "sorry a user with this email already exists"})

      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        })
        
      const data ={
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data , jwt_token);
      success = true;
      res.json({success , authToken})
    }
    catch (error) {
      console.error(error.message);
      success =false;
      res.status(500).send(success , "some error occured");
    }
})


router.post('/login',
    [body('email' , 'Enter a valid email').isEmail(), 
    body('password' , 'password cannot be empty').exists()]
,async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
      const {email , password} = req.body;
      let user = await User.findOne({email});
      if(!user)
        return res.status(400).json({error : "Please enter correct credentials"});
      
      let pass = await bcrypt.compare(password , user.password);
      if (!pass){
        return res.status(400).json({error : "Please enter correct credentials"});
      }

      const data ={
        user:{
          id: user.id
        }
      }  
      const authToken = jwt.sign(data , jwt_token);
      success = true;
      res.json({success , authToken})
    }
    catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
})


router.post('/getUser',fetchuser,async(req, res) => {
  
    try{
      const userId = req.user.id;
      const user =await User.findById(userId).select("-password");
      res.send(user);
    }
    catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
})


module.exports = router