const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')//midd
const httpUrlencodeBodyParser = require('@middy/http-urlencode-body-parser')//midd
const httpErrorHandler = require('@middy/http-error-handler')//midd
const createError = require('http-errors')//midd
const axios = require('axios');
//const bodyBrasPres = require('../utils/bodyBrasPres');
//const cors = require('@middy/http-cors')
const convert = require('xml-js')
require('dotenv').config()


const braspres = async event => {
  try {

    if (
      event.httpMethod === 'OPTIONS'
    ) {
      return {
        statusCode: 200,
        headers: {
          'access-control-allow-origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json'
        },
        body: 'ok'
      }
    }


    const dadoshtml = JSON.parse(event.body);
    const bodyBras = {
      CNPJ: "28026371000161",
      EMPORIGEM: "2",
      CEPORIGEM: '01123010',
      CEPDESTINO: dadoshtml.cepDestino,
      CNPJREM: "28026371000161",
      CNPJDES: "28026371000161",
      TIPOFRETE: "2",
      PESO: dadoshtml.peso,
      VALORNF: dadoshtml.valorDeclarado,
      VOLUME: dadoshtml.quantidade,
      MODAL: "R"
    }


    const url = Object.values(bodyBras)
    //console.log(url)
    const frete = await axios.post(`http://www.braspress.com.br/cotacaoXml?param=${url}`)
    const braspres = convert.xml2json(frete.data, { compact: true, spaces: 4 });
    module.exports = {braspres}

    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json'
      },
      body: braspres

    }

  } catch (error) {
    console.log(error.response.data)
    throw createError(500, error.response.data)
  }
}

const handler = middy(braspres)
  .use(httpJsonBodyParser())
  .use(httpUrlencodeBodyParser())
  .use(httpErrorHandler())
//.use(cors({ headers: 'origins, x-requested-with, content-type, accept, application/json, Access-Control-Allow-Origin: *' }))



module.exports = { handler }