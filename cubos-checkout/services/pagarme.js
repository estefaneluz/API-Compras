const axios = require('axios')
const api_key = require('../../apikey')

const instanciaAxios = axios.create({
  baseURL: 'https://api.pagar.me/1/',
  params: {
    api_key: api_key,
  },
})

module.exports = instanciaAxios