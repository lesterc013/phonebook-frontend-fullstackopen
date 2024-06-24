import axios from "axios"

const baseUrl = 'http://localhost:3001/persons'

const getPeople = () => {
  // Get the request --> Will get a response as the Promise value consisting of things like the request url, the methods but most importantly, the data
  const request = axios.get(baseUrl)
  const notInDatabase = {
    name: 'Not in database',
    number: '000',
    id: '000'
  }
  return request.then(response => response.data.concat(notInDatabase)) // Note that no curly braces because we want to RETURN the value of response.data to this Promise, that will be then returned in App.jsx to be used further
}

const addPerson = (person) => {
  const request = axios.post(baseUrl, person)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const updatePerson = (person) => {
  const request = axios.put(`${baseUrl}/${person.id}`, person)
  return request.then(response => response.data)
}

export default { getPeople, addPerson, deletePerson, updatePerson }