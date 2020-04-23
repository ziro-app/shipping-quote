const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpUrlencodeBodyParser = require('@middy/http-urlencode-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')
const axios = require('axios');
const bodyGoFrete = require('../utils/bodyGoFrete');
const goFrete = require('../utils/axiosConfigGoFrete')
require('dotenv').config()

const gofrete = async event => {
	try {
		
		const data = await axios.post(`api.gofretes.com.br/cotacao`, bodyGoFrete)
		console.log(data.data)
		return {
			statusCode: 200,
			body: JSON.stringify(data.data),

		}
	} catch (error) {
				throw (error)
		}
}

const handler = middy(gofrete)
	.use(httpJsonBodyParser())
	.use(httpUrlencodeBodyParser())
	.use(httpErrorHandler())

module.exports = { handler }