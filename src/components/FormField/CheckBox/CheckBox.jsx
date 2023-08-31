import React from 'react'
import './CheckBox.scss'

const CheckBox = ({label, value}) => {
  return (
    <>
      <label className='checkbox-region'>{label}<input type="checkbox" className='checkbox' value={value}/><span class="checkmark"></span></label>
    </>
  )
}

export default CheckBox
