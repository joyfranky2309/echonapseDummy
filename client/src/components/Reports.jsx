import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

function Reports() {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    file: null,
  });

  const [reports, setReports] = useState([]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.file) return;

    const newReport = {
      title: formData.title,
      type: formData.type,
      fileName: formData.file.name,
      fileUrl: URL.createObjectURL(formData.file), // in-memory
      date: new Date().toLocaleDateString(),
    };

    setReports([newReport, ...reports]);

    setFormData({
      title: "",
      type: "",
      file: null,
    });
  }

  return (
    <>
     <Card className="mb-4">
  <Card.Body>
    <h5 className="mb-3">Upload Medical Report</h5>

    {/* Primary action */}
    <Form.Group className="mb-3">
      <Form.Control
        type="file"
        name="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleChange}
      />
      <Form.Text className="text-muted">
        You can upload prescriptions, scans, or lab reports
      </Form.Text>
    </Form.Group>

    {/* Show extra fields ONLY after file selected */}
    {formData.file && (
      <>
        <Form.Group className="mb-3">
          <Form.Label>Report Title (optional)</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={formData.file.name}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Report Type (optional)</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="prescription">Prescription</option>
            <option value="lab">Lab Report</option>
            <option value="scan">Scan</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit">Upload Report</Button>
      </>
    )}
  </Card.Body>
</Card>
    </>
  );
}

export default Reports;
