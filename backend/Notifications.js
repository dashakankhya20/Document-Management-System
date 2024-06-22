import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  }],
  recipientsGroup: {
    type: String,
    enum: ['Admin', 'Trainee', 'Intern', 'Defense', 'GeoInformatics']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  }]
});

export default mongoose.model('Notifications', notificationSchema);
