const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

require('dotenv').config()
let db
const connection_string = process.env.CONNECTION_STRING
const database = process.env.DB
const collection = process.env.COLLECTION
const PORT = process.env.PORT || 5000

MongoClient.connect(connection_string, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(database)
        console.log(`Connected to database`)
    })

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/countries', async (req, res) => {
    const countryObjects = await db.collection(collection).find().toArray()
    res.json(countryObjects)
})

app.get('/api/countries/:country', (async (req, res) => {
    const country = await db.collection(collection).findOne({ country: req.params.country })
    res.json(country)
}))

app.get('/api/countries/capital/:capital', async (req, res) => {
    const { country } = await db.collection(collection).findOne({ capital: req.params.capital })
    res.json(country)
})

app.get('/api/capitals/:country', (async (req, res) => {
    const country = await db.collection(collection).findOne({ country: req.params.country })
    res.json(country.capital)
}))


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
