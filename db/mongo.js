const mongoose = require('mongoose');

const ClientOptions = {
    dbName: 'Cluster0'
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, ClientOptions)
        console.log('Connecté');
    } catch (error) {
        console.log(error);
        throw error;
    }
}