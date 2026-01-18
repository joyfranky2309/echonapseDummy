import React from 'react'
import {Container,Row,Col} from 'react-bootstrap'
import Title from '../Components/Title'
import Sidebar from '../Components/Sidebar'
function Dashboard() {
  return (
    <Container fluid>
      <Row>
        <Title/>
        <Col>
        <Sidebar/>
        </Col>
        <Col>
        <h1>Dashboard</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard