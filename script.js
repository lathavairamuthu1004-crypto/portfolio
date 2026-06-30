// =============================================
//  SUPABASE CONFIG — replace with your own keys
// =============================================
const SUPABASE_URL = 'https://bmrehibhwycffqpadwxo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NyLXMxuvsQNRAc9hr9siuw_NrBiW4xD';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Cursor Glow Effect
    const cursor = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        burger.classList.toggle('toggle');
    });

    // Scroll Disclosure (Reveal on Scroll)
    const revealElements = document.querySelectorAll('.reveal, .project-card, .achievement-card, .timeline-item, .live-project-card');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    links.forEach(link => link.style.animation = '');
                }
            }
        });
    });

    // Add staggered delay to project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add staggered delay to live project cards
    document.querySelectorAll('.live-project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(25px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s, border-color 0.3s, box-shadow 0.3s`;
    });

    // Intersection Observer for live project cards
    const liveCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.live-project-card').forEach(card => {
        liveCardObserver.observe(card);
    });

    // =============================================
    //  Contact Form → Supabase
    // =============================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name    = document.getElementById('contact-name').value.trim();
            const email   = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const btnText    = document.getElementById('btn-text');
            const btnLoading = document.getElementById('btn-loading');
            const successMsg = document.getElementById('form-success');
            const errorMsg   = document.getElementById('form-error');
            const submitBtn  = document.getElementById('contact-submit');

            if (!name || !email || !message) return;

            // Show loading state
            btnText.style.display    = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled       = true;
            successMsg.style.display = 'none';
            errorMsg.style.display   = 'none';

            try {
                const { error } = await supabase
                    .from('contacts')
                    .insert([{ name, email, message }]);

                if (error) throw error;

                // Success
                successMsg.style.display = 'block';
                contactForm.reset();
            } catch (err) {
                console.error('Supabase error:', err);
                errorMsg.style.display = 'block';
            } finally {
                btnText.style.display    = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled       = false;
            }
        });
    }
});
// npx serve e:\portfolio