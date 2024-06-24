const Input = ({ name, handler }) => {
  return (
    <div>
      {name}: <input onChange={handler} />
    </div>
  )
}

export default Input