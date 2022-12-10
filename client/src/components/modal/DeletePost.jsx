import React from 'react'

export default function DeletePost() {
  return (
    <div>
      <h1 className='modal-centered'>Delete Post?</h1>
      <hr />
      <h4 className='modal-centered'>This action can't be undone</h4>
      <div className="modal-btns">
        <button className='cancel-btn'>Cancel</button>
        <button className='delete-btn'>Delete</button>
      </div>
    </div>
  )
}
