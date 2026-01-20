import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { setToken } from "../utils/auth";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    conditionLevel: "",
    caretakers: [
      { name: "", relation: "", phone: "", email: "" },
    ],
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleCaretakerChange(index, field, value) {
    const updatedCaretakers = [...formData.caretakers];
    updatedCaretakers[index][field] = value;

    setFormData({
      ...formData,
      caretakers: updatedCaretakers,
    });
  }

  function addCaretaker() {
    if (formData.caretakers.length >= 3) return;

    setFormData({
      ...formData,
      caretakers: [
        ...formData.caretakers,
        { name: "", relation: "", phone: "", email: "" },
      ],
    });
  }

  function removeCaretaker(index) {
    setFormData({
      ...formData,
      caretakers: formData.caretakers.filter((_, i) => i !== index),
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        age: formData.age,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        conditionLevel: formData.conditionLevel,
        caretakers: formData.caretakers,
      };
      console.log("👉 FINAL PAYLOAD SENT:", payload);


      const res = await api.post("/auth/register", payload);

      setToken(res.data.token);
      navigate("/notes");
    } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("BACKEND RESPONSE:", err.response?.data);
  alert(err.response?.data?.message || "Registration failed");
}

  }

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">Register</h3>

              <Form onSubmit={handleSubmit}>
                {/* Patient Details */}
                <h5 className="mb-3">Patient Details</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email ID</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Password */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Patient Condition Level</Form.Label>
                  <Form.Select
                    name="conditionLevel"
                    value={formData.conditionLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select level</option>
                    <option value="1">Level 1 – Mild memory difficulty</option>
                    <option value="2">Level 2 – Moderate memory difficulty</option>
                    <option value="3">Level 3 – Severe memory difficulty</option>
                  </Form.Select>
                </Form.Group>

                {/* Caretaker Details */}
                <h5 className="mb-3">Caretaker Details</h5>

                {formData.caretakers.map((caretaker, index) => (
                  <Card key={index} className="mb-3 border">
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-2">
                            <Form.Label>
                              Relation {index === 0 && "(Primary)"}
                            </Form.Label>
                            <Form.Select
                              value={caretaker.relation}
                              onChange={(e) =>
                                handleCaretakerChange(
                                  index,
                                  "relation",
                                  e.target.value
                                )
                              }
                              required
                            >
                              <option value="">Select relation</option>
                              <option value="Spouse">Spouse</option>
                              <option value="Son">Son</option>
                              <option value="Daughter">Daughter</option>
                              <option value="Sibling">Sibling</option>
                              <option value="Parent">Parent</option>
                              <option value="Caregiver">Caregiver</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-2">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={caretaker.name}
                              onChange={(e) =>
                                handleCaretakerChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-2">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="tel"
                              value={caretaker.phone}
                              onChange={(e) =>
                                handleCaretakerChange(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={caretaker.email}
                              onChange={(e) =>
                                handleCaretakerChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {index > 0 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeCaretaker(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                ))}

                <Button
                  variant="outline-primary"
                  className="mb-3"
                  onClick={addCaretaker}
                  disabled={formData.caretakers.length >= 3}
                >
                  + Add another caretaker
                </Button>

                <Button type="submit" className="w-100">
                  Register
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Already registered? <Link to="/login">Login here</Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
