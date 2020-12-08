const User = require('../models/users');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../configuration');

signToken = user =>{
   return jwt.sign({
        iss:'codework',
        sub: user.id,
        iat: new Date().getTime()
     },JWT_SECRET);
}

module.exports = {
    signUp : async (req,res,next) =>{
        console.log('Usercontroller.signUp() called!');

        const {email ,password} = req.value.body;

        // checl if there is a user with the same name

        const foundUser = await User.findOne({email});
        if(foundUser) {
            return res.status(403).json({erro:'Email is already in use'});
        }

        // create a new user
        const newUser = new User ({
            email,
            password
        });

        await newUser.save();
    //    res.json({user: 'user created'});

         const token = signToken(newUser);
         res.status(200).json({token: token});

    },
    signIn :async (req,res,next) =>{
        
         const token = signToken(req.user);
         res.status(200).json({token: token});
        
      
    },
    secret :async (req,res,next) =>{
        console.log('I manage to get here')
        res.json({secret: 'resource'});
    },
    google: async(req,res,next) =>{
        console.log('login with google successful');
    },
    facebook: async(req,res,next) =>{
        console.log('login with facebook successful');
    },
    register: async(req,res,next) =>{
        console.log('register call');
    }
   

}