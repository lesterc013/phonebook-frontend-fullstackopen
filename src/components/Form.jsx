import Input from "./Input.jsx"

const Form = ({ handleSubmit, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={handleSubmit} >
      <h2>add a new</h2>
      <Input name="name" handler={handleNameChange} />
      <Input name="number" handler={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Form