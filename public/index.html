<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shared Reading Tool</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100vh;
      background-color: #f0f0f0;
      text-align: center;
    }
    header {
      width: 100%;
      padding: 10px;
      background-color: #4a4a4a;
      color: white;
      font-size: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    #file-input {
      margin: 20px 0;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    #pdf-container {
      width: 80%;
      height: 70vh;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow: auto;
      position: relative;
      margin-bottom: 20px;
      background-color: #fff;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .nav-buttons {
      margin: 10px 0;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    .zoom-buttons {
      display: none; /* Hide zoom buttons by default */
    }
    button {
      padding: 10px 20px;
      font-size: 14px;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #0056b3;
    }
    .zoom-button {
      padding: 5px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    #notes-section {
      width: 80%;
      margin: 10px 0;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    #notes {
      width: 100%;
      height: 100px;
      padding: 10px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      resize: none;
    }
    #progress-bar {
      width: 80%;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    #progress {
      height: 100%;
      background-color: #76c7c0;
      width: 0;
    }
    footer {
      font-size: 12px;
      color: #555;
      margin-top: 20px;
    }
    @media (max-width: 600px) {
      #pdf-container {
        width: 100%;
        height: 70vh;
      }
      button {
        padding: 8px 16px;
        font-size: 14px;
      }
      #notes-section {
        width: 100%;
      }
      .zoom-buttons {
        display: flex; /* Show zoom buttons on mobile */
        flex-direction: column;
        position: absolute;
        left: 10px;
        top: 10px;
      }
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js"></script>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
  </script>
</head>
<body>
  <header>Shared Reading Tool</header>
  <input type="file" id="file-input" accept="application/pdf">
  <div id="pdf-container">
    <div id="cursor-layer"></div>
  </div>
  <div id="progress-bar">
    <div id="progress"></div>
  </div>
  <div class="nav-buttons">
    <button id="prev-page">Previous Page</button>
    <button id="next-page">Next Page</button>
    <button id="ready-button">Ready</button>
  </div>
  <div class="zoom-buttons">
    <button id="zoom-in" class="zoom-button">+</button>
    <button id="zoom-out" class="zoom-button">-</button>
  </div>
  <div id="notes-section">
    <textarea id="notes" placeholder="Share your notes here..."></textarea>
  </div>
  <footer>Made by Maalik</footer>
  <script src="app.js"></script>
  <script>
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    let scale = 1;

    if (isMobile) {
      zoomInButton.addEventListener('click', () => {
        scale = Math.min(scale + 0.1, 3);
        renderPage(pageNum, scale); // Update renderPage to accept scale
      });

      zoomOutButton.addEventListener('click', () => {
        scale = Math.max(scale - 0.1, 0.5);
        renderPage(pageNum, scale); // Update renderPage to accept scale
      });
    }

    function renderPage(num, scale = 1) {
      pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
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
  </script>
</body>
</html>
