
function ButtonWidget({
  kind = "ok" as ("ok" | "cancel"),
  onClick = () => {},
  children
}) {
  return (
    <button type="button" className={`btn btn__${kind}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default ButtonWidget