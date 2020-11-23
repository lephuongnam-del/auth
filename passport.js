const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const{JWT_SECRET} = require('./configuration');
const User = require('./models/users');
const LocalStrategy = require ('passport-local').Strategy;


// json web token strategy
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET 
    }, async (payload, done) => {
        try{
            //find the user specified in token
                const user = await User.findById(payload.sub);
            // if user doesn't exist
                if(!user){
                    return done(null,false);
                }
            // otherwise, return the user
                done(null,user);
        } catch(error){
            done(error,false);
        }


    }));


// local strategy
passport.use(new LocalStrategy({usernameField: "email"},
   
    async (email,password,done)=>{
        
        try{
            //find the user given the email
            const user = await User.findOne({email});
             // check email
             if(!user) 
             {
                 return done(null,false)
             }
             
             // check password
             const isMatch = await user.isValidPassword(password);
             if(!isMatch)
             {
                 return done(null,false);
             }
             done(null,user);

        }
        catch(error){
            done(error,false);
        }


    }));