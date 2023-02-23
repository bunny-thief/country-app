const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

require('dotenv').config()
const connection_string = process.env.CONNECTION_STRING
const database = process.env.DB
const collection = process.env.COLLECTION
const PORT = process.env.PORT || 5000

MongoClient.connect(connection_string, { useUnifiedTopology: true })
    .then(client => {
        const db = client.db(database)
        const countries = db.collection(collection)
        console.log(`Connected to database`)
    })

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
