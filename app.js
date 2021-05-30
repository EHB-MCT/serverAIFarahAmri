"use strict";

//SERVER SET-UP
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const path = require('path');

//MONGO DB SETUP
let db;
const {
    MongoClient,
    ObjectID
} = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.lxqft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const databaseName = "data";
let collection;


//MIDDLEWARE
app.use(cors());
app.use(express.json({
    limit: '200mb'
}));
app.use(express.urlencoded({
    limit: '200mb',
    extended: true
}));


app.get('/data', function (req, res) {
    //console.log(collection);
    const {
        query
    } = req;
    collection.find(query).limit(10000).toArray(function (err, result) {
        if (err) {
            return res.send(err);
        }
        res.json(result);
    });
});


//APP USE
app.use(express.static(path.join(__dirname, 'front')));
//app.use('/api', apiRouter);


//MONGO DB CONNECTION
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    client.connect(err => {
        if (err) {
            throw err;
        }
        collection = client.db("data").collection("villoData");
        console.log("connected");
    });
});

// function request() {
//     axios.get(url)
//         .then(response => {
//             let apiResult = response.data;
//             console.log(apiResult);
//             collection = db.collection("villoData");
//             collection.insertMany(apiResult)
//                 .then(result => {
//                     console.log(result);
//                 })
//                 .catch(error => console.error(error));
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }


//immediately invoked function expression + needed to do an upgrade to heroku hobby plan
// (function wake() {
//     let handler;
//     try {
//       handler = setInterval(() => {
//         request();
//       }, interval);
//     } catch(err) {
//         console.error(err);
//         clearInterval(handler);
//         return setTimeout(() => wake(), 10000);
//     }  
// })();