
const {validationResult}= require('express-validator');
const {generateSimpleJWT}= require('../Utils/token');
const errorHandler= require('../Utils/errorHandler');
const {hashPassword,verifyHashPassword}=require('../Utils/encrptPassword');
const userModel = require('../Models/userModel');
const {saveImageToPath} = require('../Utils/promisfyCallback');


class userController{

    // create a user 
    createUser = async (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return next(new errorHandler(400, "Input validation failed", err));
        }
        const res1 = await userModel.find({ email: req.body.email });
        if (res1 && res1?.email) {
            return next(new errorHandler(400, "User already exist with this email."));
        }

        // store the hash of password in the database
        req.body.password = await hashPassword(req.body.password);
        const result = await userModel.create(req.body);
        if (!result || !result?._id) {
            return next(new errorHandler(500, "Failed to register account! Please try again later."));
        }
        const jwt= generateSimpleJWT({userId: result._id, email: result.email});
        return res.status(201).json({token: jwt});
    }

    // update the user profile
    updateProfile= async(req,res,next)=>{
        console.log(req.thisuser);
        
        if(!req?.files?.file){
            return next(new errorHandler(400, "File not added in correct header"));
        }
        const uploadId = `${Math.random().toString(36)}${Math.random().toString(36)}`;
        const path = `./Uploads/profiles/${uploadId}.jpeg`;
        const file= req.files.file; 

        const res1= await saveImageToPath(path,file);
        if(!res1){
            return next(new errorHandler(500, "Internal server error!", res1));
        }
        // update the userProfile Image Info
        const res2= await userModel.findByIdAndUpdate(req.thisuser._id, {profileImage:path});
        if(!res2 || !res2?._id){
            return next(new errorHandler(500, "Failed to update Image at the moment!", res1));
        }
        
        return res.json({msg:"Profile Image update sucessfully"});
    }

    // update the user Info
    updateUserInfo= async(req,res,next)=>{
        // update the userProfile Image Info
        const res2= await userModel.findByIdAndUpdate(req.thisuser._id, req.body);
        if(!res2 || !res2?._id){
            return next(new errorHandler(500, "Failed to update Image at the moment!", res1));
        }
        return res.json({msg:"Profile Image update sucessfully"});
    }

    // get a user with the given id
    decodetoken = async(req, res, next) => {
        const { firstName,lastName, email  } =req.thisuser;
        return res.status(200).json({firstName,lastName, email});
    }

    // User SignIn, return the JWT
    signIn = async (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return next(new errorHandler(400, "Input validation failed!", err));
        }
        const user = await userModel.findOne({ email:req.body.email });
        if (!user || !user?.email) {
            return next(new errorHandler(401, "No user exist with this email address."));
        }
        const isValid = await verifyHashPassword(req.body.password, user.password);
        if (!isValid) {
            return next(new errorHandler(401, "Password does not match! Enter correct password"));
        }
        const jwt= generateSimpleJWT({userId:user._id, email:user.email});
        return res.status(200).json({token: jwt});
    }
}


module.exports = new userController();