import mongoose from 'mongoose';

export const connectDB = async () => {

    try {
        await mongoose.connect(process.env.DB_CONNECTIONSTRING);
        console.log('DB connection successfully!!!');
    } catch (error) {
        console.log('Error when connect DB: ', error);
        process.exit(1);
    }
}