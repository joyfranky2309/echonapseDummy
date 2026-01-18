import React from 'react'
import Title from './Title'
import {Container, Row} from 'react-bootstrap'
function Navbar() {
  return (
    <Container>
        <Row className="bg-primary py-3 mb-4">
        <Title/>
        </Row>
    </Container>
  )
}

export default Navbar