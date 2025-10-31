const Notification = ({ message, displayClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={displayClass}>
      {message}
    </div>
  )
}

export default Notification