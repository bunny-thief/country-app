const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const morgan = require('morgan')
require('dotenv').config()

let db
const connection_string = process.env.CONNECTION_STRING
const database = process.env.DB
const collection = process.env.COLLECTION
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')

app.use(morgan('tiny'))

MongoClient.connect(connection_string, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(database)
        console.log(`Connected to database`)
    })

app.get('/', (req, res) => {
    res.render('index', { title: 'Country Info | Home' })
})

app.get('/api/countries', async (req, res) => {
    const countryObjects = await db.collection(collection).find().toArray()
    res.json(countryObjects)
})

app.get('/api/countries/country/:country', async (req, res) => {
    const country = await db.collection(collection).findOne({ country: req.params.country })
    res.json(country)
})

app.get('/api/countries/capital/:capital', async (req, res) => {
    const { country } = await db.collection(collection).findOne({ capital: req.params.capital })
    res.json(country)
})

app.get('/api/capitals/:country', (async (req, res) => {
    const { capital } = await db.collection(collection).findOne({ country: req.params.country })
    res.json(capital)
}))


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
