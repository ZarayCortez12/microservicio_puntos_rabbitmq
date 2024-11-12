import mongoose from 'mongoose';

const PuntosSchema = mongoose.Schema({
    id_user:{
        type: String,
        required: true,
        unique: true
    },
    cantidad:{
        type: String,
        required: true
    },
})

export default mongoose.model('Puntos', PuntosSchema);