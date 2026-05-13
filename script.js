

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('active'); revealObs.unobserve(e.target); }
    });
}, { root: document.querySelector('.snap-container'), threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ===== ENHANCED CAKE BLOWOUT =====
const cakeContainer = document.getElementById('cake-container');
const wishMessage = document.getElementById('wish-message');
let blown = false;

// Mouse trail sparkles on cake hover
cakeContainer.addEventListener('mousemove', (e) => {
    const rect = cakeContainer.getBoundingClientRect();
    createCakeSpark(e.clientX - rect.left, e.clientY - rect.top, cakeContainer);
});

function createCakeSpark(x, y, parent) {
    const spark = document.createElement('div');
    spark.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:6px;height:6px;
        background:radial-gradient(circle,#ffe066,transparent);border-radius:50%;
        pointer-events:none;z-index:10;animation:sparkFly 0.6s ease forwards;`;
    parent.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
}
const sparkFlyStyle = document.createElement('style');
sparkFlyStyle.textContent = `@keyframes sparkFly{0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(${Math.random()*40-20}px,${Math.random()*40-20}px) scale(0);}}`;
document.head.appendChild(sparkFlyStyle);

cakeContainer.addEventListener('click', () => {
    if (blown) return;
    blown = true;

    // 1. Candle wobble
    const candles = document.querySelectorAll('.fancy-candle');
    candles.forEach((c, i) => {
        c.style.transition = 'transform 0.1s ease';
        setTimeout(() => { c.style.transform = 'rotate(20deg)'; }, i * 60);
        setTimeout(() => { c.style.transform = 'rotate(-10deg)'; }, i * 60 + 150);
        setTimeout(() => { c.style.transform = 'rotate(0)'; }, i * 60 + 280);
    });

    // 2. Flames vanish
    setTimeout(() => {
        const flames = document.querySelectorAll('.flame-wrap');
        flames.forEach((f, i) => {
            setTimeout(() => {
                f.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
                f.style.transform = 'scaleY(0.3) scaleX(1.5)';
                f.style.opacity = '0';
            }, i * 80);
        });
    }, 400);

    // 3. Smoke + confetti
    setTimeout(() => {
        document.getElementById('panda-cake').classList.add('candles-out');
        cakeContainer.classList.add('smoking');
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ['#1a1a1a','#3a3a3a','#fff','#aaa','#6b8f5e'] });
            setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.55 }, colors: ['#1a1a1a','#fff','#6b8f5e'] }), 300);
            setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.55 }, colors: ['#1a1a1a','#fff','#6b8f5e'] }), 400);
        }
    }, 600);

    // 4. Show wish
    setTimeout(() => {
        wishMessage.classList.remove('hidden');
        setTimeout(() => wishMessage.classList.add('active'), 80);
        const hint = document.querySelector('.click-hint');
        if (hint) hint.style.display = 'none';
    }, 1200);
});

// ===== LETTER REVEAL =====
const surpriseBtn     = document.getElementById('surprise-btn');
const surpriseContent = document.getElementById('surprise-content');
const closeSurpriseBtn = document.getElementById('close-surprise');
const letterCard      = document.getElementById('letter-card');

let giftOpen = false;

function launchLetterAnimation() {
    // Step 1: letter card springs open
    setTimeout(() => { letterCard.classList.add('open'); }, 200);

    // Step 2: burst confetti from top
    setTimeout(() => {
        if (typeof confetti === 'undefined') return;
        confetti({ particleCount: 140, spread: 100, origin: { y: 0.3 }, colors: ['#6b8f5e','#fff','#e0d8cc','#aaa','#1a1a1a'] });
        setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.4 }, colors: ['#6b8f5e','#fff','#1a1a1a'] }), 300);
        setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.4 }, colors: ['#6b8f5e','#fff','#1a1a1a'] }), 400);
    }, 500);

    // Step 3: canvas sparkle burst
    const canvas = document.getElementById('gift-confetti-canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        particles.push({
            x: canvas.width / 2, y: canvas.height / 2,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 2,
            opacity: 1,
            color: ['#fff','#e0d8cc','#6b8f5e','#aaa','#c0b090'][Math.floor(Math.random() * 5)]
        });
    }
    function animParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.04;
            p.opacity -= 0.01;
            if (p.opacity > 0) {
                alive = true;
                ctx.save(); ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill(); ctx.restore();
            }
        });
        if (alive) requestAnimationFrame(animParticles);
    }
    setTimeout(animParticles, 300);
}

// Open
surpriseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (giftOpen) return;
    giftOpen = true;
    surpriseContent.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    launchLetterAnimation();
});

// Close
closeSurpriseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    giftOpen = false;
    surpriseContent.classList.add('hidden');
    letterCard.classList.remove('open');
    document.body.style.overflow = '';
    const canvas = document.getElementById('gift-confetti-canvas');
    const ctx    = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Prevent card clicks from bubbling
letterCard.addEventListener('click', (e) => { e.stopPropagation(); });
