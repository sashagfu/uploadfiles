let dropArea = document.getElementById('drop-area');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unHighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  dropArea.classList.add('active');
}

function unHighlight() {
  dropArea.classList.remove('active');
}

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  let allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ];

  files = [...files];

  let filteredFiles = files.filter(({ type }) => allowedFileTypes.includes(type));

  handleFiles(filteredFiles);
}

let uploadProgress = [];
let progressBar = document.getElementById('progress-bar');

function initializeProgress(numFiles) {
  progressBar.value = 0;
  uploadProgress = [];

  for (let i = numFiles; i > 0; i--) {
    uploadProgress.push(0);
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent;
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  console.debug('update', fileNumber, percent, total);
  progressBar.value = total;
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    let img = document.createElement('img');
    img.src = file.type === 'application/pdf' ? '/img/pdf-icon.png' : reader.result;
    document.getElementById('preview').appendChild(img);
  }
}

function uploadFile(file, i) {
  let url = 'https://api.cloudinary.com/v1_1/dmmnyyajj/upload';
  let xhr = new XMLHttpRequest();
  let formData = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  // Update progress
  xhr.upload.addEventListener('progress', (e) => {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
  });

  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      updateProgress(i, 100);
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      console.log('Error');
    }
  });

  formData.append('upload_preset', 'p9qx5zdw');
  formData.append('file', file);
  xhr.send(formData);
}

function handleFiles(files) {
  initializeProgress(files.length);
  files.forEach(uploadFile);
  files.forEach(previewFile);
}
