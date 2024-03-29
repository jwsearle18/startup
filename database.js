const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('airestock');
const userCollection = db.collection('user');
const orderCollection = db.collection('order')

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

function getUser(email) {
    return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = {
      email: email,
      password: passwordHash,
      token: uuid.v4(),
      role: role,
      addressAssociations: address ? [{ address, startDate: new Date(), endDate: null }] : [],
    };
    if (role === 'owner') {
        user.addressAssociations = address ? [address] : [];
    }
    await userCollection.insertOne(user);
  
    return user;
}

async function associateAddress(email, address, startDate, endDate) {
    if (endDate) {
        await userCollection.updateOne(
            { email: email },
            { $push: { addressAssociations: { address, startDate, endDate } } }
        );
    }
}

async function dissociateAddress(email, address) {
    await userCollection.updateOne(
        { email: email },
        { $pull: { addressAssociations: { address } } }
    );
}

async function addOrder(order) {
    await orderCollection.insertOne(order);
}

async function getOrdersByAddress(address) {
    return await orderCollection.find({ address }).toArray();
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    associateAddress,
    dissociateAddress,
    addOrder,
    getOrdersByAddress,
  };