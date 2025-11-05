const express = require('express')
const axios = require("axios");
const { getClient } = require('../config/redisClient')
const cityRouter = express.Router();


const CACHE_TTL = 3600; // 1 hour


cityRouter.get('/cities', async (req, res) => {
    try {
        const client = getClient();
        const {namePrefix} = req.query;
        console.log('entered in to city.router')
        if (!namePrefix) return res.status(400).json({message: 'names Prefix required'})
        const cacheKey = `city:${namePrefix.toLocaleLowerCase()}`
        const cacheData = await client.get(cacheKey);
        // const cacheData = await redisClient.get(cacheKey)

        if (cacheData){
            console.log('cache hit for ', namePrefix)
            return res.json(JSON.parse(cacheData))
        }
        console.log('cache miss for', namePrefix + cacheData)
        const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
        params: {
            namePrefix,
            countryIds : 'IN',
            limit: 5
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    })

    const cities = response.data.data.map(city => ({
        name: city.city,
        lat: city.latitude,
        lng: city.longitude,
        region: city.region,
    }))

    await client.setEx(namePrefix.toLocaleLowerCase(), CACHE_TTL, JSON.stringify(cities))
    console.log(cities)
    res.json(cities)
    } catch (err) {
        res.json({
            status: 400,
            message: "ERROR : " + err
        })
    }
})


module.exports = cityRouter