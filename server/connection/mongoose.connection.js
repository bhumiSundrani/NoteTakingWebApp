const mongoose = require('mongoose')

const createMongoDbConnection = async (uri) => {
    return await mongoose.connect(uri)
}

module.exports = createMongoDbConnection