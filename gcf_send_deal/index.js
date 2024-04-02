require('dotenv').config();
const {Firestore} = require('@google-cloud/firestore');
const sgMail = require('@sendgrid/mail');

/**
 * Background Function triggered by a new Firestore document.
 * 
 * @param {!Object} event The cf event. (This case: the actual firestore document.)
 * @param {!Object} context cf event metadata.
 */


exports.sendDeal = (event, context) => {
    const dealLocations = [];

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // Console log to make sure we have the headline
    console.log("Headline: ");
    console.log(`${event.value.fields.headline.stringValue}`);

    // Get all locations as strings
    console.log("All locations in document: ");
    event.value.fields.location.arrayValue.values.forEach( (loc) => {
        console.log(loc.stringValue);
        dealLocations.push(loc.stringValue);
    });
    //Console log deals, array in database
    console.log(`Location array: ${dealLocations}`);

    // Connect to database
    const db = new Firestore({
        projectId: "sp24-41200-fbaro-traveldeals"
    });

    // "Subcribers" collection reference.Query the "subscribers" collection
    const subsRef = db.collection('subscribers');
    const queryRef = subsRef.where('watch_region', 'array-contains-any', dealLocations);

    // Loop and get data
    queryRef.get().then( (querySnapshot) => {
        // Loop through documents in snapshot (always comes back as array)
        querySnapshot.forEach( (doc) => {
            console.log(doc.data().email_address);
            //msg
            const msg = {
                to: doc.data().email_address,
                from: process.env.SENDGRID_SENDER,
                subject: `(FELIPE) ${event.value.fields.headline.stringValue}`,
                text: "HERE ARE SOME GREAT DEALS!",
                html: "HERE ARE SOME GREAT DEALS!"
            };
            // Send msg
            sgMail
            .send(msg)
            .then( () => {
                console.log('Email sent.');
            }, error => {
                console.error(error);
            });
        } );
    });

}