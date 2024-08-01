const userModel = require('../models/User');
const { userModel: User } = require('../models/User'); 
const { fileAccessModel: FileAccess } = require('../models/User'); 
const { fileModel: file } = require('../models/User'); 
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const test = (req, res) => {
    res.json('Hello World')
}
const registerUser = async (req, res) => {
    try{
        var { name, email, password } = req.body;
        // check if name was entered
        if(!name){
            return res.json({err: 'Name is required'})
        }
        if( !password || password.length < 8){
            return res.json({err: 'Password is required and must be at least 8 characters'})
        }
        var exist = await User.findOne({email});
        if(exist){
            return res.json({err: 'Email already exists'})
        
        }
        var hashedPassword = await hashPassword(password);
        var user = await User.create({name, email, 
            password : hashedPassword});
        console.log(name, email, hashedPassword) 
        return res.json({msg: 'User created successfully', user})
    }
    catch(err){
        console.log(err)
    }
 }
 const loginUser = async (req, res) => {
    try{
        var { email, password } = req.body;
        var user = await User.findOne({email});
        if(!user){
            return res.json({err: 'Invalid email address'})
        }
        var match = await comparePassword(password, user.password);
        if(!match){
            return res.json({err: 'Invalid password'})
        }
        else{
            jwt.sign({email : user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, 
            (err, token) => {
                if(err) throw err;
                res.cookie('token', token, { httpOnly: true });  // Set the cookie
                res.json({user,token});  // Send a JSON response
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({err: 'Server error'});
    }
}
 const getProfile= (req,res)=>{
    var {token} = req.cookies;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET,{}, (err, user) => {
            if(err){
                return res.json({err: 'Invalid token'})
            }
            else{
                res.json(user);
            }
        }
        
    )

 }
    else{
        return res.json({err: 'No token found'})
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({msg: 'Logged out successfully'});
}
const savework = async (req, res) => {
    try{
        console.log('hi')
        console.log(req.body)
        var { title, text, uuidf } = req.body;
        console.log(title, text, uuidf)
        var { token } = req.cookies;
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
                if(err){
                    return res.json({err: 'Invalid token'});
                } 
                var File = await file.create({title, text, user: user.id, uuid: uuidf });
                var access = await FileAccess.findOne({u_id: user.id});
                if(!access){
                    await FileAccess.create({u_id: user.id, files: [{file_id: uuidf, rights: {read: true, write: true}}]});
                } else {
                    access.files.push({file_id: uuidf, rights: {read: true, write: true}});
                    await access.save();
                }
                return res.json({msg: 'File saved successfully', File});
            });
        } else {
            return res.json({err: 'No token found'});
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({err: 'Server error'});
    }
}
const getFiles = async (req, res) => {
    try {
        var { token } = req.cookies;

        if (token) {
            var user = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                    if (err) {
                        reject('Invalid token');
                    }
                    resolve(user);
                });
            });
            console.log(user.id);
            var access = await FileAccess.findOne({ u_id: user.id });
            if (!access) {
                return res.json({ err: 'No files found' });
            }

            var files = await file.find({ uuid: { $in: access.files.map(file => file.file_id) } });

            return res.json(files);
        } else {
            return res.json({ err: 'No token found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Server error' });
    }
};

