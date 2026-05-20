document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Mobile menu toggle (simple implementation)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    mobileBtn.addEventListener('click', () => {
        // In a full implementation, this would toggle a mobile menu dropdown
        alert('Mobile menu toggle - integrate with dropdown UI');
    });

    // Simple scroll effect for navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
    // --- Cinematic Canvas Hero Scroll Engine ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 128;
        const currentFrame = index => (
            `upscaled_frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        const heroScrollWrapper = document.querySelector('.hero-scroll-wrapper');
        const scenes = {
            1: document.querySelector('.scene-1'),
            3: document.querySelector('.scene-3'),
            5: document.querySelector('.scene-5')
        };
        
        // Preload images
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
            
            // Draw first frame immediately
            if (i === 1) {
                img.onload = () => {
                    renderFrame(1);
                };
            }
        }

        // Resize canvas to window size (with High-DPI / Retina support)
        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            
            // Re-render current frame on resize
            const progress = calculateScrollProgress();
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(progress * frameCount)
            );
            renderFrame(frameIndex + 1);
        };

        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();

        // Render specific frame onto canvas with 'cover' behavior and high-quality smoothing
        function renderFrame(index) {
            const img = images[index - 1];
            if (img && img.complete && img.naturalHeight !== 0) {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // Enable high-quality image smoothing to prevent pixelation/blurriness when zoomed in
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';
                
                context.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            }
        }

        // Calculate scroll progress (0 to 1) for the sticky wrapper
        function calculateScrollProgress() {
            const scrollRect = heroScrollWrapper.getBoundingClientRect();
            const scrollPosition = -scrollRect.top;
            const maxScroll = scrollRect.height - window.innerHeight;
            let progress = scrollPosition / maxScroll;
            return Math.max(0, Math.min(1, progress));
        }

        // Handle text overlays
        function updateScenes(progress) {
            Object.values(scenes).forEach(scene => {
                if (scene) scene.classList.remove('active');
            });

            // Scene 1: 0.0 - 0.25
            if (progress < 0.3 && scenes[1]) {
                const opacity = 1 - (progress / 0.25);
                const transformY = -40 - (progress * 20); 
                scenes[1].style.opacity = Math.max(0, Math.min(1, opacity));
                scenes[1].style.transform = `translateY(${transformY}%)`;
                if(opacity > 0.5) scenes[1].classList.add('active');
            } else if (scenes[1]) {
                scenes[1].style.opacity = 0;
            }

            // Scene 3: 0.4 - 0.65
            if (progress >= 0.3 && progress < 0.7 && scenes[3]) {
                let opacity = 0;
                let transformY = -30;
                if (progress < 0.5) {
                    opacity = (progress - 0.3) / 0.2; 
                    transformY = -30 - ((progress - 0.3) / 0.2 * 10);
                } else {
                    opacity = 1 - ((progress - 0.5) / 0.15); 
                    transformY = -40 - ((progress - 0.5) / 0.15 * 10);
                }
                scenes[3].style.opacity = Math.max(0, Math.min(1, opacity));
                scenes[3].style.transform = `translateY(${transformY}%)`;
                if(opacity > 0.5) scenes[3].classList.add('active');
            } else if (scenes[3]) {
                scenes[3].style.opacity = 0;
            }

            // Scene 5: 0.75 - 1.0
            if (progress >= 0.7 && scenes[5]) {
                const opacity = (progress - 0.7) / 0.2; 
                const transformY = -30 - (opacity * 20);
                scenes[5].style.opacity = Math.max(0, Math.min(1, opacity));
                scenes[5].style.transform = `translateY(${transformY}%)`;
                if(opacity > 0.5) scenes[5].classList.add('active');
            } else if (scenes[5]) {
                scenes[5].style.opacity = 0;
            }
        }

        let isTicking = false;
        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const progress = calculateScrollProgress();
                    const frameIndex = Math.min(
                        frameCount - 1,
                        Math.floor(progress * frameCount)
                    );
                    renderFrame(frameIndex + 1);
                    updateScenes(progress);
                    isTicking = false;
                });
                isTicking = true;
            }
        });
        
        updateScenes(0);
    }

    // Scroll Fade-up Animation Observer
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(element => {
        fadeObserver.observe(element);
    });
});
