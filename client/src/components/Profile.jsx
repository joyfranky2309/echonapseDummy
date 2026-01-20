import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";
import api from "../utils/api";

const PATIENT_PLACEHOLDER = "https://via.placeholder.com/120";
const CARETAKER_PLACEHOLDER = "https://via.placeholder.com/80";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const conditionMap = {
    "1": "Mild memory difficulty",
    "2": "Moderate memory difficulty",
    "3": "Severe memory difficulty",
  };

  /* ===================== FETCH PROFILE ===================== */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/users/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  /* ===================== UPLOAD PATIENT PHOTO ===================== */
  async function handlePatientPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await api.post(
        "/users/upload-patient-photo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile(res.data);
    } catch (err) {
      console.error("Patient photo upload failed", err);
      alert("Failed to upload patient photo");
    }
  }

  /* ===================== UPLOAD CARETAKER PHOTO ===================== */
  async function handleCaretakerPhoto(index, file) {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await api.post(
        `/users/upload-caretaker-photo/${index}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile(res.data);
    } catch (err) {
      console.error("Caretaker photo upload failed", err);
      alert("Failed to upload caretaker photo");
    }
  }

  /* ===================== LOADING STATE ===================== */
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!profile) {
    return <Container>Error loading profile</Container>;
  }

  return (
    <Container>
      <h3 className="mb-4">Profile</h3>

      {/* ===================== PATIENT PROFILE ===================== */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <Image
                src={
                  profile.photo
                    ? `http://localhost:5000${profile.photo}`
                    : PATIENT_PLACEHOLDER
                }
                roundedCircle
                width={120}
                height={120}
              />
              <input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={handlePatientPhoto}
              />
            </Col>

            <Col md={9}>
              <h4>{profile.name}</h4>
              <p className="text-muted">
                Condition Level: {conditionMap[profile.conditionLevel]}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ===================== PATIENT DETAILS ===================== */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Patient Details</h5>
          <Row>
            <Col md={6}><strong>Age:</strong> {profile.age}</Col>
            <Col md={6}><strong>Phone:</strong> {profile.phone}</Col>
            <Col md={6}><strong>Email:</strong> {profile.email}</Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ===================== CARETAKERS ===================== */}
      <Card>
        <Card.Body>
          <h5>Caretakers</h5>

          {profile.caretakers.map((ct, index) => (
            <Card key={index} className="mb-3 border">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3} className="text-center">
                    <Image
                      src={
                        ct.photo
                          ? `http://localhost:5000${ct.photo}`
                          : CARETAKER_PLACEHOLDER
                      }
                      roundedCircle
                      width={80}
                      height={80}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={(e) =>
                        handleCaretakerPhoto(index, e.target.files[0])
                      }
                    />
                  </Col>

                  <Col md={9}>
                    <strong>
                      {ct.name} ({ct.relation})
                    </strong>
                    <div>📞 {ct.phone}</div>
                    <div>✉ {ct.email}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
