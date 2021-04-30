'use strict';
const AWS = require('aws-sdk'); 
const fetch = require('node-fetch');

const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-2'}); //conexion dynamodb 

const returnResponse = (statusCode, params) => {
  const response = {
    "isBase64Encoded": true|false,
    statusCode: statusCode,
    headers:{
      'Access-Control-Allow-Origin':'*', //requerido para CORS
    },
    body:  JSON.stringify(params)
  };
  return response
};

module.exports.getPeople = async (event, context) => {
  try {
    let  nextQuery = event["queryStringParameters"];

    const  dynomoParams = {
      TableName: 'People',
      // Limit: 3,
      // ExclusiveStartKey: {
      //   "people_id": "83f58c25-8f7f-4522-8740-ab8ac0d62c42"
      // }
    };

    let peoples = await ddb.scan(dynomoParams).promise();

    let params = {
      // "next": "", 
      // "previous": "", 
      "mensaje": 'Personas listadas correctamente',
      // nextPage: nextQuery,
      "results": peoples.Items,
      "estado": true
    }

    return returnResponse(200, params);

  } catch (err) {

    let params = {
      "mensaje": err.message||'Error en listar personas',
      "estado": false
    }

    return returnResponse(404, params);

  }
};

module.exports.getPeopleById = async (event, context) => {
  try {
    let  idPeople =  event['pathParameters'].id;
    const  dynomoParams = {
      TableName: 'People',
      Key: {
        "persona_id": idPeople        
      },
      // ProjectionExpression: 'ATTRIBUTE_NAME'
    };

    let people = await ddb.get(dynomoParams).promise();

    if (!people.Item) {
      const url = `https://swapi.py4e.com/api/people/${idPeople}`;
      const swapiParams = {
        method: "GET",
      };

      let swapiPeople = await fetch(url, swapiParams);

     let peopleSwapi = await swapiPeople.json();

      let params = {
        "mensaje": peopleSwapi.detail == 'Not found' ? 'Id no encontrado o no registrado':'Persona listada correctamente de SWAPI',
        "people": peopleSwapi.detail == 'Not found' ? null: peopleSwapi,
        "estado": peopleSwapi.detail == 'Not found' ? false: true
      }

      return returnResponse(200, params);

    }else{
      let params = {
        "mensaje": 'Persona listada correctamente de DynamoDB',
        "people":   people.Item,
        "estado": true
      }
      return returnResponse(200, params);
    }

  } catch (err) {

    let params = {
      "mensaje": err.message||'Error en listar persona',
      "estado": false
    }

    return returnResponse(404, params);

  }
};

module.exports.createPeople = async (event, context) => {
  try {

    const host = event.headers.Host;
    const path = event.requestContext.path;
    let body = JSON.parse(event.body);
    const requestId = context.awsRequestId;

    const  dynomoParams = {
      TableName: 'People',
      Item: {
        'persona_id' : requestId,
        "nombre": body.nombre, 
        "altura": body.altura, 
        "masa": body.masa, 
        "color_de_pelo": body.color_de_pelo, 
        "color_de_piel": body.color_de_piel, 
        "color_de_ojos": body.color_de_ojos, 
        "fecha_de_nacimiento": body.fecha_de_nacimiento, 
        "genero": body.genero, 
        "mundo_natal": body.mundo_natal, 
        "peliculas": body.peliculas, 
        "especies": body.especies, 
        "vehiculos": body.vehiculos, 
        "naves_estelares": body.naves_estelares,   
        "creado": String(new Date()), 
        "editado":String(new Date()), 
        "url": `https://${host}${path}/${requestId}`
      },
      ReturnValues: 'ALL_OLD'
    };

    const newPeople = await ddb.put(dynomoParams).promise();

    let params = {
      "mensaje": 'Persona creada  satisfactoriamente',
      // people: dynomoParams.Item,
      "estado":true
    }

    return returnResponse(201, params);

  } catch (err) {

    let params = {
      "mensaje": err.message||'Error en crear persona',
      "estado": false
    }

    return returnResponse(404, params);
  }
};

module.exports.returnResponse = returnResponse;