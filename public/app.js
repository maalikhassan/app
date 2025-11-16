const fileInput = document.getElementById('file-input');
const pdfContainer = document.getElementById('pdf-container');
const cursorLayer = document.getElementById('cursor-layer');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const readyButton = document.getElementById('ready-button');
const notes = document.getElementById('notes');
const progressBar = document.getElementById('progress');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');
const deviceInfo = document.getElementById('device-info');
const socket = new WebSocket(`wss://${window.location.host}`);

// PDF.js setup
const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
if (pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
}

// Generate a unique device ID
const deviceId = 'Device-' + Math.random().toString(36).substr(2, 9).toUpperCase();

let pdfDoc = null;
let pageNum = 1;
let scale = 1.5;
let readyState = false;
let peerReadyState = false;
let notesContent = '';
let peerCursor = null;

// Display device information
deviceInfo.textContent = `Your Device: ${deviceId}`;

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const pdfData = new Uint8Array(e.target.result);
      pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
        pdfDoc = pdf;
        pageNum = 1;
        scale = 1;
        renderPage(pageNum);
        updateProgressBar();
      }).catch(error => {
        console.error('Error rendering PDF:', error);
        alert('Error loading PDF. Please try again.');
      });
    };
    reader.readAsArrayBuffer(file);
  }
});

function renderPage(num, pageScale = 1.5) {
  if (!pdfDoc) return;
  
  pdfDoc.getPage(num).then(page => {
    // Use higher DPI for better clarity on high-resolution displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    const effectiveScale = pageScale * devicePixelRatio;
    const viewport = page.getViewport({ scale: effectiveScale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    
    pdfContainer.innerHTML = '';
    pdfContainer.appendChild(canvas);
    pdfContainer.appendChild(cursorLayer);
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    page.render(renderContext).promise.catch(error => {
      console.error('Error rendering page:', error);
    });

    // Update page number display
    const pageNumberDisplay = document.getElementById('page-number');
    if (pageNumberDisplay) {
      pageNumberDisplay.textContent = `${num} / ${pdfDoc.numPages}`;
    }
  }).catch(error => {
    console.error('Error getting page:', error);
  });
}

prevPageButton.addEventListener('click', () => {
  if (pdfDoc && pageNum > 1) {
    pageNum--;
    renderPage(pageNum, scale);
    sendPageUpdate();
    updateProgressBar();
  }
});

nextPageButton.addEventListener('click', () => {
  if (pdfDoc && pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum, scale);
    sendPageUpdate();
    updateProgressBar();
  }
});

document.addEventListener('keydown', (event) => {
  if (!pdfDoc) return;
  
  if (event.key === 'ArrowRight' && pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum, scale);
    sendPageUpdate();
    updateProgressBar();
  } else if (event.key === 'ArrowLeft' && pageNum > 1) {
    pageNum--;
    renderPage(pageNum, scale);
    sendPageUpdate();
    updateProgressBar();
  }
});

readyButton.addEventListener('click', () => {
  readyState = !readyState;
  console.log('Ready button clicked:', readyState);
  
  // Update button visual state
  if (readyState) {
    readyButton.classList.add('active');
    readyButton.textContent = '✓ Ready (Waiting for Partner)';
  } else {
    readyButton.classList.remove('active');
    readyButton.textContent = 'Ready to Turn Page';
  }
  
  sendReadyState();
});
notes.addEventListener('input', (event) => {
  notesContent = event.target.value;
  sendNotesUpdate();
});

pdfContainer.addEventListener('mousemove', (event) => {
  if (socket.readyState === WebSocket.OPEN) {
    const rect = pdfContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    sendCursorUpdate(x, y);
  }
});

socket.onopen = () => {
  console.log('WebSocket connection established.');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received data:', data);
  if (data.type === 'page-update') {
    pageNum = data.pageNum;
    renderPage(pageNum, scale);
    updateProgressBar();
  } else if (data.type === 'ready-state') {
    peerReadyState = data.readyState;
    checkIfBothReady();
  } else if (data.type === 'notes-update') {
    notesContent = data.notesContent;
    notes.value = notesContent;
  } else if (data.type === 'chat-message') {
    displayReceivedMessage(data.senderDeviceId, data.message, data.timestamp);
  }
};

function sendPageUpdate() {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'page-update',
      pageNum: pageNum
    }));
  }
}

function sendReadyState() {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'ready-state',
      readyState: readyState
    }));
  }
}

function sendCursorUpdate(x, y) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'cursor-update',
      x: x,
      y: y
    }));
  }
}

function sendNotesUpdate() {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'notes-update',
      notesContent: notesContent
    }));
  }
}

function checkIfBothReady() {
  console.log('Checking readiness:', readyState, peerReadyState);
  if (readyState && peerReadyState) {
    readyState = false;
    peerReadyState = false;
    
    // Reset button state
    readyButton.classList.remove('active');
    readyButton.textContent = 'Ready to Turn Page';
    
    console.log('Both users are ready');
    if (pdfDoc && pageNum < pdfDoc.numPages) {
      pageNum++;
      renderPage(pageNum, scale);
      sendPageUpdate();
      updateProgressBar();
    }
  }
}

function updateProgressBar() {
  const progress = (pageNum / pdfDoc.numPages) * 100;
  progressBar.style.width = `${progress}%`;
}

function addPeerCursor() {
  if (!peerCursor) {
    peerCursor = document.createElement('div');
    peerCursor.className = 'cursor';
    cursorLayer.appendChild(peerCursor);
  }
  peerCursor.style.display = 'block';  // Ensure it's always visible
}

function updatePeerCursor(x, y) {
  if (!peerCursor) {
    addPeerCursor();
  }
  peerCursor.style.left = `${x}px`;
  peerCursor.style.top = `${y}px`;
  peerCursor.style.display = 'block';
}

function sendChatMessage(message) {
  if (message.trim() === '') return;
  
  const timestamp = new Date().toLocaleTimeString();
  
  // Display sent message
  displaySentMessage(message, timestamp);
  
  // Send to other clients
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'chat-message',
      senderDeviceId: deviceId,
      message: message,
      timestamp: timestamp
    }));
  }
  
  // Clear input
  chatInput.value = '';
}

function displaySentMessage(message, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message sent';
  messageDiv.innerHTML = `
    <div class="message-sender">You (${deviceId})</div>
    <div>${escapeHtml(message)}</div>
    <div class="message-time">${timestamp}</div>
  `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function displayReceivedMessage(senderDeviceId, message, timestamp) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message received';
  messageDiv.innerHTML = `
    <div class="message-sender">${senderDeviceId}</div>
    <div>${escapeHtml(message)}</div>
    <div class="message-time">${timestamp}</div>
  `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Show notification toast
  showMessageNotification(senderDeviceId, message);
}

function showMessageNotification(senderDeviceId, message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'message-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-sender">💬 ${senderDeviceId}</div>
      <div class="notification-message">${message.substring(0, 60)}${message.length > 60 ? '...' : ''}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Chat event listeners
sendButton.addEventListener('click', () => {
  sendChatMessage(chatInput.value);
});

chatInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendChatMessage(chatInput.value);
  }
});

// Zoom button listeners
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');

if (zoomInButton) {
  zoomInButton.addEventListener('click', () => {
    scale = Math.min(scale + 0.2, 3);
    if (pdfDoc) {
      renderPage(pageNum, scale);
    }
  });
}

if (zoomOutButton) {
  zoomOutButton.addEventListener('click', () => {
    scale = Math.max(scale - 0.2, 0.5);
    if (pdfDoc) {
      renderPage(pageNum, scale);
    }
  });
}