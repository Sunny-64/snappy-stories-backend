import mongoose, {Schema} from 'mongoose'; 

const otpSchema:Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User'
      },
      otp: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
      },
}, {timestamps : true}); 

export default mongoose.model("Otp", otpSchema); 