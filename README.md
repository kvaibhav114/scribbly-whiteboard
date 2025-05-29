# Collaborative Whiteboard App 🎨

A real-time collaborative whiteboard built with **React**, **TypeScript**, **HTML Canvas API**, **Socket.IO**, and **Keycloak**. It enables multiple authenticated users to draw together on a shared canvas, chat in real-time, and interact visually via cursor sharing.

---

## Screenshots

### Landing Page
<!-- Add landing page screenshot here -->
![Screenshot 2025-05-18 035443](https://github.com/user-attachments/assets/d4388aa7-39e8-433a-b409-2c9e905f3b8e)


### Authentication
![Screenshot 2025-05-18 173002](https://github.com/user-attachments/assets/7767ce83-e4bd-474c-9119-0b25cabd0b93)


### Dashboard
<!-- Add dashboard screenshot here -->
![Screenshot 2025-05-18 040543](https://github.com/user-attachments/assets/b6ba395b-53a9-4141-8b9d-6356125355e5)



### Drawing Canvas
<!-- Add drawing canvas screenshot here -->
![Screenshot 2025-05-18 173220](https://github.com/user-attachments/assets/f50d7991-0da5-4305-839c-8daa12d614b2)



### Multi-User Canvas Interaction
<!-- Add multi-user canvas screenshot here -->
![Screenshot 2025-05-18 173422](https://github.com/user-attachments/assets/be951450-4b1e-4dc4-84fd-9db3b616140d)

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

- **Frontend**: React, TypeScript, Bootstrap 5, HTML Canvas API 
- **Backend**: Node.js, Express, Socket.IO  
- **Auth**: Keycloak (via Docker container)  
- **PDF Export**: jsPDF  
- **Communication**: WebSockets (via Socket.IO)

---
