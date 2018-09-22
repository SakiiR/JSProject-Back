import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenSchema = new Schema({
	value: {
		type: String,
		required: true
	}
});

export default mongoose.model('Token', tokenSchema);
