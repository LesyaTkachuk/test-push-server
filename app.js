const express=require('express');
const cors=require('cors');
const subscriptionHandler=require('./pushHandler');
const bodyParser=require('body-parser')

const app=express();
const port =4003;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send('Hello World')
})

app.post('/subscription', subscriptionHandler.handlePushNotificationSubscription);
app.get('/subscription/:id', subscriptionHandler.sendPushNotification)

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})
