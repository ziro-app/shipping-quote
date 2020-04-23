const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpUrlencodeBodyParser = require('@middy/http-urlencode-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')
const axios = require('axios');
//const body = require('../utils/bodyConfig');
const axiosConfig = require('../utils/axiosConfig');




const api = async event => {
	try {
		if (
			event.httpMethod === 'OPTIONS'
		) {
			return {
				statusCode: 200,
				headers: {
					'access-control-allow-origin': '*',
					'Access-Control-Allow-Headers': '*'
				},
				body: 'ok'
			}
		}
		const dadosHtml = JSON.parse(event.body)
		const bodyCentral = {
			from: '01123010',
			to: dadosHtml.cepDestino,
			cargo_types: "[13, 37]",
			invoice_amount: dadosHtml.valorDeclarado,
			volumes: `[{\"quantity\": ${dadosHtml.quantidade}, \"width\": ${dadosHtml.largura}, \"height\": ${dadosHtml.altura}, \"length\": ${dadosHtml.comprimento}, \"weight\": ${dadosHtml.peso} }]`
		}
		const data = await axios.post(`https://api.centraldofrete.com/v1/quotation`, bodyCentral, axiosConfig)
		const centralDoFrete = await axios.get(`https://api.centraldofrete.com/v1/quotation/${data.data.code}`, axiosConfig)
		
		
		
		return {
			statusCode: 200,
			headers: {
				'access-control-allow-origin': '*',
				'Access-Control-Allow-Headers' : '*',
				'Content-Type': 'application/json'
			  },
			body: JSON.stringify(centralDoFrete.data),
			
		}
	} catch (error) {
		console.log(error.response.data)
		createError(500, error)
		}
}


const handler = middy(api)
	.use(httpJsonBodyParser())
	.use(httpUrlencodeBodyParser())
	.use(httpErrorHandler())

module.exports = { handler }