const getFilesbyid = async (req, res) => {
    try{
        var { token } = req.cookies;
        console.log(req.body)
        var { id } = req.params;
        console.log('getFilesbyid called with id:', id);
        if(token){
            var user = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                    if (err) {
                        reject('Invalid token');
                    }
                    resolve(user);
                });
            });
            var access = await FileAccess.findOne({ u_id: user.id });
            console.log(user.id);
            if (!access) {
                return res.json({ err: 'No files found' });
            }
            var fileFromDb = await file.findOne({uuid: id}); // Renamed variable here
            console.log(fileFromDb)
            if(!fileFromDb){
                console.log('File not found')
                return res.json({err: 'File not found'});
            }
            if(!access.files.find(f => f.file_id === id)){
                return res.json({err: 'You do not have access to this file'});
            }
            return res.json(fileFromDb); // Use the renamed variable here
        } else {
            return res.json({err: 'No token found'});
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({err: 'Server error'});
    }
}
const saveworkid = async (req, res) => {
    try{
        var {title, text, id } = req.body;
        console.log(title, text, id);
        var { token } = req.cookies;
        if(token){
            var user = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                    if (err) {
                        reject('Invalid token');
                    }
                    resolve(user);
                });
            });
            var access = await FileAccess.findOne({u_id: user.id});
            console.log(access);
            if(!access){
                return res.json({err: 'No files found'});
            }
            var fileFromDb = await file.findOne({uuid: id});
            console.log(fileFromDb);
            if(!fileFromDb){
                return res.json({err: 'File not found'});
            }
            if(!access.files.find(f => f.file_id === id)){
                return res.json({err: 'You do not have access to this file'});
            }

            fileFromDb.title = title;
            fileFromDb.text = text;
            console.log(fileFromDb);
            await fileFromDb.save();
            return res.json({msg: 'File saved successfully', file: fileFromDb});
        } else {
            return res.json({err: 'No token found'});
        }
    } catch(err) {
        res.status(500).json({err: 'Server error'});
    }
}
const sharefile = async (req,res)=>{
    try{
        var {emails, id} = req.body;
        var {token} = req.cookies;
        console.log(emails, id);
        if(token){
            console.log("inside token");
            var user = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                    if(err){
                        reject('Invalid token');
                    }
                    resolve(user);
                });
            }).catch(err => { 
                console.error(err);
                res.status(401).json({ error: 'Invalid token' });
                return;
            });
            console.log(user);
            var access = await FileAccess.findOne({u_id: user.id});
            console.log(access);
            if(!access){
                return res.json({err: 'No files found'});
            }
            // var fileFromDb = await file.findOne({uuid: id});
            // if(!fileFromDb){
            //     return res.json({err: 'File not found'});
            // }
            if(!access.files.find(f => f.file_id === id)){
                return res.json({err: 'You do not have access to this file'});
            }   
            // now i need to check if what access do the user who sent the request have on the file
            // in the access find the file which have id same as the id of the file which is to be shared
            // then check if the user have write access
            // if yes then only share the file
            // if only read access then only read access can be passed
            // if no access then return error
            var fileAccess = access.files.find(f => f.file_id === id);
            console.log(fileAccess);
            if(!fileAccess.rights.read){
                return res.json({err: 'You do not have access to this file'});
            }
            console.log("outside write access1");
            console.log(fileAccess.rights.write);
            var hi = fileAccess.rights.write;
                // var fileAccess = await FileAccess.findOne({u_id: user.id});
                // if(!fileAccess){
                //     return res.json({err: 'No files found'});
                // }
                for(var i = 0; i < emails.length; i++){
                    var email = emails[i];
                    if(hi){
                        if(email.write==true) email.read=true;
                    }
                    else{
                        email.write = false;
                    }
                    var userToShare = await User.findOne({email: email.email});
                    if(!userToShare){
                        continue;
                    }
                    var accessToShare = await FileAccess.findOne({u_id: userToShare.id});
                    console.log("i am here");
                    if(!accessToShare){
                        console.log('inside accessToShare');
                        await FileAccess.create({u_id: userToShare.id, files: [{file_id: id, rights: {read: email.read, write: email.write}}]});
                    } else {
                        if(!accessToShare.files.find(f => f.file_id === id)){
                            accessToShare.files.push({file_id: id, rights: {read: email.read, write: email.write}});
                            await accessToShare.save();
                        }
                        else{
                            var fileAccessToShare = accessToShare.files.find(f => f.file_id === id);
                            if(email.write==false){
                            fileAccessToShare.rights.read = email.read;
                            fileAccessToShare.rights.write = email.write;}
                            else{
                                fileAccessToShare.rights.read = true;
                                fileAccessToShare.rights.write = true;
                            }
                            await accessToShare.save();
                        }
                    }
                }
                console.log("wow");
                return res.json({msg: 'File shared successfully'});
            

            


        }
    }
    catch(err){
        console.log(err)
    }
}

const deletefile = async (req,res)=>{
    try{
        var id = req.params.id;
        console.log(id);
        var {token} = req.cookies;
        if(token){
            var user = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                    if(err){
                        reject('Invalid token');
                    }
                    resolve(user);
                });
            }).catch(err => { 
                console.error(err);
                res.status(401).json({ error: 'Invalid token' });
                return;
            });
            var access = await FileAccess.findOne({u_id: user.id});
            if(!access){
                return res.json({err: 'No files found'});
            }
            console.log(id);
            var fileFromDb = await file.findOne({uuid: id});
            console.log(fileFromDb);
            if(!fileFromDb){
                return res.json({err: 'File not found'});
            }
            if(fileFromDb.user != user.id){
                return res.json({err: 'You are not allowed to delete this file'});
            }

            if(!access.files.find(f => f.file_id === id)){
                return res.json({err: 'You do not have access to this file'});
            }
            await file.deleteOne({uuid: id});
            access.files = access.files.filter(f => f.file_id !== id);
            await access.save();
            return res.json({msg: 'File deleted successfully'});
        }
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logout,
    savework,
    getFiles,
    getFilesbyid,
    saveworkid,
    sharefile,
    deletefile
}