# Shared Reading Tool 📚

🌐 **[Live Demo](https://app-oblg.onrender.com/)** - Try it out now!

## The Origin Story

Ever got one of those 3am lightbulb moments? 

A friend and I used to read books back then, but we were in different parts of the world, in different timezones. We never actually got to read together at the same time—it was always reading till a set point and catching up later. 

So one night, I thought: *What if I built a tool where both of us could read and talk about it at the same time?* 

I did my research at 3am and set out to build it first thing in the morning. From 6am, working straight through until 2am the next day, I created a working functional web app. This was my first real introduction to Node.js, and I had to learn it on the fly to implement a synchronized PDF reader with real-time chat.

Years later, I revisited and improved the project—and here it is.

## What It Does

This web application allows multiple users to:
- **Read PDFs together in real-time** - synchronized page navigation across all connected clients
- **Chat while reading** - discuss the content as you go through it together
- **Stay synchronized** - when one person turns a page, everyone sees the same page

Perfect for book clubs, study groups, remote reading sessions, or just reading with friends across the world.

## Features

- 📖 Real-time PDF viewing with synchronized page turning
- 💬 Integrated chat system for discussions
- 🔄 WebSocket-based synchronization
- 🎨 Clean, modern interface
- 📱 Responsive design
- 🚀 Lightweight and fast

## Tech Stack

- **Backend**: Node.js + Express
- **WebSockets**: ws library for real-time communication
- **PDF Rendering**: PDF.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## Installation

### Option 1: Use the Deployed Version
Simply visit **[https://app-oblg.onrender.com/](https://app-oblg.onrender.com/)** and start reading together!

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## Usage

1. Open the application in multiple browser windows/tabs (or share the link with friends)
2. Upload a PDF file in one window
3. All connected users will see the same PDF
4. Navigate through pages—everyone stays synchronized
5. Use the chat panel to discuss the content in real-time

## How It Works

The application uses WebSockets to create a persistent connection between all connected clients. When any action occurs (page turn, chat message, PDF upload), it's broadcast to all other connected users, keeping everyone in sync.

```
Client 1 ──────┐
                ├──→ WebSocket Server ──→ Broadcasts to all clients
Client 2 ──────┤
                │
Client 3 ──────┘
```

## Project Structure

```
app/
├── server.js           # Node.js server with WebSocket support
├── package.json        # Project dependencies
├── public/
│   ├── index.html      # Main application interface
│   ├── app.js          # Client-side JavaScript
│   ├── pdf.mjs         # PDF.js library
│   └── pdf.worker.mjs  # PDF.js web worker
```

## Configuration

The server runs on port `8080` by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

## Future Improvements

- [ ] User authentication and rooms
- [ ] Persistent chat history
- [ ] Annotations and highlights
- [ ] Support for multiple document formats
- [ ] Video/voice chat integration
- [ ] Progress tracking and bookmarks

## License

ISC

---

*Built from a 3am idea to a functional reality in 20 hours. Sometimes the best projects come from simple problems that need solving.* ✨
