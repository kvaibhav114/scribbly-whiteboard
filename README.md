# Collaborative Whiteboard App 🎨

A real-time collaborative whiteboard built with **React**, **TypeScript**, **Fabric.js**, **Socket.IO**, and **Keycloak**. It enables multiple authenticated users to draw together on a shared canvas, chat in real-time, and interact visually via cursor sharing.

---

## Screenshots

### Landing Page
<!-- Add landing page screenshot here -->
![Screenshot 2025-05-18 035443](https://github.com/user-attachments/assets/00250f5f-4d49-42e6-be5c-1b641b8bf01d)


### Dashboard
<!-- Add dashboard screenshot here -->
![image](https://github.com/user-attachments/assets/1d340076-0624-41eb-b767-5db7f4710cae)


### Drawing Canvas
<!-- Add drawing canvas screenshot here -->
![Screenshot 2025-05-18 035337](https://github.com/user-attachments/assets/1d18e4f0-d3bb-4369-a856-0228847e1e2e)


### Multi-User Canvas Interaction
<!-- Add multi-user canvas screenshot here -->
![Screenshot 2025-05-18 034826](https://github.com/user-attachments/assets/4da8c512-4ff0-496d-bbb9-c9f7f5853a83)


---

## Features

- **Real-Time Drawing**  
  Live sync of strokes across all users connected to the same session using `Socket.IO`.

- **Multi-User Cursor Tracking**  
  See each participant's cursor in real-time along with their username.

- **Authentication with Keycloak**  
  Users must log in via Keycloak before joining or creating a drawing session.

- **Chat Functionality**  
  Built-in session chat for communicating with other users in real-time.

- **Undo / Redo**  
  Modify your last drawing actions using keyboard shortcuts or UI controls.

- **Clear Canvas & Clear Chat**  
  Session-wide actions to reset the canvas or chat history for all users.

- **Responsive Design**  
  Automatically resizes the canvas based on the user's screen dimensions.

- **Save as PDF**  
  Export the current whiteboard as a landscape-oriented PDF file.

---

## Tech Stack

- **Frontend**: React, TypeScript, Bootstrap 5, Fabric.js  
- **Backend**: Node.js, Express, Socket.IO  
- **Auth**: Keycloak (via Docker container)  
- **PDF Export**: jsPDF  
- **Communication**: WebSockets (via Socket.IO)

---
