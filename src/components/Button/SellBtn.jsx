import React from 'react'

const SellBtn = () => {

    const addListing = () => {
        window.location.href = '/addlisting';
    }

  return (
    <div className='sell-btn-small-device' onClick={addListing}>
    </div>
  )
}

export default SellBtn
