const { MongoClient, ObjectId } = require('mongodb');
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



async function associateAddress(userId, address, startDate, endDate) {
    const objectId = new ObjectId(userId);

    // Verify the user is a renter
    const renter = await userCollection.findOne({ _id: objectId, role: 'renter' });
    if (!renter) {
        throw new Error('Address association is only allowed for renters.');
    }

    // Check if an owner has registered the address
    const ownerExists = await userCollection.findOne({
        role: 'owner',
        'addressAssociations.address': address,
        'addressAssociations.permanent': true,
    });
    if (!ownerExists) {
        throw new Error('No owner is registered with the given address.');
    }

    // Proceed with address association
    await userCollection.updateOne(
        { _id: objectId },
        { $push: { addressAssociations: { address, startDate: new Date(startDate), endDate: new Date(endDate) } } }
    );
}


async function dissociateAddress(_id, address) {
    await userCollection.updateOne(
        { _id: user._id },
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