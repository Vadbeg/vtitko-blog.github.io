(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
})(document);

// Dark Mode Toggle
(function(document) {
  const darkModeToggle = document.querySelector('#dark-mode-checkbox');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const darkMode = localStorage.getItem('darkMode');

  // Set initial checkbox state
  if (darkMode === 'enabled' || (darkMode === null && prefersDark)) {
    darkModeToggle.checked = true;
  }

  // Toggle dark mode on checkbox change
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });
})(document);
