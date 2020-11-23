const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//create a schema
const userSchema = new Schema ({
    email:{
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }

});
userSchema.pre('save',async function(next) {
    try{
        const salt= await bcrypt.genSalt(10);
       const passwordHash =await  bcrypt.hash(this.password,salt);
       this.password = passwordHash;
       next();
    }
    catch(error)
    {
        next(error);
    }
})

userSchema.methods.isValidPassword = async function(newpassword){
    try{
        return await bcrypt.compare(newpassword,this.password);
    }catch(error){
        throw new Error(error);
    }
}


// create a model
const User = mongoose.model('user',userSchema);


// export the model
module.exports= User;