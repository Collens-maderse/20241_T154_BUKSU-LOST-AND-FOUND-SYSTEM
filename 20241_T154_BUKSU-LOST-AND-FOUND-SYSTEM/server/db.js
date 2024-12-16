const mongoose = require ('mongoose');

const connectDB = async () => {
    try {
        const connectDB = await mongoose.connect(
            'mongodb+srv://casiega11:casmersiega123@cluster0.qcpro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
);
            console.log('MongoDB Connected: ${conn, connection.host}');
        } catch (error) {
            console.error(error);
            process.exit(1);
        }        
    }




    module.exports = connectDB;