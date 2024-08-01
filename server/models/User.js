const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

const fileAccessSchema = new Schema({
    u_id: {  type: mongoose.Schema.Types.ObjectId,
        required: true },
    files: [{
        file_id: String,
        rights: {
            read: Boolean,
            write: Boolean
        }
    }]
});

const fileSchema = new Schema({
    title: String,
    text: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    uuid : String
});


const userModel = mongoose.model('user', userSchema);
const fileAccessModel = mongoose.model('fileAccess', fileAccessSchema);
const fileModel = mongoose.model('file', fileSchema);
module.exports = { userModel, fileAccessModel,fileModel };