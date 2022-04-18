const mongoose = require('mongoose');
require('./albums-model');
require('./users-model')

mongoose.connect(process.env.DB_URL + "/" + process.env.DB_NAME);

mongoose.connection.on('connected', () => {
    console.log(process.env.MONGOOSE_CONNECTED_MSG, process.env.DB_NAME);
});

mongoose.connection.on('disconnected', () => {
    console.log(process.env.MONGOOSE_DISCONNECTED_MSG);
});

mongoose.connection.on('error', (err) => {
    console.log(process.env.MONGOOSE_ERROR_MSG, err);
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});

process.on("SIGUSR2", () => {
    mongoose.connection.close(() => {
        console.log(process.env.SIGUSR2_MESSAGE);
        process.exit(process.pid, "SIGUSR2");
    })
});
