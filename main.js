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

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days*864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

function parseConsent() {
  const consentCookie = getCookie('cookieConsent');
  if (!consentCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(consentCookie));
  } catch {
    return null;
  }
}

function loadGoogleAnalytics() {
  const consent = parseConsent();
  if (!consent?.analytics) return;

  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XTYJX4GCPB";
  document.head.appendChild(gtagScript);

  gtagScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-XTYJX4GCPB', { anonymize_ip: true });

    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  };
}

function showConsentBannerIfNeeded() {
  if (!getCookie('cookieConsent')) {
    document.getElementById('cookie-consent-banner').style.display = 'block';
  } else {
    loadGoogleAnalytics();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showConsentBannerIfNeeded();

  document.getElementById('cookie-consent-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const consent = {
      preferences: true,
      analytics: form.analytics.checked,
      marketing: form.marketing.checked
    };
    setCookie('cookieConsent', encodeURIComponent(JSON.stringify(consent)), 180);
    document.getElementById('cookie-consent-banner').style.display = 'none';
    loadGoogleAnalytics();
  });

  document.getElementById('reject-all').addEventListener('click', () => {
    const consent = { preferences: true, analytics: false, marketing: false };
    setCookie('cookieConsent', encodeURIComponent(JSON.stringify(consent)), 180);
    document.getElementById('cookie-consent-banner').style.display = 'none';
  });
});






