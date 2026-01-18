import React, { useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginRegister.css';
import Title from './Title';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    phoneNumber: '',
    password: '',
  });

  const [registrationData, setRegistrationData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    password: '',
    caretakerName: '',
    caretakerPhoneNumber: '',
  });

  const handleChange = (e, setter, data) => {
    const { name, value } = e.target;
    setter({ ...data, [name]: value });
  };

  return (
    <Container fluid className="login-register-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6}>
          <Card className="login-register-card">
            <Card.Body>
              <Title />

              <div className="form-toggle-container">
                <div className="toggle-buttons">
                  <button
                    className={`toggle-btn ${isLogin ? 'btn-primary' : ''}`}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                  <button
                    className={`toggle-btn ${!isLogin ? 'btn-primary' : ''}`}
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </button>
                </div>
              </div>

              <div className="form-container fade-in">
                {isLogin ? (
                  <>
                    <h2>Login</h2>
                    <form>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className="form-control"
                          placeholder="Enter your phone number"
                          value={loginData.phoneNumber}
                          onChange={(e) =>
                            handleChange(e, setLoginData, loginData)
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) =>
                            handleChange(e, setLoginData, loginData)
                          }
                        />
                      </div>

                      <button className="submit-btn">Login</button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2>Create Account</h2>
                    <form>
                      {[
                        ['name', 'Name'],
                        ['age', 'Age'],
                        ['phoneNumber', 'Phone Number'],
                        ['password', 'Password'],
                        ['caretakerName', "Caretaker's Name"],
                        ['caretakerPhoneNumber', "Caretaker's Phone"],
                      ].map(([key, label]) => (
                        <div className="form-group" key={key}>
                          <label className="form-label">{label}</label>
                          <input
                            type={key === 'age' ? 'number' : 'text'}
                            name={key}
                            className="form-control"
                            value={registrationData[key]}
                            onChange={(e) =>
                              handleChange(
                                e,
                                setRegistrationData,
                                registrationData
                              )
                            }
                          />
                        </div>
                      ))}

                      <button className="submit-btn">Register</button>
                    </form>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginRegister;
