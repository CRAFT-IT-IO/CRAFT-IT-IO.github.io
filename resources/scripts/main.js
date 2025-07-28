
var button = document.querySelector(".hero-button");
var buttonText = document.querySelector(".button-text");
var svgArrow = document.querySelector(".svg-arrow");
var svgPath = document.querySelector(".arrow-path");
var callToAction = document.querySelector(".call-to-action");
var mainContent = document.querySelector("main");

document.addEventListener('scroll', function () {
  
  const header = document.querySelector('header');
  
  if (window.scrollY > 0) {
    header.classList.add('is-scrolling');
  } else {
    header.classList.remove('is-scrolling');
  }
});

// HERO ANIMATION TEXT

document.addEventListener("DOMContentLoaded", function () {
    // Initialize grid list responsive
    initGridListResponsive();
    
    // Sélectionner tous les éléments avec la classe 'scroll-fade'
    var textWrappers = document.querySelectorAll('.scroll-fade');

    // Parcourir chaque élément
    textWrappers.forEach(function (textWrapper) {
        // Diviser le texte par <br> pour traiter chaque partie séparément
        var parts = textWrapper.innerHTML.split(/<br\s*\/?>/i);

        // Fonction pour envelopper chaque mot dans une <div> et chaque lettre dans un <span>
        function wrapWordsInDiv(text) {
            return text.split(' ').map(word => {
                var wrappedLetters = word.split('').map(letter => `<span>${letter}</span>`).join('');
                return `<div class="hero-word">${wrappedLetters}</div>`; // Enveloppe chaque mot dans une <div>
            }).join(' ');
        }

        // Ajouter des <div> autour de chaque mot et des <span> autour de chaque lettre pour les parties avant et après le <br>
        var wrappedBefore = wrapWordsInDiv(parts[0]);
        var wrappedAfter = parts[1] ? wrapWordsInDiv(parts[1]) : '';

        // Réassembler le HTML avec les <div> autour de chaque mot
        textWrapper.innerHTML = parts[1] ? `${wrappedBefore}<br>${wrappedAfter}` : wrappedBefore;

        // Anime chaque lettre à l'intérieur des mots
        anime.timeline({ loop: false })
            .add({
                targets: textWrapper.querySelectorAll('.hero-word span'),
                translateY: [50, 0], // Transition de bas en haut
                opacity: [0, 1],     // Fade-in progressif
                easing: "easeOutExpo",
                duration: 550,
                delay: (el, i) => 10 * i // Ajout d'un délai pour chaque lettre
            });
    });
});


// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Reusable animation function for scroll-triggered fade-in
function applyScrollFadeAnimation(selector, options = {}) {
    const defaultOptions = {
        opacity: { from: 0, to: 1 },
        y: { from: 20, to: 0 },
        duration: 1,
        ease: 'power2.out',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
        addVisibleClass: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    gsap.utils.toArray(selector).forEach((element) => {
        gsap.fromTo(element,
            { opacity: config.opacity.from, y: config.y.from },
            {
                opacity: config.opacity.to,
                y: config.y.to,
                duration: config.duration,
                ease: config.ease,
                scrollTrigger: {
                    trigger: element,
                    start: config.start,
                    toggleActions: config.toggleActions,
                    onEnter: () => {
                        if (config.addVisibleClass) element.classList.add('visible');
                    },
                    onLeave: () => {
                        if (config.addVisibleClass) element.classList.remove('visible');
                    },
                    onEnterBack: () => {
                        if (config.addVisibleClass) element.classList.add('visible');
                    },
                    onLeaveBack: () => {
                        if (config.addVisibleClass) element.classList.remove('visible');
                        if (config.fadeOutOnExit) {
                            gsap.to(element, { opacity: 1, y: 20, duration: 1, ease: 'power2.out' });
                        }
                    }
                }
            }
        );
    });
}

// Enhanced scroll reveal animation
function applyScrollRevealAnimation(selector, options = {}) {
    const defaultOptions = {
        opacity: { from: 0, to: 1 },
        y: { from: 24, to: 0 },
        blur: { from: 4, to: 0 },
        lineHeight: { from: 1.8, to: 1.4 },
        duration: 0.8,
        ease: 'power2.out',
        start: 'top 105%',
        toggleActions: 'play none none none', // Only play once, no reverse
        addVisibleClass: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    gsap.utils.toArray(selector).forEach((element) => {
        gsap.fromTo(element,
            { 
                opacity: config.opacity.from, 
                y: config.y.from,
                filter: `blur(${config.blur.from}px)`,
                lineHeight: config.lineHeight.from
            },
            {
                opacity: config.opacity.to,
                y: config.y.to,
                filter: `blur(${config.blur.to}px)`,
                lineHeight: config.lineHeight.to,
                duration: config.duration,
                ease: config.ease,
                scrollTrigger: {
                    trigger: element,
                    start: config.start,
                    toggleActions: config.toggleActions,
                    onEnter: () => {
                        if (config.addVisibleClass) element.classList.add('visible');
                    }
                }
            }
        );
    });
}

// Hero reveal animation with scale and enhanced effects
function applyHeroRevealAnimation(selector, options = {}) {
    const defaultOptions = {
        opacity: { from: 0, to: 1 },
        y: { from: 32, to: 0 },
        scale: { from: 0.98, to: 1 },
        blur: { from: 6, to: 0 },
        lineHeight: { from: 1.5, to: 1 },
        letterSpacing: { from: '0.02em', to: '0em' },
        duration: 1.2,
        ease: 'power2.out',
        start: 'top 105%',
        toggleActions: 'play none none none',
        addVisibleClass: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    gsap.utils.toArray(selector).forEach((element) => {
        gsap.fromTo(element,
            { 
                opacity: config.opacity.from, 
                y: config.y.from,
                scale: config.scale.from,
                filter: `blur(${config.blur.from}px)`,
                lineHeight: config.lineHeight.from,
                letterSpacing: config.letterSpacing.from
            },
            {
                opacity: config.opacity.to,
                y: config.y.to,
                scale: config.scale.to,
                filter: `blur(${config.blur.to}px)`,
                lineHeight: config.lineHeight.to,
                letterSpacing: config.letterSpacing.to,
                duration: config.duration,
                ease: config.ease,
                scrollTrigger: {
                    trigger: element,
                    start: config.start,
                    toggleActions: config.toggleActions,
                    onEnter: () => {
                        if (config.addVisibleClass) element.classList.add('visible');
                    }
                }
            }
        );
    });
}

// Hero stagger animation with 3D rotation
function applyHeroStaggerAnimation(selector, options = {}) {
    const defaultOptions = {
        opacity: { from: 0, to: 1 },
        y: { from: 16, to: 0 },
        rotateX: { from: 8, to: 0 },
        blur: { from: 3, to: 0 },
        lineHeight: { from: 1.4, to: 1.2 },
        duration: 0.8,
        ease: 'power2.out',
        start: 'top 105%',
        stagger: 0.08,
        toggleActions: 'play none none none',
        addVisibleClass: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    gsap.utils.toArray(selector).forEach((element) => {
        // Split text into words for stagger effect
        const words = element.textContent.split(' ');
        element.innerHTML = words.map(word => `<span class="hero-word">${word}</span>`).join(' ');
        
        const wordSpans = element.querySelectorAll('.hero-word');
        
        gsap.fromTo(wordSpans,
            { 
                opacity: config.opacity.from, 
                y: config.y.from,
                rotateX: config.rotateX.from,
                filter: `blur(${config.blur.from}px)`,
                lineHeight: config.lineHeight.from
            },
            {
                opacity: config.opacity.to,
                y: config.y.to,
                rotateX: config.rotateX.to,
                filter: `blur(${config.blur.to}px)`,
                lineHeight: config.lineHeight.to,
                duration: config.duration,
                ease: config.ease,
                stagger: config.stagger,
                scrollTrigger: {
                    trigger: element,
                    start: config.start,
                    toggleActions: config.toggleActions,
                    onEnter: () => {
                        if (config.addVisibleClass) element.classList.add('visible');
                    }
                }
            }
        );
    });
}

// Section metadata animation - subtle horizontal slide
function applySectionMetaAnimation(selector, options = {}) {
    const defaultOptions = {
        opacity: { from: 0, to: 1 },
        x: { from: -8, to: 0 },
        blur: { from: 1, to: 0 },
        letterSpacing: { from: '0.01em', to: '0.32px' },
        duration: 0.6,
        ease: 'power2.out',
        start: 'top 105%',
        stagger: 0.05,
        toggleActions: 'play none none none',
        addVisibleClass: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    gsap.utils.toArray(selector).forEach((element, index) => {
        gsap.fromTo(element,
            { 
                opacity: config.opacity.from, 
                x: config.x.from,
                filter: `blur(${config.blur.from}px)`,
                letterSpacing: config.letterSpacing.from
            },
            {
                opacity: config.opacity.to,
                x: config.x.to,
                filter: `blur(${config.blur.to}px)`,
                letterSpacing: config.letterSpacing.to,
                duration: config.duration,
                ease: config.ease,
                delay: index * config.stagger,
                scrollTrigger: {
                    trigger: element.closest('.section-header') || element,
                    start: config.start,
                    toggleActions: config.toggleActions,
                    onEnter: () => {
                        if (config.addVisibleClass) element.classList.add('visible');
                    }
                }
            }
        );
    });
}

// Apply animations using the reusable functions
applyScrollRevealAnimation('.scroll-reveal');
applyHeroRevealAnimation('.hero-reveal');
applyHeroStaggerAnimation('.hero-reveal-stagger');
applySectionMetaAnimation('.section-meta-reveal');
applyScrollFadeAnimation('.disap', { start: 'top 100%', toggleActions: 'play none none none' }); // Legacy support, no reverse
applyScrollFadeAnimation('.inline-list-content li:not(.scroll-reveal-container)');



// Initialisation de Lenis pour un défilement fluide
const lenis = new Lenis({
    smooth: true,
    lerp: 0.1, // Ajuste la fluidité (0.1 = très fluide, 0.5 = plus rapide)
  });
  
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  
  // Décomposition des mots dans chaque paragraphe
  document.querySelectorAll(".text-appear").forEach((el) => {
    const html = el.innerHTML;
  
    // Séparer les parties par <br> (on garde les balises <br> en les réinsérant après traitement)
    const parts = html.split(/<br\s*\/?>/i);
  
    const wrapped = parts.map(part => {
      return part
        .trim()
        .split(" ")
        .map(word => `<span class="word">${word}</span>`)
        .join(" ");
    });
  
    el.innerHTML = wrapped.join("<br>");
  });

  
  // Animation GSAP pour les mots
  gsap.registerPlugin(ScrollTrigger);
  
  document.querySelectorAll(".text-appear").forEach((el) => {
    const words = el.querySelectorAll(".word");
    gsap.from(words, {
      opacity: .1,
      y: 100, 
      stagger: 0.5, 
      duration: 1,
      ease: "power2.out",
      delay: 0.5, 
      scrollTrigger: {
        trigger: el, 
        start: "top 100%", 
        end: "top 40%", 
        scrub: true, 
      },
    });
  });

// HOVER DECODE EFFECT

const textElements = document.querySelectorAll(".coding");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%!@#";

// Gestion caractère aléatoire
function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

// Fonction de decoding 
function temporaryDecode(element, finalText) {
  let iterations = 0;

  const interval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((char, i) => (i < iterations ? finalText[i] : randomChar()))
      .join("");

    if (iterations >= finalText.length) clearInterval(interval);
    iterations += 1;
  }, 50);
}

// Effet au hover 
textElements.forEach((element) => {
  const finalText = element.innerText;

  element.addEventListener("mouseenter", () => temporaryDecode(element, finalText));
  element.addEventListener("mouseleave", () => {
    element.innerText = finalText; 
  });
});

// Fonction pour initialiser l'effet sur de nouveaux éléments (Web Components)
function initializeHoverEffect(container = document) {
  const newTextElements = container.querySelectorAll(".coding:not([data-hover-initialized])");
  
  newTextElements.forEach((element) => {
    const finalText = element.innerText;
    element.setAttribute('data-hover-initialized', 'true');

    element.addEventListener("mouseenter", () => temporaryDecode(element, finalText));
    element.addEventListener("mouseleave", () => {
      element.innerText = finalText; 
    });
  });
}

// Exposer la fonction globalement pour les Web Components
window.initializeHoverEffect = initializeHoverEffect;

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bgColor = entry.target.getAttribute("data-bg");
          header.style.backgroundColor = bgColor;
        }
      });
    },
    {
      threshold: 0.5, // La section est considérée visible si 50% est dans le viewport
    }
  );

  sections.forEach((section) => observer.observe(section));
});