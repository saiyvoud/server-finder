import mongoose from 'mongoose';

const bankSchema = mongoose.Schema({
    bankName: {
        type: String,
        required: true, 
        maxlength: 50,
    },
    accountId: {
        type: String,
        required: true, 
        maxlength: 20,
        unique: 1
    },
    accountName: {
        type: String,
        required: true, 
        maxlength: 50,
    }
})

const bankModel = mongoose.model('BankAccount', bankSchema);

export default bankModel;