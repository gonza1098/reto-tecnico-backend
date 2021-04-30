const people = require('./people');

test('Response es una funcion', () => { 
  // let params = {
  //   "mensaje": 'Funcion returnResponse funciona corectamente',
  //   // people: dynomoParams.Item,
  //   "estado":true
  // }
  // // callback 

  // let callback = ( n, response) =>{
  //   console.log(response);
  // }

  expect(typeof people.returnResponse).toBe('function');
});

test('Response esta funcionando !!', async () => { 
  let params = {
    "mensaje": 'Funcion returnResponse funciona corectamente',
    "estado":true
  }

  let res = people.returnResponse(200, params)
  expect(typeof res).toBe('object');
  expect(res.statusCode).toBe(200);
  expect(typeof res.body).toBe('string');
});

test('getPeople es una funcion', () => { 
  expect(typeof people.getPeople).toBe('function');
});

test('getPeopleById es una funcion', () => { 
  expect(typeof people.getPeopleById).toBe('function');
});

test('createPeople es una funcion', () => { 
  expect(typeof people.createPeople).toBe('function');
});
