/**
 * MUTHUSANKAR A K — PORTFOLIO INTERACTIVE CORE
 * Quantum Simulation, STM32 Bootloader Emulator, Audio DSP & Canvas Particles
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize all interactive modules
  initCosmicCanvas();
  initCursorGlow();
  initRocketCompanion();
  initTypewriter();
  initCounters();
  initBB84Simulator();
  initSTM32Bootloader();
  initAudioVisualizer();
  initCopyButtons();
  initContactForm();
  initMobileMenu();
  initScrollSpy();

  // Set current year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. COSMIC & QUANTUM CANVAS PARTICLE SYSTEM
   ========================================================================== */
function initCosmicCanvas() {
  const canvas = document.getElementById('cosmic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const PARTICLE_COUNT = Math.min(Math.floor(width / 18), 85);
  const CONNECTION_DIST = 115;
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 0.8;
      this.baseAlpha = Math.random() * 0.45 + 0.2;
      this.isCyan = Math.random() > 0.45;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.7;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isCyan
        ? `rgba(0, 245, 212, ${this.baseAlpha})`
        : `rgba(99, 102, 241, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect close particles with quantum entanglement lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.22;
          ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. CURSOR GLOW TRACKER
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX - 192}px, ${currentY - 192}px, 0)`;
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2.1 INTERACTIVE MINI ROCKET COMPANION & CIRCLING ORBIT
   ========================================================================== */
function initRocketCompanion() {
  const rocket = document.getElementById('rocket-companion');
  const trailCanvas = document.getElementById('rocket-trail-canvas');
  if (!rocket || !trailCanvas) return;

  const ctx = trailCanvas.getContext('2d');
  let width = (trailCanvas.width = window.innerWidth);
  let height = (trailCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = trailCanvas.width = window.innerWidth;
    height = trailCanvas.height = window.innerHeight;
  });

  // Rocket position and motion variables
  let x = width / 2;
  let y = height / 2;
  let prevX = x;
  let prevY = y;
  let targetX = x;
  let targetY = y;
  let currentAngle = 0; // Radians, 0 is up

  let isIdle = false;
  let lastMouseMoveTime = Date.now();
  const IDLE_THRESHOLD = 1400; // 1.4s without cursor movement triggers circling
  let orbitAngle = 0;

  // Stardust & ion exhaust particles
  const particles = [];

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    lastMouseMoveTime = Date.now();
    if (isIdle) {
      isIdle = false;
    }
  });

  // Trigger circling early when mouse exits viewport
  window.addEventListener('mouseleave', () => {
    lastMouseMoveTime = 0;
  });

  // Interactive rocket booster burst on user click
  window.addEventListener('mousedown', () => {
    for (let i = 0; i < 16; i++) {
      particles.push(createParticle(x, y, true));
    }
  });

  function createParticle(originX, originY, isBoost = false) {
    // Particles shoot backwards relative to rocket heading
    const angle = currentAngle + Math.PI / 2 + (Math.random() - 0.5) * (isBoost ? 1.6 : 0.7);
    const speed = (Math.random() * 2.6 + 1.2) * (isBoost ? 2.4 : 1.0);
    const palette = ['#00f5d4', '#6366f1', '#8b5cf6', '#ffb703', '#38bdf8'];
    const color = palette[Math.floor(Math.random() * palette.length)];

    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.7,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.7,
      radius: Math.random() * (isBoost ? 3.6 : 2.2) + 0.9,
      alpha: 1.0,
      decay: Math.random() * 0.026 + 0.016,
      color: color
    };
  }

  function loop() {
    const now = Date.now();
    const idleDuration = now - lastMouseMoveTime;

    if (idleDuration > IDLE_THRESHOLD) {
      isIdle = true;
      // CIRCLING MODE:
      // The rocket embarks on an expansive orbital lap circling around the website viewport
      const cx = width / 2;
      const cy = height / 2;
      // Orbital radius spanning across the viewport
      const rx = Math.max(Math.min(width * 0.44, width / 2 - 40), 180);
      const ry = Math.max(Math.min(height * 0.40, height / 2 - 40), 140);

      orbitAngle += 0.018; // Smooth cruising orbit speed
      // Elliptical orbit with gentle 3D wave oscillation
      targetX = cx + Math.cos(orbitAngle) * rx;
      targetY = cy + Math.sin(orbitAngle) * ry + Math.sin(orbitAngle * 2.2) * 45;
    }

    // Rocket physics towards target
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy);

    // Dynamic smoothing: accelerates when far, glides gracefully when close
    const lerpRate = isIdle ? 0.055 : (dist > 320 ? 0.11 : (dist > 100 ? 0.08 : 0.062));
    x += dx * lerpRate;
    y += dy * lerpRate;

    // Movement delta to determine heading direction
    const moveDx = x - prevX;
    const moveDy = y - prevY;
    const moveSpeed = Math.hypot(moveDx, moveDy);

    if (moveSpeed > 0.4) {
      // Calculate target angle (atan2 + PI/2 aligns nose pointing in direction of velocity)
      const targetAngle = Math.atan2(moveDy, moveDx) + Math.PI / 2;
      let diff = targetAngle - currentAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentAngle += diff * 0.16;
    } else if (!isIdle) {
      // Gentle atmospheric hover oscillation when stationary
      currentAngle += Math.sin(now * 0.003) * 0.015;
    }

    // Render rocket position & rotation
    const deg = (currentAngle * 180) / Math.PI;
    rocket.style.transform = `translate3d(${x - 22}px, ${y - 22}px, 0) rotate(${deg}deg)`;

    // Emit exhaust particles from rocket nozzle
    if (moveSpeed > 0.4 || isIdle) {
      // Nozzle is 18px behind the center along heading
      const nozzleX = x - Math.sin(currentAngle) * -18;
      const nozzleY = y + Math.cos(currentAngle) * -18;

      const spawnCount = isIdle ? 1 : (moveSpeed > 3.5 ? 3 : 2);
      for (let i = 0; i < spawnCount; i++) {
        particles.push(createParticle(nozzleX, nozzleY));
      }
    }

    prevX = x;
    prevY = y;

    // Draw and update particle trail on canvas
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.radius *= 0.965;

      if (p.alpha <= 0 || p.radius <= 0.25) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(p.radius, 0.4), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ==========================================================================
   3. KINETIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const roles = [
    'Quantum Communication Enthusiast',
    'Aerospace & CubeSat Tech Pioneer',
    'Embedded Security & Bootloader Dev',
    'President @ ASTRO Club CEG Guindy',
    'Sound Fidelity & DSP Algorithmist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      textEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      textEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. NUMBER COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let started = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach((counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isFloat = target % 1 !== 0;
            const duration = 1600;
            const steps = 40;
            const stepTime = duration / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += target / steps;
              if (current >= target) {
                counter.textContent = isFloat ? target.toFixed(2) : Math.round(target);
                clearInterval(timer);
              } else {
                counter.textContent = isFloat ? current.toFixed(2) : Math.round(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);
}

/* ==========================================================================
   5. INTERACTIVE BB84 QUANTUM KEY DISTRIBUTION SIMULATOR
   ========================================================================== */
function initBB84Simulator() {
  let aliceBit = 1;
  let aliceBase = '+'; // '+' (rectilinear) or 'x' (diagonal)
  let bobBase = '+';

  const bitToggle = document.getElementById('qkd-bit-toggle');
  const aliceBitVal = document.getElementById('alice-bit-val');
  const aliceBaseToggle = document.getElementById('qkd-alice-base-toggle');
  const aliceBaseVal = document.getElementById('alice-base-val');
  const aliceDisplay = document.getElementById('alice-state-display');

  const bobBaseToggle = document.getElementById('qkd-bob-base-toggle');
  const bobBaseVal = document.getElementById('bob-base-val');
  const bobDisplay = document.getElementById('bob-state-display');

  const eveToggle = document.getElementById('eve-toggle');
  const eveNode = document.getElementById('eve-node');
  const sendBtn = document.getElementById('send-photon-btn');
  const photon = document.getElementById('flying-photon');
  const logBox = document.getElementById('qkd-log');
  const track = document.getElementById('quantum-track');

  if (!sendBtn || !logBox) return;

  // Toggle Alice's Bit
  bitToggle?.addEventListener('click', () => {
    aliceBit = aliceBit === 1 ? 0 : 1;
    aliceBitVal.textContent = aliceBit;
    updateAliceDisplay();
  });

  // Toggle Alice's Basis
  aliceBaseToggle?.addEventListener('click', () => {
    aliceBase = aliceBase === '+' ? 'x' : '+';
    aliceBaseVal.textContent = aliceBase;
    updateAliceDisplay();
  });

  // Toggle Bob's Basis
  bobBaseToggle?.addEventListener('click', () => {
    bobBase = bobBase === '+' ? 'x' : '+';
    bobBaseVal.textContent = bobBase;
    bobDisplay.textContent = `Base: ${bobBase}`;
  });

  function updateAliceDisplay() {
    aliceDisplay.textContent = `Bit: ${aliceBit} | Base: ${aliceBase}`;
  }

  // Eve toggle visual state
  eveToggle?.addEventListener('change', () => {
    if (eveToggle.checked) {
      eveNode.classList.remove('opacity-30');
      eveNode.classList.add('opacity-100');
      appendLog('[EVE ALERT] Eavesdropper node active on quantum line!', 'text-rose-400');
    } else {
      eveNode.classList.add('opacity-30');
      eveNode.classList.remove('opacity-100');
      appendLog('[CHANNEL] Quantum link secured (Direct relay).', 'text-slate-400');
    }
  });

  function appendLog(msg, colorClass = 'text-slate-300') {
    const p = document.createElement('div');
    p.className = colorClass;
    p.innerHTML = msg;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
  }

  let isSending = false;

  sendBtn.addEventListener('click', () => {
    if (isSending) return;
    isSending = true;
    sendBtn.disabled = true;

    const hasEve = eveToggle ? eveToggle.checked : false;

    // Quantum Polarization Mapping
    let stateLabel = '';
    if (aliceBase === '+') {
      stateLabel = aliceBit === 0 ? '|H⟩ (Horizontal 0°)' : '|V⟩ (Vertical 90°)';
    } else {
      stateLabel = aliceBit === 0 ? '|↗⟩ (Diagonal +45°)' : '|↘⟩ (Diagonal -45°)';
    }

    appendLog(`----------------------------------------`, 'text-slate-600');
    appendLog(`[ALICE] Encoding Bit=${aliceBit} with '${aliceBase}' Basis -> Photon State: <strong>${stateLabel}</strong>`, 'text-quantum-cyan');

    // Photon travel animation
    const trackWidth = track.clientWidth;
    photon.style.opacity = '1';
    photon.style.left = '40px';

    setTimeout(() => {
      // Step at Relay / Eve
      photon.style.left = `${trackWidth * 0.48}px`;

      setTimeout(() => {
        let bitMeasuredByEve = aliceBit;
        let eveDetected = false;

        if (hasEve) {
          const eveBase = Math.random() > 0.5 ? '+' : 'x';
          appendLog(`[EVE INTERCEPT] Eve intercepts with '${eveBase}' Basis!`, 'text-rose-400');
          if (eveBase !== aliceBase) {
            // Heisenberg collapse! Eve randomly projects photon
            bitMeasuredByEve = Math.random() > 0.5 ? 1 : 0;
            eveDetected = true;
            appendLog(`[QUANTUM COLLAPSE] Eve measured in mismatched basis! State disturbed.`, 'text-amber-400');
          }
        }

        // Move to Bob
        photon.style.left = `${trackWidth - 60}px`;

        setTimeout(() => {
          // Bob measurement
          let bobMeasuredBit;
          if (bobBase === aliceBase) {
            bobMeasuredBit = hasEve && eveDetected ? (Math.random() > 0.5 ? 1 : 0) : aliceBit;
          } else {
            // Mismatched base between Alice & Bob produces random 50/50
            bobMeasuredBit = Math.random() > 0.5 ? 1 : 0;
          }

          appendLog(`[BOB] Received photon. Measured with '${bobBase}' Basis -> Detected Bit: <strong>${bobMeasuredBit}</strong>`, 'text-quantum-violet');

          // Sifting Phase
          if (bobBase === aliceBase) {
            if (hasEve && bobMeasuredBit !== aliceBit) {
              appendLog(`[SIFTING] Bases MATCH (${aliceBase}) BUT Bit error detected! (Alice:${aliceBit} ≠ Bob:${bobMeasuredBit})`, 'text-rose-400');
              appendLog(`🚨 [SECURITY ABORT] Eavesdropper Detected! Key bit discarded. Quantum Channel Safe!`, 'text-rose-400 font-bold');
            } else if (hasEve && bobMeasuredBit === aliceBit) {
              appendLog(`[SIFTING] Bases MATCH (${aliceBase}). Key candidate verified (parity check pending).`, 'text-amber-300');
            } else {
              appendLog(`✅ [SUCCESS] Bases MATCH (${aliceBase})! Shared Secret Key Bit Distilled: <strong>${aliceBit}</strong>`, 'text-emerald-400 font-bold');
            }
          } else {
            appendLog(`[SIFTING] Bases MISMATCH (Alice:'${aliceBase}' vs Bob:'${bobBase}'). Bit discarded per BB84 protocol.`, 'text-slate-400');
          }

          photon.style.opacity = '0';
          isSending = false;
          sendBtn.disabled = false;
        }, 350);
      }, 350);
    }, 50);
  });
}

/* ==========================================================================
   6. INTERACTIVE STM32 SECURE BOOTLOADER SIMULATOR
   ========================================================================== */
function initSTM32Bootloader() {
  const terminal = document.getElementById('stm32-terminal');
  const btnValid = document.getElementById('btn-flash-valid');
  const btnTampered = document.getElementById('btn-flash-tampered');
  const btnReset = document.getElementById('btn-reset-mcu');

  const appSlotLabel = document.getElementById('app-slot-label');
  const appSlotStatus = document.getElementById('app-slot-status');
  const stagingSlotStatus = document.getElementById('staging-slot-status');

  if (!terminal || !btnValid) return;

  function termLog(msg, colorClass = 'text-emerald-400') {
    const div = document.createElement('div');
    div.className = colorClass;
    div.innerHTML = msg;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
  }

  btnValid?.addEventListener('click', () => {
    termLog('------------------------------------------------', 'text-slate-600');
    termLog('[OTA] Inbound firmware packet stream: app_v2.1.0_signed.bin (128 KB)', 'text-quantum-cyan');
    stagingSlotStatus.textContent = 'Flashing: v2.1.0';
    stagingSlotStatus.className = 'text-[9px] text-quantum-cyan animate-pulse';

    setTimeout(() => {
      termLog('[CRYPTO] SHA-256 Hash calculated: <span class="text-white">c3ab8ff13720e8ad9047dd39466b3c89...</span>', 'text-slate-300');
      setTimeout(() => {
        termLog('[SECURITY] Validating ECDSA P-256 digital signature against Root CA...', 'text-slate-300');
        setTimeout(() => {
          termLog('✅ [AUTHENTICATION PASS] Signature verified. Integrity 100% OK.', 'text-emerald-400 font-bold');
          termLog('[AES-256] Decrypting application payload into staging slot (0x08040000)... OK', 'text-quantum-indigo');
          setTimeout(() => {
            termLog('[BOOTLOADER] Copying staging slot to active app slot (0x08008000)... Done', 'text-slate-200');
            termLog('[SYS] Remapping Vector Table: VTOR set to 0x08008000', 'text-emerald-400');
            termLog('🚀 [BOOT JUMP] Transferring execution control to Application Main Loop!', 'text-emerald-400 font-bold');
            
            appSlotLabel.textContent = 'Active App Slot (v2.1.0)';
            appSlotStatus.textContent = 'Running: Authenticated';
            appSlotStatus.className = 'text-[9px] text-emerald-400 font-bold';
            stagingSlotStatus.textContent = 'Verified & Flashed';
            stagingSlotStatus.className = 'text-[9px] text-slate-500';
          }, 450);
        }, 400);
      }, 400);
    }, 350);
  });

  btnTampered?.addEventListener('click', () => {
    termLog('------------------------------------------------', 'text-slate-600');
    termLog('[OTA] Inbound firmware packet stream: payload_unverified.bin', 'text-amber-400');
    stagingSlotStatus.textContent = 'Testing Payload...';
    stagingSlotStatus.className = 'text-[9px] text-rose-400 animate-pulse';

    setTimeout(() => {
      termLog('[CRYPTO] SHA-256 Hash calculated: <span class="text-rose-400">77fa289c... (Unknown)</span>', 'text-slate-300');
      setTimeout(() => {
        termLog('[SECURITY] Verifying ECDSA digital signature...', 'text-slate-300');
        setTimeout(() => {
          termLog('❌ [SECURITY FAILURE] Invalid cryptographic signature! Hash mismatch.', 'text-rose-500 font-bold');
          termLog('🛑 [DEFENSE REACTION] Unauthorized firmware rejected! Memory slot wiped.', 'text-rose-400 font-bold');
          termLog('[RECOVERY] Restoring stable golden image v2.0.4. Boot refused to bad payload.', 'text-slate-300');
          
          stagingSlotStatus.textContent = 'Rejected / Erased';
          stagingSlotStatus.className = 'text-[9px] text-rose-500 font-bold';
        }, 450);
      }, 400);
    }, 350);
  });

  btnReset?.addEventListener('click', () => {
    terminal.innerHTML = `
      <div class="text-slate-500">// STM32F446RE USART2 Console (115200 8N1)</div>
      <div>[SYSTEM] Power-on reset detected. Vector table loaded at 0x08000000</div>
      <div>[BOOT] Initializing cryptographic hardware engines... OK</div>
      <div>[BOOT] Ready for OTA update payload or application jump.</div>
    `;
    appSlotLabel.textContent = 'Active App Slot';
    appSlotStatus.textContent = 'Running: v2.0.4';
    appSlotStatus.className = 'text-[9px] text-quantum-indigo';
    stagingSlotStatus.textContent = 'Empty';
    stagingSlotStatus.className = 'text-[9px] text-slate-500';
  });
}

/* ==========================================================================
   7. INTERACTIVE SOFI AUDIO WAVEFORM & HUFFMAN COMPRESSION
   ========================================================================== */
function initAudioVisualizer() {
  const canvas = document.getElementById('audio-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  window.addEventListener('resize', () => {
    if (canvas.parentElement) {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
  });

  const freqSlider = document.getElementById('freq-slider');
  const freqVal = document.getElementById('freq-val');
  const ampSlider = document.getElementById('amp-slider');
  const ampVal = document.getElementById('amp-val');
  const btnCompress = document.getElementById('btn-compress-audio');
  const huffmanStat = document.getElementById('huffman-stat');

  let frequency = 440;
  let amplitude = 75;
  let phase = 0;

  freqSlider?.addEventListener('input', (e) => {
    frequency = parseInt(e.target.value);
    if (freqVal) freqVal.textContent = `${frequency} Hz`;
  });

  ampSlider?.addEventListener('input', (e) => {
    amplitude = parseInt(e.target.value);
    if (ampVal) ampVal.textContent = `${amplitude}%`;
  });

  btnCompress?.addEventListener('click', () => {
    const entropy = (Math.log2(frequency) * 0.72).toFixed(2);
    const avgBits = (parseFloat(entropy) * 0.95).toFixed(2);
    const ratio = (100 - (avgBits / 16) * 100).toFixed(1);

    if (huffmanStat) {
      huffmanStat.innerHTML = `
        <span class="text-white font-bold">100% Lossless Decoding!</span> | 
        Shannon Entropy: <span class="text-quantum-cyan">${entropy} bits</span> | 
        Huffman Code: <span class="text-quantum-violet">${avgBits} b/s</span> | 
        <span class="text-emerald-400 font-bold">Bit-Error Rate = 0.0000</span>
      `;
    }
  });

  function drawWaveform() {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Oscilloscope wave
    ctx.beginPath();
    ctx.lineWidth = 2.5;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#00f5d4');
    gradient.addColorStop(0.5, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.strokeStyle = gradient;

    const normalizedAmp = (height / 2) * (amplitude / 100) * 0.8;
    const cycles = (frequency / 100) * 1.5;

    for (let x = 0; x < width; x++) {
      const t = (x / width) * Math.PI * 2 * cycles + phase;
      // Primary sine + secondary harmonic overtone
      const y = height / 2 + Math.sin(t) * normalizedAmp + Math.sin(t * 2.5) * (normalizedAmp * 0.2);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    phase += 0.045;
    requestAnimationFrame(drawWaveform);
  }

  drawWaveform();
}

/* ==========================================================================
   8. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  let toastTimeout;

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied ${textToCopy} to clipboard!`);
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = textToCopy;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Copied ${textToCopy}!`);
      });
    });
  });

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2800);
  }
}

/* ==========================================================================
   9. INTERACTIVE CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name')?.value || '';
    const email = document.getElementById('sender-email')?.value || '';
    const subject = document.getElementById('sender-subject')?.value || 'Collaboration Inquiry';
    const message = document.getElementById('sender-message')?.value || '';

    const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    const mailtoLink = `mailto:muthusankar77777@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    window.location.href = mailtoLink;
  });
}

/* ==========================================================================
   10. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   11. SCROLL SPY ACTIVE NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
