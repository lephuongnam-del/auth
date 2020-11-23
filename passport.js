const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const{JWT_SECRET} = require('./configuration');
const User = require('./models/users');
const LocalStrategy = require ('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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


    // google
    passport.use(new GoogleStrategy({
        clientID: '718126783534-44g6l7r2srj527dil2e6dduavoiptoq7.apps.googleusercontent.com',
        clientSecret: 'wEr7watpi0Vr3VcTRWsp1Mxq',
        callbackURL: "http://localhost:3000/users/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
           User.findOrCreate({ googleId: profile.id }, function (err, user) {
             return done(err, user);
           });
      }
    ));


    //face
    passport.use(new FacebookStrategy({
        clientID: '722785471672851',
        clientSecret: 'cbb7e9254d145e4abb23f33aa916b18c',
        callbackURL: "http://www.example.com/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ facebookId: profile.id }, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
        });
      }
    ));