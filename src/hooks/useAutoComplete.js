import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

// @param onInput: onInput can be a function or an array cotaining a function and debounce duration
// [handleInput, 750]
const useAutoComplete = (props) => {
  const { values, onSelect, onInput, displayFunction } = props
  const [keyboardIndex, setKeyboardIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const isInputDebounced = Array.isArray(onInput)
  const _onInput = isInputDebounced ? onInput[0] : onInput
  const _dbValue = isInputDebounced ? onInput[1] : undefined

  function moveDown () {
    setKeyboardIndex((prev) => {
      if (prev < values.length - 1) {
        return prev + 1
      }
      return prev
    })
  }
  function moveUp () {
    setKeyboardIndex((prev) => {
      if (prev > 0) {
        return prev - 1
      }
      return prev
    })
  }
  function select (i) {
    onSelect(values[i])
    setIsOpen(false)
    setKeyboardIndex(-1)
  }
  function close () {
    setIsOpen(false)
    setKeyboardIndex(-1)
  }

  function _onInputChange (e) {
    setIsOpen(true)
    setKeyboardIndex(0)
    if (_onInput) {
      _onInput(e)
    }
    return true
  }

  const debouncedOnInput = useDebouncedCallback(_onInputChange, _dbValue)
  function onInputChange (e) {
    if (isInputDebounced) {
      e.persist()
      debouncedOnInput(e)
    } else {
      _onInputChange(e)
    }
  }

  function onClick (e) {
    const valueIndex = values.findIndex(
      (value) => value === e.target.textContent
    )
    if (valueIndex > -1) {
      select(valueIndex)
    }
  }

  function handleKeyDown (e) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        moveUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        setIsOpen(true)
        moveDown()
        break
      case 'Enter':
        e.preventDefault()
        select(keyboardIndex)
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      case 'Tab':
        setIsOpen(false)
        break
      default:
        break
    }
    return true
  }

  function getSuggestions () {
    return values.map((val) => (displayFunction ? displayFunction(val) : val))
  }
  const acControl = {
    moveDown,
    moveUp,
    select,
    close,
    onSelect: select,
    onClick,
    getSuggestions,
    displayFunction
  }

  const fields = {
    onKeyDown: handleKeyDown,
    onInput: onInputChange
  }

  const acState = {
    values,
    keyboardIndex,
    setKeyboardIndex,
    isOpen,
    setIsOpen
  }

  return {
    fields,
    autoComplete: {
      acControl,
      acState
    }
  }
}

export default useAutoComplete
