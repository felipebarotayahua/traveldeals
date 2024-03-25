// const {Firestore} = require('@google-cloud/firestore');

// // Entry Point
// exports.subscriberToDb = async (message, context) => {
//     const firestore = new Firestore({
//         projectId: "sp24-41200-fbaro-traveldeals"
//     });

//     const incomingMsg = Buffer.from(message.data, 'base64').toString('utf-8');

//     const parsedMsg = JSON.parse(incomingMsg);

//     // Object to be inserted
//     let dataObj = {};
//     dataObj.email_address = parsedMsg.email_address;
//     dataObj.watch_regions = parsedMsg.watch_regions;

//     // Write the object into Firestore
//     let collectionRef = firestore.collection('subscribers');
//     let documentRef = await collectionRef.add(dataObj);
//     console.log(`Subscriber created: ${documentRef.id}`);

// }


const { Firestore } = require('@google-cloud/firestore');

// Entry Point
exports.subscriberToDb = async (message, context) => {
    const firestore = new Firestore({
        projectId: "sp24-41200-fbaro-traveldeals"
    });

    const incomingMsg = Buffer.from(message.data, 'base64').toString('utf-8');

    const parsedMsg = JSON.parse(incomingMsg);

    // Object to be inserted
    let dataObj = {};
    dataObj.email_address = parsedMsg.email_address;
    
    // Check if watch_regions is defined before assigning it
    if (parsedMsg.watch_regions !== undefined) {
        dataObj.watch_regions = parsedMsg.watch_regions;
    }

    // Write the object into Firestore
    let collectionRef = firestore.collection('subscribers');
    let documentRef = await collectionRef.add(dataObj);
    console.log(`Subscriber created: ${documentRef.id}`);
}