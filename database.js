const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');


const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('airestock');
const userCollection = db.collection('user');
const orderCollection = db.collection('order');

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

async function createUser(email, password, role, address = null) {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);
  
    const user = {
      email: email,
      password: passwordHash,
      token: uuid.v4(),
      role: role,
    };

    if (role === 'owner' && address) {
        user.addressAssociations = [{ address, permanent: true }];
    }
    await userCollection.insertOne(user);
  
    return user;
}

async function associateAddress(email, address, startDate, endDate) {
    const user = await userCollection.findOne({ email: email });
    if (user && user.role === 'renter') {
        await userCollection.updateOne(
            { email: email },
            { $push: { addressAssociations: { address, startDate, endDate } } }
        );
    } else {
        throw new Error('Address association is only allowed for renters.');
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

async function dissociateExpiredAddresses() {
    const today = new Date();
    // Find renters with expired address associations
    const expiredAssociations = await userCollection.find({
        "role": "renter",
        "addressAssociations.endDate": { $lte: today }
    }).toArray();

    for (const user of expiredAssociations) {
        // Filter out expired address associations
        const validAssociations = user.addressAssociations.filter(association => 
            !association.endDate || association.endDate > today
        );

        // Update the user document to only include valid (non-expired) associations
        await userCollection.updateOne(
            { _id: user._id },
            { $set: { addressAssociations: validAssociations } }
        );
    }
}

async function canPlaceOrder(userId, address) {
    const user = await userCollection.findOne({ _id: userId, "role": "renter" });

    if (!user) return false; // User not found or not a renter

    // Check if there's an association with the address, assuming dissociateExpiredAddresses handles expiration
    return user.addressAssociations.some(association => association.address === address);
}


async function isOwnerOfAddress(userId, address) {
    const user = await userCollection.findOne({ _id: userId, "role": "owner" });

    if (!user) return false; // User not found or not an owner

    return user.addressAssociations.some(association => 
        association.address === address && association.permanent === true
    );
}


module.exports = {
    getUser,
    getUserByToken,
    createUser,
    associateAddress,
    dissociateAddress,
    addOrder,
    getOrdersByAddress,
    dissociateExpiredAddresses,
    canPlaceOrder,
    isOwnerOfAddress,
  };