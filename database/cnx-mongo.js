const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
let client;

async function conectarMongo() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Conectado exitosamente a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    throw error;
  }
}

function getClient() {
  return client;
}

module.exports = { conectarMongo, getClient };
