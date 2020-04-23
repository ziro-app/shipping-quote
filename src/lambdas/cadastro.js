const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpUrlencodeBodyParser = require('@middy/http-urlencode-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')
const axios = require('axios');
const axiosConfig = require('../utils/axiosConfig');
require('dotenv').config()

const receberCep = async event => {
	try {
		const { to } = await event.body
		const bodyCadastro = {
			from: "01123010",
			to: to,
			cargo_types: "[13, 37]",
			invoice_amount: 201.92,
			volumes: "[{\"quantity\": 1, \"width\": 10.2, \"height\": 8, \"length\": 4, \"weight\": 3 }]"
		}

		const data = await axios.post(`https://sandbox.centraldofrete.com/v1/quotation`, bodyCadastro, axiosConfig)
		const resultado = await axios.get(`https://sandbox.centraldofrete.com/v1/quotation/${data.data.code}`, axiosConfig)
		console.log(data.data.code)
		console.log(resultado.data)


		return {
			statusCode: 200,
			body: JSON.stringify(resultado.data)
		}

	} catch (error) {
		console.log(error)
		createError(500, error)
	}
}

const handler = middy(receberCep)
	.use(httpJsonBodyParser())
	.use(httpUrlencodeBodyParser())
	.use(httpErrorHandler())

module.exports = { handler }