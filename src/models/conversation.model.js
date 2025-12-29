import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
    {
        sessionId: { type: String, required: true, unique: true },
        summary: { type: String, default: '' }, // 🔥 NEW
    },
    { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
