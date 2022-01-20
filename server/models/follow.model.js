import mongoose from 'mongoose';

const followSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User', 
        required: true
    },
    shop: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Shop', 
        required: true
    },
}, {timestamps:true})

const FollowModel = mongoose.model('Follow', followSchema)

export default FollowModel