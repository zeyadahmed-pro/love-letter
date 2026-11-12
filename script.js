const intro = document.getElementById("intro");
const page = document.getElementById("page");
const openButton = document.getElementById("open");
const shootingStage = document.getElementById("shooting-stage");
const bow = shootingStage.querySelector(".bow");
const bowCurve = shootingStage.querySelector(".bow-curve");
const bowString = shootingStage.querySelector(".bow-string");
const arrow = shootingStage.querySelector(".arrow");
const heartTarget = shootingStage.querySelector(".heart-target");
const song = document.getElementById("song");
const player = document.getElementById("player");
const playButton = document.getElementById("play");
const progress = document.getElementById("progress");
const note = document.getElementById("music-note");
const currentTime = document.getElementById("current-time");
const durationLabel = document.getElementById("duration");
const storyPlayButton = document.getElementById("story-play");
const storyMusicLabel = document.getElementById("story-music-label");
const storyMusicToggle = document.getElementById("story-music-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sparkleContainer = document.getElementById("sparkles");
const heartRain = document.getElementById("heart-rain");
let floatTimer;
const bowState = {
  x: 0,
  y: 0,
  xVelocity: 0,
  yVelocity: 0,
  tilt: 0,
  tiltVelocity: 0,
  draw: 0,
  drawTarget: 0,
  aimY: 0,
  gust: 0,
  gustTarget: 0,
  previousX: 0,
  previousY: 0,
  drawing: false,
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return minutes + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
}

function setPlaying(playing) {
  player.dataset.playing = String(playing);
  playButton.textContent = playing ? "❚❚" : "▶";
  playButton.setAttribute("aria-label", playing ? "Pause A Thousand Years" : "Play A Thousand Years");
  storyMusicLabel.textContent = song.muted
    ? playing ? "Your song is ready" : "Tap to start our song"
    : playing ? "Your song is playing" : "Play our song";
  storyMusicToggle.textContent = playing && !song.muted ? "Ⅱ" : "▶";
  storyPlayButton.setAttribute("aria-label", playing && !song.muted ? "Pause A Thousand Years" : "Play A Thousand Years");
}

function playSong() {
  note.textContent = "Starting your song… ♡";
  note.classList.remove("error");

  song.muted = false;
  const playback = song.play();
  if (playback) {
    playback.then(() => {
      if (!song.muted) {
        note.textContent = "Now playing, with all my love ♡";
        note.classList.remove("error");
        return;
      }
      note.textContent = "Your song is ready—tap Cupid's arrow to hear it ♡";
      note.classList.remove("error");
    }).catch((error) => {
      if (error.name === "NotAllowedError") {
        note.textContent = "Your browser blocked automatic sound. Tap the play button below to start the song ♡";
      } else {
        note.textContent = "The song could not start. Check that the MP3 is next to index.html, then tap play below.";
      }
      note.classList.add("error");
    });
  }
}

function toggleMusic() {
  if (song.paused || song.muted) {
    playSong();
    return;
  }

  song.pause();
  note.textContent = "Paused — your song will be right here when you are ♡";
}

function makeFloatingHeart() {
  if (reducedMotion || document.hidden || heartRain.childElementCount >= 16) return;

  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = ["♡", "♥", "💕", "💗", "✨"][Math.floor(Math.random() * 5)];
  heart.style.setProperty("--x", Math.random() * 100 + "vw");
  heart.style.setProperty("--size", 14 + Math.random() * 20 + "px");
  heart.style.setProperty("--duration", 9 + Math.random() * 6 + "s");
  heart.style.setProperty("--drift", Math.random() * 90 - 45 + "px");
  heart.style.setProperty("--color", ["#df7292", "#e7a1b3", "#cf77a1", "#e7a880"][Math.floor(Math.random() * 4)]);
  heartRain.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
}

function heartBurst(x, y, count = 11) {
  if (reducedMotion) return;

  const isHeartExplosion = count > 11;
  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.48;
    const distance = isHeartExplosion ? 48 + Math.random() * 130 : 42 + Math.random() * 65;
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance - (isHeartExplosion ? 18 : 0);
    const finalX = deltaX * (1.25 + Math.random() * 0.35);
    const finalY = deltaY + (isHeartExplosion ? 35 + Math.random() * 90 : 0);
    const turn = Math.random() * 150 - 75;
    heart.className = "burst-heart";
    heart.textContent = isHeartExplosion
      ? ["♥", "♥", "♡", "💕", "💗"][Math.floor(Math.random() * 5)]
      : ["♥", "♡", "✨"][Math.floor(Math.random() * 3)];
    heart.style.setProperty("--x", x + "px");
    heart.style.setProperty("--y", y + "px");
    heart.style.setProperty("--dx", deltaX + "px");
    heart.style.setProperty("--dy", deltaY + "px");
    heart.style.setProperty("--dx-start", deltaX * 0.28 + "px");
    heart.style.setProperty("--dy-start", deltaY * 0.28 + "px");
    heart.style.setProperty("--dx-end", finalX + "px");
    heart.style.setProperty("--dy-end", finalY + "px");
    heart.style.setProperty("--turn", turn + "deg");
    heart.style.setProperty("--turn-start", turn * 0.3 + "deg");
    heart.style.setProperty("--turn-end", turn * 1.8 + "deg");
    heart.style.setProperty("--size", (isHeartExplosion ? 8 + Math.random() * 13 : 13 + Math.random() * 12) + "px");
    heart.style.setProperty("--duration", (isHeartExplosion ? 1200 + Math.random() * 1000 : 900) + "ms");
    heart.style.setProperty("--delay", (isHeartExplosion ? Math.random() * 110 : 0) + "ms");
    heart.style.setProperty("--color", ["#dc6889", "#c85c7c", "#e5a078", "#f080a0", "#ce6688"][index % 5]);
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function updateAir(pointerEvent) {
  const bounds = shootingStage.getBoundingClientRect();
  const pointerX = pointerEvent.clientX - bounds.left;
  const pointerY = pointerEvent.clientY - bounds.top;
  const deltaX = pointerX - bowState.previousX;
  const deltaY = pointerY - bowState.previousY;
  const centerY = bounds.height / 2;

  bowState.gustTarget = clamp(-deltaX * 0.045 + deltaY * 0.018, -1.8, 1.8);
  bowState.aimY = clamp((pointerY - centerY) * 0.11, -13, 13);
  bowState.previousX = pointerX;
  bowState.previousY = pointerY;
  shootingStage.style.setProperty("--gust-x", clamp(deltaX * 0.32, -28, 28) + "px");
  shootingStage.style.setProperty("--gust-y", clamp(deltaY * 0.24, -16, 16) + "px");

  if (bowState.drawing) {
    const anchorX = bounds.width * 0.24;
    bowState.drawTarget = clamp(anchorX - pointerX, 0, Math.min(48, bounds.width * 0.13));
    shootingStage.classList.toggle("is-drawing", bowState.drawTarget > 2);
  }
}

function animateBow(time) {
  const wind = Math.sin(time * 0.0014) * 1.8 + Math.sin(time * 0.0027) * 1.05 + bowState.gust * 3.2;
  bowState.gust += (bowState.gustTarget - bowState.gust) * 0.035;
  bowState.gustTarget *= 0.994;
  bowState.draw += (bowState.drawTarget - bowState.draw) * 0.22;
  bowState.xVelocity += (wind - bowState.x) * 0.055 - bowState.xVelocity * 0.16;
  bowState.x += bowState.xVelocity;
  bowState.yVelocity += (bowState.aimY * 0.22 + Math.sin(time * 0.0019) * 1.4 - bowState.y) * 0.045 - bowState.yVelocity * 0.14;
  bowState.y += bowState.yVelocity;
  bowState.tiltVelocity += (bowState.aimY * 0.22 + wind * 0.34 - bowState.tilt) * 0.045 - bowState.tiltVelocity * 0.15;
  bowState.tilt += bowState.tiltVelocity;

  const bend = 12 + bowState.draw * 0.62 + wind * 0.34;
  bowCurve.setAttribute("d", `M75 8 C${bend} 26 ${bend} 124 75 142`);
  bowString.setAttribute("d", `M75 8 Q${75 - bowState.draw} 75 75 142`);
  bow.style.setProperty("--bow-x", bowState.x.toFixed(2) + "px");
  bow.style.setProperty("--bow-y", bowState.y.toFixed(2) + "px");
  bow.style.setProperty("--bow-tilt", (bowState.tilt * 0.16).toFixed(2) + "deg");
  arrow.style.setProperty("--arrow-pull", (-bowState.draw).toFixed(2) + "px");
  arrow.style.setProperty("--arrow-y", (bowState.aimY + wind * 0.6).toFixed(2) + "px");
  arrow.style.setProperty("--arrow-angle", (bowState.aimY * 0.065 + wind * 0.12).toFixed(2) + "deg");

  if (!intro.classList.contains("is-gone") && !reducedMotion) {
    window.requestAnimationFrame(animateBow);
  }
}

function fireCupidArrow() {
  if (intro.classList.contains("is-opening")) return;

  playSong();
  intro.classList.add("is-opening", "is-firing");
  openButton.disabled = true;
  shootingStage.classList.remove("is-drawing");
  bowState.drawing = false;
  bowState.drawTarget = 0;
  const drawPower = bowState.draw;
  bowState.xVelocity -= drawPower * 0.13;
  bowState.gustTarget += clamp(drawPower * 0.035, 0, 1.2);
  arrow.style.setProperty("--flight-time", 880 - drawPower * 3 + "ms");
  arrow.style.setProperty("--release-pull", -drawPower + "px");
  arrow.style.removeProperty("--arrow-pull");
  window.setTimeout(() => arrow.style.removeProperty("--release-pull"), 1000);
  const flightTime = reducedMotion ? 0 : 880 - drawPower * 3;
  if (reducedMotion) {
    intro.classList.add("is-hit");
    revealLetter();
    return;
  }

  window.setTimeout(() => {
    intro.classList.add("is-hit");
    const heartBounds = heartTarget.getBoundingClientRect();
    heartBurst(heartBounds.left + heartBounds.width / 2, heartBounds.top + heartBounds.height / 2, 42);
  }, flightTime * 0.82);
  window.setTimeout(revealLetter, flightTime + 1250);
}

shootingStage.addEventListener("pointerdown", (event) => {
  if (intro.classList.contains("is-opening")) return;
  event.preventDefault();
  bowState.drawing = true;
  shootingStage.setPointerCapture(event.pointerId);
  updateAir(event);
});

shootingStage.addEventListener("pointermove", (event) => {
  if (intro.classList.contains("is-opening")) return;
  updateAir(event);
});

shootingStage.addEventListener("pointerup", (event) => {
  if (!bowState.drawing || intro.classList.contains("is-opening")) return;
  updateAir(event);
  fireCupidArrow();
});

shootingStage.addEventListener("pointercancel", () => {
  bowState.drawing = false;
  bowState.drawTarget = 0;
  shootingStage.classList.remove("is-drawing");
});

shootingStage.addEventListener("pointerleave", () => {
  if (!bowState.drawing) {
    bowState.gustTarget = 0;
    bowState.aimY = 0;
  }
});

function revealLetter() {
  intro.classList.add("is-gone");
  page.classList.add("is-revealed");

  if (!reducedMotion) {
    floatTimer = window.setInterval(makeFloatingHeart, 1150);
    for (let index = 0; index < 8; index += 1) {
      window.setTimeout(makeFloatingHeart, index * 160);
    }
  }
}

function showStoryRoute() {
  const isStoryRoute = window.location.hash === "#our-story" || window.location.hash === "#our-moments";
  const wasStoryRoute = page.classList.contains("is-story");
  if (isStoryRoute === wasStoryRoute) return;

  page.classList.toggle("is-story", isStoryRoute);
  document.title = isStoryRoute ? "49 Days of Us — For Vicky" : "For Victoria, with love";
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

  if (isStoryRoute) revealStorySections();
}

function revealStorySections() {
  const sections = document.querySelectorAll(".story-reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  sections.forEach((section, index) => {
    section.style.setProperty("--reveal-delay", Math.min(index % 3, 2) * 90 + "ms");
    if (!section.classList.contains("is-visible")) observer.observe(section);
  });
}

openButton.addEventListener("click", fireCupidArrow);

playButton.addEventListener("click", toggleMusic);
storyPlayButton.addEventListener("click", toggleMusic);
window.addEventListener("hashchange", showStoryRoute);
window.addEventListener("popstate", showStoryRoute);
song.addEventListener("play", () => setPlaying(true));
song.addEventListener("pause", () => setPlaying(false));
song.addEventListener("playing", () => {
  note.textContent = song.muted
    ? "Your song is ready—tap Cupid's arrow to hear it ♡"
    : "Now playing, with all my love ♡";
  note.classList.remove("error");
});
song.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(song.duration);
});
song.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(song.currentTime);

  if (Number.isFinite(song.duration) && song.duration > 0) {
    const value = (song.currentTime / song.duration) * 100;
    progress.value = String(value);
    progress.style.setProperty("--progress", value + "%");
  }
});
song.addEventListener("error", () => {
  const mediaError = song.error;
  const detail = mediaError && mediaError.code === MediaError.MEDIA_ERR_DECODE
    ? "This browser could not decode the MP3."
    : "The MP3 could not be loaded.";
  note.textContent = detail + " Keep the song file next to index.html.";
  note.classList.add("error");
});
progress.addEventListener("input", () => {
  if (Number.isFinite(song.duration) && song.duration > 0) {
    song.currentTime = (Number(progress.value) / 100) * song.duration;
    progress.style.setProperty("--progress", progress.value + "%");
  }
});

document.getElementById("kiss").addEventListener("click", (event) => {
  heartBurst(event.clientX, event.clientY);
});

for (let index = 0; index < 20; index += 1) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = 4 + Math.random() * 92 + "%";
  sparkle.style.top = 4 + Math.random() * 92 + "%";
  sparkle.style.setProperty("--duration", 1.6 + Math.random() * 2.4 + "s");
  sparkle.style.setProperty("--delay", Math.random() * 2 + "s");
  sparkleContainer.appendChild(sparkle);
}

window.addEventListener("pagehide", () => {
  if (floatTimer) window.clearInterval(floatTimer);
});

song.muted = true;
const mutedAutoplay = song.play();
setPlaying(!song.paused);
if (mutedAutoplay) {
  mutedAutoplay.then(() => {
    if (song.muted) {
      note.textContent = "Your song is ready—tap Cupid's arrow to hear it ♡";
      setPlaying(true);
    }
  }).catch(() => {
    if (song.paused) {
      note.textContent = "Tap Cupid's arrow to start your song ♡";
      setPlaying(false);
    }
  });
}

showStoryRoute();
if (!reducedMotion) window.requestAnimationFrame(animateBow);
