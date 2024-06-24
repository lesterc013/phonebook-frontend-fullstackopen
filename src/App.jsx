import { useState, useEffect } from 'react'
import Form from "./components/Form.jsx"
import Filter from "./components/Filter.jsx"
import Persons from "./components/Persons.jsx"
import Notification from './components/Notification.jsx'
import phonebook from './services/phonebook.js'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [timeoutID, setTimeoutID] = useState(undefined)

  useEffect(() => {
    phonebook.getPeople().then(allPeople => {
      setPersons(allPeople)
    })
  }, [])

  const handleNameChange = event => setNewName(event.target.value)
  
  const handleNumberChange = event => setNewNumber(event.target.value)

  const personNotInDatabase = (missingPerson) => {
    setMessage(`${missingPerson.name} is already deleted from database`)
    setMessageType('red')
    clearTimeout(timeoutID)
    setTimeoutID(setTimeout(() => {setMessage(null)}, 5000))
    setPersons(persons.filter(person => person.id !== missingPerson.id))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // If name and number already in phonebook
    if (persons.some((person) => person.name === newName && person.number === newNumber)) {
      alert(`${newName} is already added to the phonebook and number is the same`)
    } 
    // If name in phonebook, but number is different
    else if (persons.some((person) => person.name === newName)) {
      const toUpdatePerson = persons.filter(person => person.name === newName)[0]
      if (window.confirm(`${toUpdatePerson.name} is already added to phonebook, replace old number with a new one?`)) {
        toUpdatePerson.number = newNumber
        const toUpdateID = toUpdatePerson.id
        phonebook.updatePerson(toUpdatePerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === toUpdateID ? updatedPerson : person))
          })
          .catch(error => {
            personNotInDatabase(toUpdatePerson)
          })
      }
      setMessage(`Changed ${toUpdatePerson.name}'s number to ${toUpdatePerson.number}`)
    } 
    // If new person entirely
    else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      phonebook.addPerson(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
      })
      // First to setMessage to the newPerson's name
      setMessage(`Added ${newPerson.name}`)
    }
    setMessageType('green')
    // Clear any previous timeout so that the above message stays on for 3s even if a previous operation was done <3s ago
    // Need to useState to keep hold of the timeoutID
    clearTimeout(timeoutID)
    setTimeoutID(setTimeout(() => {setMessage(null)}, 5000))
  }

  const handleFilter = (event) => {
    setNewFilter(event.target.value.toLowerCase())
  }

  const handleDelete = (id) => {
    const toDeletePerson = persons.filter(person => person.id == id)
    if (window.confirm(`Confirm delete ${toDeletePerson[0].name}?`)) {
      phonebook.deletePerson(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
          setMessage(`Deleted ${toDeletePerson[0].name} from database`)
          setMessageType('green')
          clearTimeout(timeoutID)
          setTimeoutID(setTimeout(() => {setMessage(null)}, 5000))
      })
      // If the Promise is not fulfilled i.e. maybe the person has already been deleted
        .catch(error => {
          personNotInDatabase(toDeletePerson[0])
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} messageType={messageType} />
      <Filter handleFilter={handleFilter} />
      <Form handleSubmit={handleSubmit} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {/* Changed implementation to remove need for filteredPersons array -- Simply filter the persons array within the Numbers props */}
      <Persons persons={
        newFilter ? persons.filter(person => {
          return person.name.toLowerCase().includes(newFilter)
        }) : persons} handleDelete={handleDelete} />
    </div>
  )
}

export default App