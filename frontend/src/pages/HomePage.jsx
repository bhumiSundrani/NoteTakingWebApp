import { useSelector } from 'react-redux'
import {Home, UnAuthHome, Container} from '../components'
import React from 'react'

function HomePage(){
    const status = useSelector(state => state.auth.status)
  return (
    <Container>
        {status ? <Home/> : <UnAuthHome/>}
    </Container>
  )
}

export default HomePage