import React from 'react'

export const Overlay = ({ color }) => {
  return (
    <div
      style={{
        position: 'absolute',
        height: '47px',
        width: '47px',
        zIndex: 1,
        opacity: 0.25,
        backgroundColor: color,
      }}
    />
  )
}