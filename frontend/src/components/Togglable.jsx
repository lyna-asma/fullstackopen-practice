import { useState, forwardRef, useImperativeHandle } from 'react'

// forwardRef lets this component RECEIVE a ref from its parent.
// Without forwardRef, a normal component can't accept `ref` as a prop at all.
const Togglable = forwardRef((props, ref) => {
  // refs = the noteFormRef object that App created and passed down

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  // this is the function we want App to be able to call from outside
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // useImperativeHandle says: "whatever object is inside `refs`,
  // set its .current property to THIS object" (here, just { toggleVisibility })
  // This runs on every render, but always writes into the SAME box (refs.current)
  // because refs itself never changes identity — App's useRef guarantees that.
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility // exposing ONLY this function, nothing else internal
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable