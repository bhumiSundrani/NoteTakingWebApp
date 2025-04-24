import React from 'react'

function Container({children}) {
  return (
    <div className='h-full w-full flex flex-col bg-[#242323]'>
        {children}
    </div>
  )
}

export default Container