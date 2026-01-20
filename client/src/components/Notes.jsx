import { useEffect, useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import api from "../utils/api";

function Notes() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [noteText, setNoteText] = useState("");
  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===================== FETCH NOTES ===================== */
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);

      try {
        const res = await api.get("/entries", {
          params: { date: selectedDate },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("❌ Fetch notes error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [selectedDate]);

  /* ===================== ADD NOTE ===================== */
  async function addNote(e) {
    e.preventDefault();

    const payload = {
      content: noteText,
      mood: mood,
      date: selectedDate,
    };

    try {
      const res = await api.post("/entries", payload);
      setNotes([res.data, ...notes]);
      setNoteText("");
      setMood("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add note");
    }
  }

  const isToday = selectedDate === today;

  return (
    <>
      <h3 className="mb-4">Notes</h3>

      {/* Date Selector */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Add Note – ONLY TODAY */}
      {isToday && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={addNote}>
              {/* Mood Input */}
              <Form.Group className="mb-3">
                <Form.Label>How are you feeling today?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Calm, Confused, Happy"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Note Input */}
              <Form.Group className="mb-3">
                <Form.Label>Today's Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit">Add Note</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Notes List */}
      {loading ? (
        <Spinner animation="border" />
      ) : notes.length === 0 ? (
        <p className="text-muted">No notes for this date.</p>
      ) : (
        notes.map((note) => (
          <Card key={note._id} className="mb-3">
            <Card.Body>
              <div className="text-muted small">
                {note.date} •{" "}
                {new Date(note.createdAt).toLocaleTimeString()}
              </div>

              {/* Mood Display */}
              {note.mood && (
                <div className="mt-1">
                  <strong>Mood:</strong> {note.mood}
                </div>
              )}

              <p className="mt-2">{note.content}</p>

              {!isToday && (
                <div className="text-muted small">
                  🔒 Read-only (past date)
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </>
  );
}

export default Notes;
