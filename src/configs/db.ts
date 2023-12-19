import mongoose from "mongoose";

const connnectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URI!); 
        console.log("🍀 MongoDb connected..!!!")
    }
    catch(err){
        console.log(err);
    }
}

export {
    connnectDB,
}