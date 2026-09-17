(() => {
  const accessGate = document.querySelector('#accessGate');
  const accessForm = document.querySelector('#accessForm');
  const codeInputs = [...document.querySelectorAll('.code-input')];
  const codeInputGroup = document.querySelector('#codeInputs');
  const accessFeedback = document.querySelector('#accessFeedback');
  const accessGateBoot = document.querySelector('#accessGateBoot');
  const accessCode = '0101';

  function revealPage() {
    if (accessGateBoot) accessGateBoot.remove();
  }

  function resetCode() {
    codeInputs.forEach((input) => { input.value = ''; });
    codeInputs[0].focus();
  }

  function checkCode() {
    const enteredCode = codeInputs.map((input) => input.value).join('');
    if (enteredCode.length !== 4) return;
    if (enteredCode === accessCode) {
      accessGate.classList.add('success');
      setTimeout(() => accessGate.classList.add('is-leaving'), 300);
      setTimeout(revealPage, 950);
      return;
    }
    accessFeedback.textContent = 'Not quite, try again ♡';
    accessFeedback.classList.add('visible');
    codeInputGroup.classList.remove('shake');
    void codeInputGroup.offsetWidth;
    codeInputGroup.classList.add('shake');
    setTimeout(() => {
      accessFeedback.classList.remove('visible');
      resetCode();
    }, 800);
  }

  codeInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '').slice(-1);
      if (input.value && index < codeInputs.length - 1) codeInputs[index + 1].focus();
      checkCode();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && !input.value && index > 0) codeInputs[index - 1].focus();
    });
    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 4);
      pasted.split('').forEach((digit, digitIndex) => {
        if (codeInputs[index + digitIndex]) codeInputs[index + digitIndex].value = digit;
      });
      codeInputs[Math.min(index + pasted.length, codeInputs.length - 1)].focus();
      checkCode();
    });
  });
  accessForm.addEventListener('submit', (event) => { event.preventDefault(); checkCode(); });
  revealPage();
  codeInputs[0].focus();

  const gift = window.GIFT || {};
  const q = (sel) => document.querySelector(sel);
  const openButton = q('#openEnvelope');
  const letterSection = q('#letterSection');
  const revealButton = q('#revealButton');
  const secretMessage = q('#secretMessage');
  const particles = q('#particles');
  const audio = q('#audio');
  const playButton = q('#playButton');
  const playIcon = q('#playIcon');
  const musicCard = q('#musicCard');
  const soundWaves = q('#soundWaves');
  const toast = q('#toast');

  // Personal content
  q('#toLine').textContent = `to ${gift.girlfriendName || 'my favorite person'},`;
  q('#signatureName').textContent = `${gift.yourName || 'me'} ♡`;
  q('.wax-seal').textContent = (gift.yourName || 'Y').charAt(0).toUpperCase();
  q('#secretText').textContent = gift.secretMessage || 'I love you ♡';
  q('#photoCaption').textContent = gift.photoCaption || '';
  q('#songTitle').textContent = gift.songTitle || 'our song ♡';

  const body = q('#letterBody');
  (gift.letterParagraphs || []).forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    body.appendChild(p);
  });

  const image = q('#memoryPhoto');
  const placeholder = q('#photoPlaceholder');
  if (gift.photo) {
    image.src = gift.photo;
    image.addEventListener('load', () => {
      image.style.display = 'block';
      placeholder.style.display = 'none';
    });
    image.addEventListener('error', () => {
      image.removeAttribute('src');
    });
  }

  if (gift.song) {
    audio.src = gift.song;
    audio.addEventListener('error', () => {
      musicCard.classList.add('unavailable');
      q('#songTitle').textContent = 'add our-song.mp3';
    });
  } else {
    musicCard.classList.add('unavailable');
  }

  function setPlayingState(isPlaying) {
    musicCard.classList.toggle('is-playing', isPlaying);
    playButton.setAttribute('aria-label', isPlaying ? 'Pause our song' : 'Play our song');
    soundWaves.setAttribute('aria-label', isPlaying ? 'Song is playing' : 'Song is paused');
  }

  async function startSong() {
    if (!audio.src) return;
    try {
      await audio.play();
      setPlayingState(true);
    } catch (_) {
      setPlayingState(false);
      showToast('Add assets/our-song.mp3 first');
    }
  }

  function burst(count = 22, x = innerWidth / 2, y = innerHeight / 2) {
    const chars = ['♡', '♥', '✦', '·'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'particle';
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 75 + Math.random() * 160;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 65;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${10 + Math.random() * 14}px`;
      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--dy', `${dy}px`);
      el.style.setProperty('--rot', `${-80 + Math.random() * 160}deg`);
      el.style.animationDelay = `${Math.random() * .14}s`;
      particles.appendChild(el);
      setTimeout(() => el.remove(), 2200);
    }
  }

  openButton.addEventListener('click', () => {
    if (openButton.classList.contains('opening')) return;
    openButton.classList.add('opening');
    const rect = openButton.getBoundingClientRect();
    burst(32, rect.left + rect.width / 2, rect.top + rect.height / 2);

    if (navigator.vibrate) navigator.vibrate(18);
    // Start during the user's tap so mobile browsers permit playback.
    startSong();

    setTimeout(() => {
      letterSection.classList.add('visible');
      letterSection.setAttribute('aria-hidden', 'false');
      setTimeout(() => letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 830);
  });

  revealButton.addEventListener('click', () => {
    if (secretMessage.classList.contains('visible')) return;
    secretMessage.classList.add('visible');
    secretMessage.setAttribute('aria-hidden', 'false');
    revealButton.textContent = 'okay... you can keep this one ♡';
    const rect = revealButton.getBoundingClientRect();
    burst(16, rect.left + rect.width / 2, rect.top + rect.height / 2);
    if (navigator.vibrate) navigator.vibrate([15, 35, 15]);
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  playButton.addEventListener('click', async () => {
    if (!audio.src) return;
    try {
      if (audio.paused) {
        await audio.play();
        playIcon.textContent = '❚❚';
      } else {
        audio.pause();
        playIcon.textContent = '▶';
      }
    } catch (_) {
      showToast('Add assets/our-song.mp3 first ♡');
    }
  });
  audio.addEventListener('ended', () => { playIcon.textContent = '▶'; });

  audio.addEventListener('play', () => setPlayingState(true));
  audio.addEventListener('pause', () => setPlayingState(false));
  audio.addEventListener('error', () => setPlayingState(false));

  q('#backTop').addEventListener('click', () => {
    q('#hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
