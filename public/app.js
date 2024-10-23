const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

const fileInput = document.getElementById('file-input');
const pdfContainer = document.getElementById('pdf-container');
const cursorLayer = document.getElementById('cursor-layer');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const readyButton = document.getElementById('ready-button');
const notes = document.getElementById('notes');
const progressBar = document.getElementById('progress');
const socket = new WebSocket(`wss://${window.location.host}`);
let pdfDoc = null;
let pageNum = 1;
let readyState = false;
let peerReadyState = false;
let notesContent = '';

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const pdfData = new Uint8Array(e.target.result);
      pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
        pdfDoc = pdf;
        pageNum = 1;
        renderPage(pageNum);
        updateProgressBar();
      }).catch(error => {
        console.error('Error rendering PDF:', error);
      });
    };
    reader.readAsArrayBuffer(file);
  }
});

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    pdfContainer.innerHTML = '';
    pdfContainer.appendChild(canvas);
    pdfContainer.appendChild(cursorLayer); // Ensure cursor layer is always on top
    page.render({ canvasContext: context, viewport: viewport });
  });
}

prevPageButton.addEventListener('click', () => {
  if (pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
    sendPageUpdate();
    updateProgressBar();
  }
});

nextPageButton.addEventListener('click', () => {
  if (pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum);
    sendPageUpdate();
    updateProgressBar();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' && pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum);
    sendPageUpdate();
    updateProgressBar();
  } else if (event.key === 'ArrowLeft' && pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
    sendPageUpdate();
    updateProgressBar();
  }
});

readyButton.addEventListener('click', () => {
  readyState = true;
  console.log('Ready button clicked:', readyState);
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
    renderPage(pageNum);
    updateProgressBar();
  } else if (data.type === 'ready-state') {
    peerReadyState = data.readyState;
    checkIfBothReady();
  } else if (data.type === 'notes-update') {
    notesContent = data.notesContent;
    notes.value = notesContent;
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
    console.log('Both users are ready');
    if (pageNum < pdfDoc.numPages) {
      pageNum++;
      renderPage(pageNum);
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
