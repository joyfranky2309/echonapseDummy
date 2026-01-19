function formatGoogleDate(date) {
    return date
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0];
}

async function createCalendarEvent(payload) {
    const { message, time } = payload;
    const title = message;
    const description = ` Reminds you to ${message}`;
    const start = new Date(time);

    // default: 30 minute event
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const startStr = formatGoogleDate(start);
    const endStr = formatGoogleDate(end);

    const calendarLink =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        `&text=${encodeURIComponent(title || "Reminder")}` +
        `&details=${encodeURIComponent(description || "Added from journal")}` +
        `&dates=${startStr}/${endStr}`;

    return {
        action: "SET_REMINDER",
        calendarLink,
        message: `✅ Reminder prepared for ${start.toLocaleString()}`
    };
}

module.exports = { createCalendarEvent };
