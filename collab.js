document.addEventListener('DOMContentLoaded', () => {
  const docTitleDisplay = document.getElementById('docTitleDisplay');
  const docTitleInput = document.getElementById('docTitleInput');
  const docTitleContainer = document.querySelector('.doc-title-container');
  const contentEditableDiv = document.querySelector('[contenteditable]');
  
  const placeholderText = "Start typing your document";
  let versionHistory = [];

  // Set initial placeholder text
  function setPlaceholder() {
      if (contentEditableDiv.textContent.trim() === '') {
          contentEditableDiv.textContent = placeholderText;
          contentEditableDiv.style.color = '#aaa'; // Placeholder color
      }
  }
  setPlaceholder();

  // Remove placeholder when typing starts
  contentEditableDiv.addEventListener('focus', () => {
      if (contentEditableDiv.textContent.trim() === placeholderText) {
          contentEditableDiv.textContent = '';
          contentEditableDiv.style.color = ''; // Reset to normal text color
      }
  });

  // If content is empty after losing focus, show placeholder
  contentEditableDiv.addEventListener('blur', setPlaceholder);

  // Title editing functionality
  docTitleDisplay.addEventListener('click', () => {
      docTitleContainer.classList.add('editing');
      docTitleInput.focus();
  });

  docTitleInput.addEventListener('blur', () => {
      if (docTitleInput.value.trim() !== '') {
          docTitleDisplay.textContent = docTitleInput.value;
          saveVersion("Edited document title");
      }
      docTitleContainer.classList.remove('editing');
  });

  docTitleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          docTitleInput.blur();
      }
  });

  // Apply selected font
  document.getElementById('fontDropdown').addEventListener('change', (e) => {
      const selectedFont = e.target.value;
      applyFontFamily(selectedFont);
      saveVersion("Changed font to " + selectedFont);
  });

  // Undo and Redo using history
  document.querySelector('.undo-btn').addEventListener('click', () => {
      document.execCommand('undo');
  });

  document.querySelector('.redo-btn').addEventListener('click', () => {
      document.execCommand('redo');
  });

  // Print
  document.querySelector('.print-btn').addEventListener('click', () => {
      window.print();
  });

  // Zoom functionality
  document.getElementById('zoomDropdown').addEventListener('change', (e) => {
      document.body.style.zoom = e.target.value + "%";
  });

  // Bold, Italic, Underline
  document.querySelector('.bold-btn').addEventListener('click', () => {
      toggleStyle('bold');
      saveVersion("Applied bold style");
  });

  document.querySelector('.italic-btn').addEventListener('click', () => {
      toggleStyle('italic');
      saveVersion("Applied italic style");
  });

  document.querySelector('.underline-btn').addEventListener('click', () => {
      toggleStyle('underline');
      saveVersion("Applied underline style");
  });

  // Text Color
  document.querySelector('.text-color-btn').addEventListener('click', () => {
      const color = prompt('Enter a color code or name:');
      if (color) {
          applyTextColor(color);
          saveVersion("Changed text color to " + color);
      } else {
          alert("Invalid color input.");
      }
  });

  // Insert Link
  document.querySelector('.insert-link-btn').addEventListener('click', () => {
      const url = prompt('Enter the URL:');
      if (url && isValidURL(url)) {
          insertLink(url);
          saveVersion("Inserted link: " + url);
      } else {
          alert("Invalid URL.");
      }
  });

  // Insert Image
  document.querySelector('.insert-image-btn').addEventListener('click', () => {
      const imageUrl = prompt('Enter the image URL:');
      if (imageUrl && isValidURL(imageUrl)) {
          insertImage(imageUrl);
          saveVersion("Inserted image: " + imageUrl);
      } else {
          alert("Invalid image URL.");
      }
  });

  // Aligning text (Example: Center)
  document.querySelector('.align-btn').addEventListener('click', () => {
      applyTextAlign('center');
      saveVersion("Centered text");
  });

  // Bulleted List
  document.querySelector('.list-btn').addEventListener('click', () => {
      document.execCommand('insertUnorderedList');
      saveVersion("Added bulleted list");
  });

  // Version History Button and Feature
  const versionHistoryBtn = document.querySelector('.version-history-btn');
  const modal = createVersionHistoryModal();
  document.body.appendChild(modal);

  // Show version history on click
  versionHistoryBtn.addEventListener('click', () => {
      populateVersionHistory(); // Update modal content
      modal.classList.add('active');
  });

  // Close modal with confirmation if there are unsaved changes
  modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
  });

  // Optionally, close modal when clicking outside of it
  document.addEventListener('click', (event) => {
      if (!modal.contains(event.target) && event.target !== versionHistoryBtn) {
          modal.classList.remove('active');
      }
  });

  // Save the current state as a new version
  function saveVersion(changeDescription) {
      const currentContent = contentEditableDiv.innerHTML;
      versionHistory.push({
          timestamp: getCurrentTimestamp(),
          change: changeDescription,
          content: currentContent
      });
  }

  // Revert to a selected version
  function revertToVersion(index) {
      const version = versionHistory[index];
      contentEditableDiv.innerHTML = version.content;
      saveVersion("Reverted to version: " + version.timestamp);
      modal.classList.remove('active');
  }

  // Utility functions
  function getCurrentTimestamp() {
      const now = new Date();
      return now.toISOString().replace('T', ' ').slice(0, 19);
  }

  function isValidURL(string) {
      try {
          new URL(string);
          return true;
      } catch (_) {
          return false;
      }
  }

  function createVersionHistoryModal() {
      const modal = document.createElement('div');
      modal.className = 'version-history-modal';
      modal.innerHTML = `
          <button class="close-btn">&times;</button>
          <h2>Version History</h2>
          <ul id="versionHistoryList"></ul>
      `;
      return modal;
  }

  function populateVersionHistory() {
      const list = document.getElementById('versionHistoryList');
      list.innerHTML = ''; // Clear previous content

      versionHistory.forEach((entry, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${entry.timestamp}: ${entry.change}`;
          listItem.addEventListener('click', () => revertToVersion(index));
          list.appendChild(listItem);
      });
  }

  function applyFontFamily(font) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontFamily = font;
      range.surroundContents(span);
  }

  function toggleStyle(style) {
      document.execCommand(style);
  }

  function applyTextColor(color) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.color = color;
      range.surroundContents(span);
  }

  function insertLink(url) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.textContent = url;
      range.deleteContents();
      range.insertNode(anchor);
  }

  function insertImage(imageUrl) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const img = document.createElement('img');
      img.src = imageUrl;
      range.deleteContents();
      range.insertNode(img);
  }

  function applyTextAlign(alignment) {
      document.execCommand('justify' + alignment);
  }
});
