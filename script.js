// =============================================
//  SUPABASE CONFIG (using REST API — no CDN needed)
// =============================================
const SUPABASE_URL      = 'https://bmrehibhwycffqpadwxo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NyLXMxuvsQNRAc9hr9siuw_NrBiW4xD';

// =============================================
//  EMAILJS CONFIG — replace with your own IDs
// =============================================
const EMAILJS_PUBLIC_KEY  = 'j3WQx3onAtZjjF-pe';
const EMAILJS_SERVICE_ID  = 'service_oybx6zh';
const EMAILJS_TEMPLATE_ID = 'template_b22clsu';

// Send data directly to Supabase REST API using fetch
async function insertContact(name, email, message) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, email, message })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
}

// =============================================
//  PAGE INTERACTIONS
// =============================================
document.addEventListener('DOMContentLoaded', () => {

    // Cursor Glow Effect
    const cursor = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    });

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile Navigation
    const burger   = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links    = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        links.forEach((link, index) => {
            link.style.animation = link.style.animation
                ? ''
                : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
        burger.classList.toggle('toggle');
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll(
        '.reveal, .project-card, .achievement-card, .timeline-item, .live-project-card'
    );

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.92;
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run immediately on load

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    links.forEach(link => (link.style.animation = ''));
                }
            }
        });
    });

    // Staggered project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Live project card animations
    document.querySelectorAll('.live-project-card').forEach((card, index) => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(25px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s, border-color 0.3s, box-shadow 0.3s`;
    });

    const liveCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.live-project-card').forEach(card => {
        liveCardObserver.observe(card);
    });

    // =============================================
    //  Contact Form → Supabase REST API
    // =============================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name    = document.getElementById('contact-name').value.trim();
            const email   = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) return;

            const btnText    = document.getElementById('btn-text');
            const btnLoading = document.getElementById('btn-loading');
            const successMsg = document.getElementById('form-success');
            const errorMsg   = document.getElementById('form-error');
            const submitBtn  = document.getElementById('contact-submit');

            // Loading state
            btnText.style.display    = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled       = true;
            successMsg.style.display = 'none';
            errorMsg.style.display   = 'none';

            try {
                // 1️⃣ Save to Supabase database
                await insertContact(name, email, message);

                // 2️⃣ Send email notification via EmailJS
                if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
                    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        from_name:  name,
                        from_email: email,
                        message:    message
                    });
                }

                successMsg.style.display = 'block';
                contactForm.reset();
            } catch (err) {
                console.error('Contact form error:', err);
                errorMsg.style.display = 'block';
            } finally {
                btnText.style.display    = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled       = false;
            }
        });
    }
});