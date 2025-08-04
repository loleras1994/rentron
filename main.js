;(function(){
  // 1) Find your style.css link
  var cssLink = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  if (!cssLink) return;

  // 2) Change it to preload (starts download but doesn’t block render)
  cssLink.rel = 'preload';
  cssLink.as  = 'style';

  // 3) When it finishes loading, flip it back to a real stylesheet
  cssLink.addEventListener('load', function onLoad() {
    cssLink.rel = 'stylesheet';
    cssLink.removeEventListener('load', onLoad);
  });

  // 4) Fallback for older browsers: force it to stylesheet after 3s
  setTimeout(function(){
    if (cssLink.rel !== 'stylesheet') {
      cssLink.rel = 'stylesheet';
    }
  }, 3000);
})();





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
      
      // ✅ Εδώ πλέον το banner υπάρχει στο DOM
      showConsentBannerIfNeeded();

      // ✅ Συνδέουμε listeners με το σωστό timing
		const acceptBtn = document.getElementById('accept-cookies');
		const rejectBtn = document.getElementById('reject-cookies');

		if (acceptBtn) {
		  acceptBtn.addEventListener('click', () => {
			setCookie('cookieConsent', 'accepted', 30);
			document.getElementById('cookie-banner').style.display = 'none';
			loadGoogleAnalytics();
		  });
		}

		if (rejectBtn) {
		  rejectBtn.addEventListener('click', () => {
			setCookie('cookieConsent', 'rejected', 30);
			document.getElementById('cookie-banner').style.display = 'none';
		  });
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
  const secure = location.protocol === 'https:' ? ' Secure;' : '';
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax;${secure}`;
}

function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

function loadGoogleAnalytics() {
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
  };
}

function showConsentBannerIfNeeded() {
  const consent = getCookie('cookieConsent');

  // Αν έχει δώσει συναίνεση, φόρτωσε Analytics
  if (consent === 'accepted') {
    loadGoogleAnalytics();
    return;
  }

  // Αν έχει απορρίψει ή δεν έχει απαντήσει, ΜΗ φορτώσεις Analytics,
  // αλλά ΕΜΦΑΝΙΣΕ το banner μόνο αν δεν υπάρχει καθόλου cookie
  if (!consent) {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'block';
  }
}








