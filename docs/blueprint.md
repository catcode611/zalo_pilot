# **App Name**: ZaloPilot

## Core Features:

- Input Fields: Input field for Zalo user phone numbers and message template (with variables support).
- Send Button: "Send to All" button to initiate message sending.
- Status Display: Display status for each message (sent/failed) in a UI.
- Automated Messaging: Automate opening Zalo Web, searching contacts, opening chat, sending messages with random delays, and handling errors such as contacts not found or disconnects.
- Save Inputs: Utilize chrome.storage to save recent inputs (message + list) for future use.

## Style Guidelines:

- Primary color: Light Green (#DCEDC8) to align with Zalo's color scheme.
- Secondary color: White (#FFFFFF) for clean backgrounds and text contrast.
- Accent: Teal (#009688) for the "Send to All" button and interactive elements.
- Clean and readable font for input fields and status displays.
- Simple and clear icons for statuses (e.g., a checkmark for 'sent,' an 'X' for 'failed').
- Well-organized popup layout with clear sections for input, the send button, and the status display.

## Original User Request:
I want you to create a Chrome plugin that interacts with Zalo Web (https://chat.zalo.me/) and performs the following automated actions:

🎯 Goal:
Automatically send messages on Zalo Web to a specific list of users, using predefined message content.

🔧 Required Features:
User Interface (in the plugin popup):

Input field for a list of Zalo user phone numbers (or UIDs if accessible via Zalo Web).

Input field for the message template (with support for variables like {name}, {date}, etc.).

A “Send to All” button.

Status display for each message (sent/failed).

Automated Message Sending:

Open or switch to Zalo Web.

Search for each contact in the list.

Open chat window.

Send the message content.

Wait for a random delay between 2–6 seconds before sending to the next contact (to avoid spam detection).

Error Handling:

If a contact is not found, log the issue and continue.

If Zalo Web disconnects or crashes, show a notification to the user.

Compliance:

Do not violate Zalo’s terms of service.

If there is an official API, use it; otherwise, notify the user that the plugin uses browser automation.

📦 Technical Requirements:
Built with JavaScript and follows Manifest V3.

Avoid unstable UI simulation where possible.

Save recent inputs (message + list) using chrome.storage.

📄 Expected Deliverables:
A full plugin folder (ready for .zip and load via chrome://extensions).

Basic usage instructions in markdown format.

Future-friendly structure (e.g., easy to extend for CSV/Excel import).

🛠️ Optional Future Enhancements:
Add support for personalizing messages using user name mapping.

Schedule messages to be sent at specific times.

Sync message list from a Google Sheet.
  