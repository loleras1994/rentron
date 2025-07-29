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

        // ✅ Cookie Consent logic starts AFTER footer is injected
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted') {
          loadGoogleAnalytics();
        } else if (consent === null) {
          showCookieBanner();
        }
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
  const hamburger = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('close-mobile-menu');
  const rightTools = document.querySelector('.mobile-nav-container .right-tools');

  if (!hamburger || !mobileMenu) return;

  // Άνοιγμα μενού
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('show');
    document.body.classList.add('menu-open');
    if (rightTools) rightTools.style.display = 'none';
  });

  // Κλείσιμο με Χ
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
      document.body.classList.remove('menu-open');
      if (rightTools) rightTools.style.display = '';
    });
  }

	// Κλείσιμο όταν πατηθεί link (με fade animation + ενεργό link)
	mobileMenu.querySelectorAll('a').forEach(link => {
	  link.addEventListener('click', (e) => {
		e.preventDefault(); // σταματάμε το redirect προσωρινά

		// Επισήμανση active link
		mobileMenu.querySelectorAll('a').forEach(el => el.classList.remove('active-link'));
		link.classList.add('active-link');

		// Κλείσιμο με animation
		mobileMenu.classList.remove('show');
		document.body.classList.remove('menu-open');
		if (rightTools) rightTools.style.display = '';

		// Προαιρετικά: αν θέλεις να περιμένει λίγο πριν φύγει
		setTimeout(() => {
		  window.location.href = link.href;
		}, 600); // ίδιο με το CSS transition
	  });
	});


  // Κλείσιμο όταν πατήσεις έξω από το μενού
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    const isClickOnClose = closeBtn && closeBtn.contains(e.target);
    if (!isClickInsideMenu && !isClickOnHamburger && !isClickOnClose && mobileMenu.classList.contains('show')) {
      mobileMenu.classList.remove('show');
      document.body.classList.remove('menu-open');
      if (rightTools) rightTools.style.display = '';
    }
  });
}





function setupLangSwitcher() {
  const currentPath = window.location.pathname;
  const isGreek = currentPath.includes("/el/");
  const isEnglish = currentPath.includes("/en/");
  let targetFile = currentPath.split("/").pop();
  if (!targetFile || targetFile === "") targetFile = "index.html";

  let grPath = "../el/" + targetFile;
  let enPath = "../en/" + targetFile;

  const langHTML = `
    <a href="${grPath}" lang="el"${isGreek ? ' class="active"' : ''}>GR</a> | 
    <a href="${enPath}" lang="en"${isEnglish ? ' class="active"' : ''}>EN</a>
  `;

  const desktopSwitcher = document.getElementById("lang-switcher");
  const mobileSwitcher = document.getElementById("lang-switcher-mobile");

  if (desktopSwitcher) desktopSwitcher.innerHTML = langHTML;
  if (mobileSwitcher) mobileSwitcher.innerHTML = langHTML;
}

// ================================================
// Cookie Consent for Google Analytics
// ================================================

function loadGoogleAnalytics() {
  const GA_ID = 'G-XTYJX4GCPB';
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gtagScript);

  gtagScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID);
  };
}

function showCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.style.display = 'block';

  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.style.display = 'none';
      loadGoogleAnalytics();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      banner.style.display = 'none';
    });
  }
}





