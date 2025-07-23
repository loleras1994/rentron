// Load HEADER and attach event listeners after it's injected
document.addEventListener("DOMContentLoaded", function () {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      const header = document.getElementById("main-header");
      if (header) {
        header.innerHTML = data;

        initHeaderInteractions(); // Attach listeners after injection
		setupLangSwitcher(); 
      }
    });

  // Load FOOTER (no interaction logic needed)
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      const footerPlaceholder = document.getElementById("footer-placeholder");
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = data;
      }
    });

  // Start slideshows
  document.querySelectorAll('.slideshow').forEach((slideshow) => {
    const slides = slideshow.querySelectorAll('.slide');
    let index = 0;

    if (slides.length > 0) {
      slides[0].classList.add('active');
    }

    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 4000);
  });
});

// ================================================
// Header Interactions
// ================================================
function initHeaderInteractions() {
  const navList = document.querySelector('.header-tools .nav-container nav ul');
  const hamburger = document.querySelector('.hamburger');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const navLinks = document.querySelectorAll('.header-tools nav a');

  // Hamburger toggle
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      navList.classList.toggle('active');
    });

    // Close menu when clicking a nav link (except dropdown toggles)
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (!link.classList.contains('dropdown-toggle') && navList.classList.contains('active')) {
          navList.classList.remove('active');
        }
      });
    });

    // Click outside nav to close
    document.addEventListener('click', (e) => {
      if (
        navList.classList.contains('active') &&
        !navList.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navList.classList.remove('active');
      }
    });
  }

  // Mobile dropdown toggle
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentDropdown = this.closest('.dropdown');

        // Close all other open dropdowns
        document.querySelectorAll('.dropdown.open').forEach(drop => {
          if (drop !== parentDropdown) drop.classList.remove('open');
        });

        // Toggle current dropdown
        parentDropdown.classList.toggle('open');
      }
    });
  });

  // Click outside to close dropdowns (mobile only)
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      const isDropdown = e.target.closest('.dropdown');
      const isNav = e.target.closest('.nav-container');
      if (!isDropdown && !isNav) {
        document.querySelectorAll('.dropdown.open').forEach(drop => {
          drop.classList.remove('open');
        });
      }
    }
  });
}

function setupLangSwitcher() {
  const langSwitcher = document.getElementById("lang-switcher");
  if (!langSwitcher) return;

  const currentPath = window.location.pathname;
  const isGreek = currentPath.includes("/el/");
  const isEnglish = currentPath.includes("/en/");

  let targetFile = currentPath.split("/").pop();
  if (!targetFile || targetFile === "") targetFile = "index.html";

  let grPath = "../el/" + targetFile;
  let enPath = "../en/" + targetFile;

  langSwitcher.innerHTML = `
    <a href="${grPath}" lang="el"${isGreek ? ' class="active"' : ''}>GR</a> | 
    <a href="${enPath}" lang="en"${isEnglish ? ' class="active"' : ''}>EN</a>
  `;
}



