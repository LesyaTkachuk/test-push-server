
// in real-world example subscription should be stored in database
// object to store subscriptions without database
const subscriptions={};
const crypto=require('crypto');
const webpush=require('web-push');

// Vapid keys should coincide with applied on frontend side
const vapidKeys={
    subject: "mailto:lesyalesya9876@gmail.com",
    publicKey: 'BHH3K6kSaUJJ9aJxm32xhEK908ICycGJkNMNcJ_w1c33eX-7l5UN4fPE7w9At5r_XX_kp-294ISDJ3j8A0SxosU',
    privateKey:'UVBPT5RDW8gsh5YoMpAlV0OeztfhWaHx9xEkE0YMAhA',
};

// add vapid keys options to web-push
webpush.setVapidDetails('mailto:lesyalesya9876@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

const createHash=(input)=>{
    const md5=crypto.createHash('md5');
    md5.update((Buffer.from(input)));
    return md5.digest("hex");
}

function handlePushNotificationSubscription(req,res){
 const sunscriptionRequest=req.body.subscription;

 // to create unique subscription id
 const subscriptionId=createHash(JSON.stringify(sunscriptionRequest));
 // to store user's subscription details by id
 subscriptions[subscriptionId]=sunscriptionRequest;

 res.status(201).json({id: subscriptionId});
}

function sendPushNotification(req,res){
    const subscriptionId=req.params.id;
    // find subscription by id from the list
    const pushSubsription=subscriptions[subscriptionId];

    const options={
        TTL:60,
        vapidDetails: vapidKeys
    }

    // send push notification with the help of web-push package
    // first argument is user's subscription (it's object with endpoint and keys properties), the second push notification details, the third - web-push options
    webpush.sendNotification(pushSubsription, JSON.stringify({
        title: "New message from remote server",
        text: "HEY! Take a look at this message. It's finally on your device :)",
        tag: 'new message',
        icon: './river.jpg',
        image: 'https://media.istockphoto.com/id/1158030404/de/foto/zwei-hunde-und-eine-lustige-katze.jpg?s=612x612&w=0&k=20&c=oEjAvtqZPIlnL3wsxolrGl8q_OLR6RttUE8ecrYsSJM=',
    }), options).catch(err=>console.log("Error when pushing", err));

    res.status(202).json({pushStatus: 'Sent from remote server'})
}

module.exports={handlePushNotificationSubscription,sendPushNotification}
