document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    }));
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // Corazones suaves de fondo, sin interferir con los botones.
  const makeHeart = (x, y, small = false) => {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = Math.random() > 0.45 ? "♥" : "♡";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${small ? 12 + Math.random() * 9 : 16 + Math.random() * 15}px`;
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1900);
  };
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let lastHeart = 0;
    document.addEventListener("pointerdown", event => {
      const now = Date.now();
      if (now - lastHeart < 130) return;
      lastHeart = now;
      makeHeart(event.clientX, event.clientY, true);
    });
  }

  // Galería: abrir la imagen en grande y cerrar con Escape o clic fuera.
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const closeButton = lightbox.querySelector(".lightbox-close");
    document.querySelectorAll("[data-lightbox]").forEach(image => {
      image.addEventListener("click", event => {
        event.stopPropagation();
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "Recuerdo ampliado";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.src = "";
      document.body.style.overflow = "";
    };
    closeButton?.addEventListener("click", close);
    lightbox.addEventListener("click", event => { if (event.target === lightbox) close(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
  }

  // Solo un vídeo reproduce audio a la vez.
  document.querySelectorAll("video").forEach(video => {
    video.addEventListener("play", () => {
      document.querySelectorAll("video").forEach(other => { if (other !== video) other.pause(); });
    });
  });

  const revealButton = document.querySelector("#reveal-letter");
  const hiddenLetter = document.querySelector("#hidden-letter");
  if (revealButton && hiddenLetter) {
    revealButton.addEventListener("click", () => {
      const willShow = hiddenLetter.hidden;
      hiddenLetter.hidden = !willShow;
      revealButton.innerHTML = willShow ? "Volver a guardar la carta <span>♡</span>" : "Hay algo más que quiero decirte <span>♡</span>";
      if (willShow) hiddenLetter.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  const surpriseButton = document.querySelector("#surprise-button");
  const surpriseMessage = document.querySelector("#surprise-message");
  const moreHearts = document.querySelector("#more-hearts");
  const heartBurst = (count = 24) => {
    for (let i = 0; i < count; i++) {
      window.setTimeout(() => {
        makeHeart(Math.random() * window.innerWidth, window.innerHeight * (0.35 + Math.random() * 0.55));
      }, i * 35);
    }
  };
  if (surpriseButton && surpriseMessage) {
    surpriseButton.addEventListener("click", () => {
      surpriseMessage.hidden = false;
      surpriseButton.hidden = true;
      heartBurst(30);
    });
  }
  moreHearts?.addEventListener("click", () => heartBurst(35));
});