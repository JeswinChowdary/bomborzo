require('dotenv').config();

//Imports

/************************************************************************************** */

const express = require('express');
const app = express();
const otpGenerator = require('otp-generator');
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Jeswin:Jeswin2009@cluster0.5nwhj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use(express.json());
app.use('/', express.static('./public'));

//Development Functions
function log(string) {
    console.log(string);
}
//************************************************************************************** */

app.get('/', (req, res) => {
    res.redirect('/home');
})
app.get('/api/generate-random-string', (req, res) => {
    res.send({ randomString: process.env.API_KEY });
});
app.post('/api/store-order-data', async (req, res) => {
    const randomString = req.body.randomString;
    const email = req.body.email;
    const clientNum = req.body.clientNum;
    const duration = req.body.duration;
    const victNum = req.body.victNum;

    if(randomString !== process.env.API_KEY) {
        return res.send({ success: false, errorMessage: 'There was an error. We are extremely sorry for the inconvenience, please try again later...' });
    }

    try {
        await client.connect();

        const collection = await client.db('bomborzo').collection('orders');

        await collection.insertOne({
            email: email,
            victNum: victNum,
            duration: duration,
            clientNum: clientNum
        })
    } finally {
        await res.send({ success: true, errorMessage: null });
    }
})

app.listen(PORT, log(`Server is up on port: ${PORT}`));