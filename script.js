document.addEventListener('DOMContentLoaded', () => {
    // --- Dramatic Magic Background ---
    const canvas = document.getElementById('magic-bg');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Orb {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseSize = Math.random() * 4 + 2; // Larger base size
            this.size = this.baseSize;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.angle = Math.random() * 360;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
            // Mix of Blue and Gold for mystical feel
            this.isGold = Math.random() > 0.7; // More gold
            this.color = this.isGold
                ? `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.3})` // Brighter Gold
                : `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})`; // Brighter Blue
        }

        update() {
            // Mystical floating motion (Sine waves)
            this.angle += 0.01;
            this.x = this.baseX + Math.sin(this.angle) * 20;
            this.y = this.baseY + Math.cos(this.angle) * 20;

            // Pulsing effect
            this.size = this.baseSize + Math.sin(this.angle * 5) * 1;

            // Mouse Interaction (Magnetic Pull / Spell Effect)
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 250; // Increased interaction range

            if (distance < maxDistance) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                this.x += directionX;
                this.y += directionY;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
            ctx.shadowBlur = 20; // Stronger Glow
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset for performance
        }
    }

    // Initialize Orbs
    const initParticles = () => {
        particles = [];
        const particleCount = window.innerWidth < 768 ? 80 : 180; // Significantly increased count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Orb());
        }
    };
    initParticles();

    // Mouse Position
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw Mystical Connections (Subtle)
        particles.forEach((a, index) => {
            for (let j = index + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) { // Increased connection distance
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`; // Slightly more visible
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    };
    animate();

    // --- Custom Cursor (Sparkle Trail) ---
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const createSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        document.body.appendChild(sparkle);

        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 30 + 10;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);

        setTimeout(() => sparkle.remove(), 1000);
    };

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        if (Math.random() < 0.3) { // Create sparkles occasionally
            createSparkle(e.clientX, e.clientY);
        }
    });

    // --- Date/Time Picker Logic (Type Switch + Auto Open) ---
    const meetingDate = document.getElementById('meetingDate');
    const meetingTime = document.getElementById('meetingTime');

    const setupPicker = (input, type) => {
        if (!input) return;

        input.addEventListener('focus', () => {
            input.type = type;
            if (typeof input.showPicker === 'function') {
                try {
                    input.showPicker();
                } catch (e) {
                    console.log('showPicker not supported or blocked');
                }
            }
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.type = 'text';
            }
        });
    };

    setupPicker(meetingDate, 'date');
    setupPicker(meetingTime, 'time');

    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger lines (optional simple toggle)
            hamburger.classList.toggle('open');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // --- Smooth Scrolling & Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .timeline-item, .project-card, .skill-category, .tool-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animStyle);

    // --- Contact Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Email Form Handler (Mailto)
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const subject = document.getElementById('emailSubject').value;
            const message = document.getElementById('emailBody').value;
            const name = document.getElementById('emailName').value;

            // Construct Gmail Web Compose Link
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=mohak99shah@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`;

            // Open in new tab
            window.open(gmailLink, '_blank');

            // Optional: Visual feedback
            const btn = emailForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Opening Gmail...';
            setTimeout(() => {
                btn.innerText = originalText;
                emailForm.reset();
            }, 2000);
        });
    }

    // Meeting Form Handler
    const meetingForm = document.getElementById('meetingForm');
    if (meetingForm) {
        meetingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('meetingDate').value;
            const time = document.getElementById('meetingTime').value;

            // Create start and end time for Google Calendar (assuming 30 min meeting)
            const startDateTime = new Date(`${date}T${time}`);
            const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

            const formatTime = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

            const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Meeting with Mohak Shah")}&dates=${formatTime(startDateTime)}/${formatTime(endDateTime)}&add=mohak99shah@gmail.com`;

            window.open(gcalLink, '_blank');
        });
    }

});
