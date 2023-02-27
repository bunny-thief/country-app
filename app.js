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
app.use(express.static('public'))

MongoClient.connect(connection_string, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(database)
        console.log(`Connected to database`)
    })

app.get('/', (req, res) => {
    res.render('index', { title: 'Country Info | Home' })
})

app.get('/search', (req, res) => {
    res.render('search', { title: 'Country Info | Search' })
})

app.get('/country', async (req, res) => {
    const { country, capital, population, area } = await db.collection(collection).findOne({ country: req.query.getCountry })
    res.render('country', { title: 'Country Info | Country', country, capital, population, area })
})

app.get('/countries', async (req, res) => {
    const countries = await db.collection(collection).find().sort({ country: 1 }).toArray()
    res.render('countries', { title: 'Country Info | Countries', countries })
})

app.get('/api/countries', async (req, res) => {
    const countries = await db.collection(collection).find().toArray()
    res.json(countries)
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
