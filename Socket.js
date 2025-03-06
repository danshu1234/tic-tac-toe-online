import mongoose from "mongoose";

const SocketSchema = mongoose.Schema({
    socketId: {
        type: String,
        required: true,
    }
})

export default mongoose.model('Socket', SocketSchema)