import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

function Help() {
  const [knowsLocation, setKnowsLocation] = useState("");
  const [locationSent, setLocationSent] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapsLink, setMapsLink] = useState("");
  const [error, setError] = useState("");

  function handleSendLocation() {
    setError("");
    setLocationSent(false);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const coords = { latitude, longitude };

        // ✅ GOOGLE MAPS LINK
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        console.log("📍 Location sent:", coords);
        console.log("🗺️ Google Maps link:", googleMapsUrl);

        setLocation(coords);
        setMapsLink(googleMapsUrl);
        setLocationSent(true);
      },
      (err) => {
        console.error("❌ Location error:", err);

        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied. Please allow access.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError("Location information is unavailable.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out. Try again.");
        } else {
          setError("Unable to fetch location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  return (
    <>
      <h3 className="mb-4">Help</h3>

      <Card className="mb-4">
        <Card.Body>
          {/* Main Question */}
          <h2 className="fw-bold text-center mb-4">
            DO YOU KNOW WHERE YOU ARE?
          </h2>

          {/* Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Your Answer</Form.Label>
            <Form.Select
              value={knowsLocation}
              onChange={(e) => {
                setKnowsLocation(e.target.value);
                setLocationSent(false);
                setLocation(null);
                setMapsLink("");
                setError("");
              }}
              required
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Form.Select>
          </Form.Group>

          {/* Warning if No */}
          {knowsLocation === "no" && (
            <Alert variant="danger">
              Please send your location immediately so your caretaker can help you.
            </Alert>
          )}

          {/* Error */}
          {error && <Alert variant="warning">{error}</Alert>}

          {/* Send Location Button */}
          <div className="text-center">
            <Button
              variant="primary"
              disabled={!knowsLocation}
              onClick={handleSendLocation}
            >
              Send Location
            </Button>
          </div>

          {/* Success Message */}
          {locationSent && location && (
            <Alert variant="success" className="mt-3">
              <strong>Location sent successfully.</strong>

              <div className="mt-2">
                <div>
                  <strong>Latitude:</strong> {location.latitude}
                </div>
                <div>
                  <strong>Longitude:</strong> {location.longitude}
                </div>
                <div className="mt-2">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default Help;
