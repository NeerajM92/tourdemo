// Single Page Restaurant Website - Golden Dragon Palace
class RestaurantWebsite {
    constructor() {
        this.currentSlide = 0;
        this.currentMenuSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.menuSlides = document.querySelectorAll('.menu-item');
        this.navLinks = document.querySelectorAll('.nav-link-vertical');
        this.sections = document.querySelectorAll('section');
        this.map = null;
        this.isMapInitialized = false;
        this.isIframeActive = false;
        this.activeElementMonitor = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupCarousel();
        this.setupMenuCarousel();
        this.setupVirtualTour();
        this.setupContactForm();
        
        // Fallback: Try to pre-load map after a delay if callback didn't work
        setTimeout(() => {
            if (!this.isMapInitialized) {
                console.log('Fallback: Attempting to pre-load map...');
                this.initializeMapOnLoad();
            }
        }, 3000);
    }

    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.updateActiveNavLink(link);
            });
        });

        // Explore restaurant button
        const exploreBtn = document.getElementById('explore-restaurant-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.scrollToSection('virtual-tour');
            });
        }

        // Order now buttons
        const orderBtn = document.querySelector('.order-now-vertical');
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                this.scrollToSection('menu');
            });
        }

        // View menu button
        const viewMenuBtn = document.querySelector('.cta-button.secondary');
        if (viewMenuBtn) {
            viewMenuBtn.addEventListener('click', () => {
                this.scrollToSection('menu');
            });
        }

        // Book now button
        const bookNowBtn = document.querySelector('.book-now-text');
        if (bookNowBtn) {
            bookNowBtn.addEventListener('click', () => {
                this.scrollToSection('contact');
            });
        }

        // Hamburger menu
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateActiveNavLink(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupCarousel() {
        // Auto-advance carousel every 5 seconds
        setInterval(() => {
            this.changeSlide(1);
        }, 5000);
    }

    changeSlide(direction) {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update page counter
        this.updatePageCounter();
    }

    currentSlide(slideNumber) {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = slideNumber - 1;
        this.slides[this.currentSlide].classList.add('active');
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update page counter
        this.updatePageCounter();
    }

    setupMenuCarousel() {
        // Auto-advance menu carousel every 4 seconds
        setInterval(() => {
            this.changeMenuSlide(1);
        }, 4000);
    }

    changeMenuSlide(direction) {
        this.menuSlides[this.currentMenuSlide].classList.remove('active');
        this.currentMenuSlide = (this.currentMenuSlide + direction + this.menuSlides.length) % this.menuSlides.length;
        this.menuSlides[this.currentMenuSlide].classList.add('active');
    }

    setupVirtualTour() {
        const explorePropertyBtn = document.getElementById('explore-property-btn');
        const tourModal = document.getElementById('tour-modal');
        const closeTourBtn = document.getElementById('close-tour-btn');

        if (explorePropertyBtn) {
            explorePropertyBtn.addEventListener('click', () => {
                this.startVirtualTour();
            });
        }

        if (closeTourBtn) {
            closeTourBtn.addEventListener('click', () => {
                this.closeVirtualTour();
            });
        }

        if (tourModal) {
            tourModal.addEventListener('click', (e) => {
                if (e.target === tourModal) {
                    this.closeVirtualTour();
                }
            });
        }
    }

    async startVirtualTour() {
        try {
            console.log('Starting virtual tour...');
            
            // Enter fullscreen mode
            this.enterFullscreenMode();
            
            // Check if map is already initialized
            if (!this.isMapInitialized) {
                console.log('Map not pre-loaded, initializing now...');
                await this.initializeMap();
            } else {
                console.log('Using pre-loaded map');
            }

            // Hide overlay and unblur map
            const mapOverlay = document.querySelector('.map-overlay');
            const googleMap = document.querySelector('.google-map');
            
            if (mapOverlay) {
                mapOverlay.classList.add('fade-out');
                console.log('Map overlay hidden');
            }
            
            if (googleMap) {
                googleMap.classList.add('unblurred');
                console.log('Map unblurred');
            }

            // Shorter wait since map is pre-loaded
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test map functionality
            this.testMapFunctionality();

            // Fly camera to restaurant location
            console.log('Attempting camera fly...');
            await this.flyCameraToRestaurant();

            // Show small iframe after restaurant photo
            setTimeout(() => {
                this.showSmallIframe();
            }, 2000); // Show iframe 2 seconds after restaurant photo

        } catch (error) {
            console.error('Error starting virtual tour:', error);
        }
    }

    enterFullscreenMode() {
        // Add fullscreen class to body
        document.body.classList.add('fullscreen-mode');
        
        // Show fullscreen navigation
        const fullscreenNav = document.getElementById('fullscreen-nav');
        if (fullscreenNav) {
            fullscreenNav.classList.add('show');
        }
        
        // Setup exit button event listener
        this.setupExitButton();
        
        console.log('Entered fullscreen mode');
    }

    exitFullscreenMode() {
        // Remove fullscreen class from body
        document.body.classList.remove('fullscreen-mode');
        
        // Hide fullscreen navigation
        const fullscreenNav = document.getElementById('fullscreen-nav');
        if (fullscreenNav) {
            fullscreenNav.classList.remove('show');
        }
        
        // Reset everything to initial state
        this.resetEverythingToInitialState();
        
        console.log('Exited fullscreen mode');
    }

    setupExitButton() {
        const exitBtn = document.getElementById('exit-tour-btn');
        if (exitBtn) {
            // Remove any existing event listeners
            exitBtn.removeEventListener('click', this.handleExitTour);
            
            // Add new event listener
            this.handleExitTour = () => {
                this.exitFullscreenMode();
            };
            exitBtn.addEventListener('click', this.handleExitTour);
        }
    }

    resetEverythingToInitialState() {
        // Reset map
        this.resetMapToPropertySelection();
        
        // Reset iframe state
        this.resetIframeState();
        
        // Reset restaurant photo overlay
        const restaurantPhotoOverlay = document.getElementById('restaurant-photo-overlay');
        if (restaurantPhotoOverlay) {
            restaurantPhotoOverlay.classList.remove('show');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reload the page after a short delay to ensure clean state
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    showRestaurantPhoto() {
        const restaurantPhotoOverlay = document.getElementById('restaurant-photo-overlay');
        if (restaurantPhotoOverlay) {
            restaurantPhotoOverlay.classList.add('show');
            console.log('Restaurant photo overlay shown');
            console.log('Overlay element:', restaurantPhotoOverlay);
            console.log('Overlay classes:', restaurantPhotoOverlay.className);
            console.log('Overlay computed style:', window.getComputedStyle(restaurantPhotoOverlay));
        } else {
            console.error('Restaurant photo overlay element not found');
        }
    }

    testMapFunctionality() {
        if (!this.map) {
            console.error('Map not available for testing');
            return;
        }

        console.log('Testing map functionality...');
        console.log('Map center:', this.map.center);
        console.log('Map tilt:', this.map.tilt);
        console.log('Map range:', this.map.range);
        console.log('Map heading:', this.map.heading);
        console.log('flyCameraTo available:', typeof this.map.flyCameraTo);
        console.log('animateCamera available:', typeof this.map.animateCamera);
    }

    async initializeMap() {
        try {
            // Check if map is already initialized
            if (this.isMapInitialized && this.map) {
                console.log('Map already initialized, skipping...');
                return;
            }

            // Wait for Google Maps to be available
            if (typeof google === 'undefined' || !google.maps) {
                console.error('Google Maps API not loaded');
                return;
            }

            // Import the maps3d library
            const { Map3DElement } = await google.maps.importLibrary("maps3d");
            this.map = document.getElementById("map");

            if (!this.map) {
                console.error('Map element not found during initialization');
                return;
            }

            // Wait for the map element to be ready
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Set initial camera position (earth view)
            this.map.center = { lat: 30.0, lng: 0.0, altitude: 20000000 };
            this.map.tilt = 0;
            this.map.range = 15000;
            this.map.heading = 0;

            // Wait for map to be fully ready
            await new Promise(resolve => setTimeout(resolve, 3000));

            this.isMapInitialized = true;
            console.log('Google Maps 3D initialized successfully');
            console.log('Map methods available:', Object.getOwnPropertyNames(this.map));
        } catch (error) {
            console.error('Error initializing Google Maps 3D:', error);
        }
    }

    async flyCameraToRestaurant() {
        if (!this.map) {
            console.error('Map not initialized');
            return;
        }

        try {
            const restaurantLocation = this.getPropertyLocation('property-1');
            console.log('Flying to restaurant location:', restaurantLocation);
            
            // Try multiple approaches for camera movement
            let cameraMoved = false;
            
            // Skip flyCameraTo methods and go directly to custom slow animation
            console.log('Skipping flyCameraTo methods, using custom slow animation...');
            
            // Use custom slow animation directly
            console.log('Using custom slow animation (3 seconds)');
            await this.animateCameraSlowly(restaurantLocation);
            cameraMoved = true;
            console.log('Custom slow animation completed');

            // Show restaurant photo immediately after animation completes
            this.showRestaurantPhoto();

            // Fix map after animation
            setTimeout(() => {
                this.fixMapAfterFlyAnimation();
            }, 1000); // Reduced to 1 second since animation is 3 seconds

        } catch (error) {
            console.error('Error flying camera to restaurant:', error);
            // Final fallback: set camera position directly
            try {
                const restaurantLocation = this.getPropertyLocation('property-1');
                this.map.center = restaurantLocation.center;
                this.map.tilt = restaurantLocation.tilt;
                this.map.range = restaurantLocation.range;
                this.map.heading = restaurantLocation.heading;
                console.log('Final fallback camera positioning applied');
            } catch (fallbackError) {
                console.error('All camera positioning methods failed:', fallbackError);
            }
        }
    }

    fixMapAfterFlyAnimation() {
        if (!this.map) return;

        try {
            // Disable map interactions
            this.map.draggable = false;
            this.map.scrollwheel = false;
            this.map.disableDoubleClickZoom = true;
            this.map.disableKeyboardShortcuts = true;
            this.map.disableDefaultUI = true;
            this.map.zoomControl = false;
            this.map.mapTypeControl = false;
            this.map.streetViewControl = false;
            this.map.fullscreenControl = false;
            
            // Disable pointer events
            this.map.style.pointerEvents = 'none';
            
            console.log('Map interactions disabled successfully');
        } catch (error) {
            console.error('Could not disable map interactions:', error);
        }
    }

    getPropertyLocation(propertyId) {
        // Restaurant front gate location in Beijing, China
        let latc = 39.9042;
        let lngc = 116.4074;
        let rangec = 1000;
       
        const properties = {
            'property-1': {
                // Golden Dragon Palace front gate location in Beijing
                center: { lat: latc, lng: lngc, altitude: 0 }, 
                tilt: 0, // Level view for front gate
                range: 50, // Much closer to see the front gate
                heading: 0 // Facing the front gate
            }
        };
        return properties[propertyId] || properties['property-1'];
    }

    async initializeMapOnLoad() {
        // Map is already initialized by initMap() callback, just mark it as ready
        console.log('Map pre-loading triggered...');
        
        try {
            // Wait a bit for the map to be fully ready
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get the map element that was already initialized
            this.map = document.getElementById("map");
            
            if (this.map) {
                this.isMapInitialized = true;
                console.log('Map pre-loaded successfully - using existing map');
            } else {
                console.error('Map element not found during pre-loading');
            }
        } catch (error) {
            console.error('Error pre-loading map:', error);
        }
    }

    async animateCameraSlowly(restaurantLocation) {
        const duration = 3000; // 6 seconds
        const steps = 30; // 60 steps for smooth animation
        const stepDuration = duration / steps;
        
        // Get current camera position
        const startCenter = this.map.center;
        const startTilt = this.map.tilt;
        const startRange = this.map.range;
        const startHeading = this.map.heading;
        
        // Calculate differences
        const deltaLat = restaurantLocation.center.lat - startCenter.lat;
        const deltaLng = restaurantLocation.center.lng - startCenter.lng;
        const deltaAltitude = restaurantLocation.center.altitude - startCenter.altitude;
        const deltaTilt = restaurantLocation.tilt - startTilt;
        const deltaRange = restaurantLocation.range - startRange;
        const deltaHeading = restaurantLocation.heading - startHeading;
        
        console.log('Starting slow camera animation...');
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            // Use easeInOutCubic for smooth animation
            const easedProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            // Calculate intermediate values
            const currentLat = startCenter.lat + (deltaLat * easedProgress);
            const currentLng = startCenter.lng + (deltaLng * easedProgress);
            const currentAltitude = startCenter.altitude + (deltaAltitude * easedProgress);
            const currentTilt = startTilt + (deltaTilt * easedProgress);
            const currentRange = startRange + (deltaRange * easedProgress);
            const currentHeading = startHeading + (deltaHeading * easedProgress);
            
            // Apply camera position
            this.map.center = {
                lat: currentLat,
                lng: currentLng,
                altitude: currentAltitude
            };
            this.map.tilt = currentTilt;
            this.map.range = currentRange;
            this.map.heading = currentHeading;
            
            // Wait for next step
            await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
        
        console.log('Slow camera animation completed');
    }

    showSmallIframe() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const smallIframe = document.getElementById('small-iframe');
        const enterTextBox = document.getElementById('enter-text-box');
        
        if (smallIframeContainer) {
            smallIframeContainer.classList.add('show');
            smallIframeContainer.style.opacity = '1';
            smallIframeContainer.style.pointerEvents = 'all';
            
            // Show enter text box
            if (enterTextBox) {
                enterTextBox.classList.add('show');
                enterTextBox.classList.remove('hide');
            }
            
            if (smallIframe) {
                smallIframe.setAttribute('tabindex', '0');
                this.startActiveElementMonitoring();
            }
        }
    }

    startActiveElementMonitoring() {
        this.activeElementMonitor = setInterval(() => {
            const activeElement = document.activeElement;
            const smallIframe = document.getElementById('small-iframe');
            
            if (activeElement === smallIframe && !this.isIframeActive) {
                this.isIframeActive = true;
                this.stopIframeAnimation();
                this.startIframeTransition();
            }
        }, 100);
    }

    stopIframeAnimation() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const enterTextBox = document.getElementById('enter-text-box');
        
        if (smallIframeContainer) {
            smallIframeContainer.classList.remove('show');
            smallIframeContainer.classList.add('static');
            smallIframeContainer.style.border = 'none';
        }
        
        if (enterTextBox) {
            enterTextBox.classList.add('hide');
            enterTextBox.classList.remove('show');
        }
    }

    startIframeTransition() {
        // Blur the page
        document.body.style.filter = 'blur(10px)';
        document.body.style.transition = 'filter 0.5s ease';
        
        setTimeout(() => {
            // Expand iframe
            this.expandIframe();
            
            setTimeout(() => {
                // Unblur the page
                document.body.style.filter = 'none';
            }, 1000);
        }, 2000);
    }

    expandIframe() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        
        if (smallIframeContainer) {
            smallIframeContainer.classList.add('expand');
            
            // Apply expansion styles directly
            smallIframeContainer.style.width = '100vw';
            smallIframeContainer.style.height = '100vh';
            smallIframeContainer.style.top = '0';
            smallIframeContainer.style.left = '0';
            smallIframeContainer.style.transform = 'none';
            smallIframeContainer.style.borderRadius = '0';
            smallIframeContainer.style.zIndex = '1000';
        }
    }

    closeVirtualTour() {
        const tourModal = document.getElementById('tour-modal');
        if (tourModal) {
            tourModal.classList.remove('active');
        }
        
        // Exit fullscreen mode
        this.exitFullscreenMode();
    }

    resetIframeState() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const enterTextBox = document.getElementById('enter-text-box');
        
        if (smallIframeContainer) {
            smallIframeContainer.classList.remove('show', 'static', 'expand');
            
            // Reset styles to exact initial state
            smallIframeContainer.style.opacity = '0';
            smallIframeContainer.style.border = '3px solid white';
            smallIframeContainer.style.pointerEvents = 'none';
            smallIframeContainer.style.transform = 'translate(-50%, -50%)';
            smallIframeContainer.style.width = '2cm';
            smallIframeContainer.style.height = '2cm';
            smallIframeContainer.style.position = 'absolute';
            smallIframeContainer.style.top = '50%';
            smallIframeContainer.style.left = '50%';
            smallIframeContainer.style.zIndex = '1000';
            smallIframeContainer.style.borderRadius = '8px';
            smallIframeContainer.style.overflow = 'hidden';
            smallIframeContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            smallIframeContainer.style.background = 'transparent';
            smallIframeContainer.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Hide enter text box
            if (enterTextBox) {
                enterTextBox.classList.add('hide');
                enterTextBox.classList.remove('show');
            }
            
            // Delete and recreate the iframe for complete reset
            const oldIframe = document.getElementById('small-iframe');
            if (oldIframe) {
                oldIframe.remove();
            }
            
            // Create new iframe with exact initial properties
            const newIframe = document.createElement('iframe');
            newIframe.id = 'small-iframe';
            newIframe.src = 'https://my.matterport.com/show/?m=LsnvPeo6s1U&brand=0';
            newIframe.frameborder = '0';
            newIframe.allowfullscreen = true;
            newIframe.allow = 'autoplay; fullscreen; web-share; xr-spatial-tracking;';
            
            // Append new iframe to container
            smallIframeContainer.appendChild(newIframe);
        }
        
        // Reset iframe active state
        this.isIframeActive = false;
        
        // Clear active element monitoring
        if (this.activeElementMonitor) {
            clearInterval(this.activeElementMonitor);
            this.activeElementMonitor = null;
        }
    }

    resetMapToPropertySelection() {
        if (!this.map) return;

        try {
            // Reset camera to earth view
            this.map.flyCameraTo({
                center: { lat: 30.0, lng: 0.0, altitude: 20000000 },
                tilt: 0,
                range: 15000,
                heading: 0
            });

            // Reset map interactions
            this.map.draggable = true;
            this.map.scrollwheel = true;
            this.map.disableDoubleClickZoom = false;
            this.map.disableKeyboardShortcuts = false;
            this.map.style.pointerEvents = 'auto';

            // Reset overlay
            const mapOverlay = document.querySelector('.map-overlay');
            const googleMap = document.querySelector('.google-map');
            
            if (mapOverlay) {
                mapOverlay.classList.remove('fade-out');
                mapOverlay.style.pointerEvents = 'auto';
                mapOverlay.style.background = 'rgba(0, 0, 0, 0.7)';
            }
            
            if (googleMap) {
                googleMap.classList.remove('unblurred');
            }

            // Hide restaurant photo overlay
            const restaurantPhotoOverlay = document.getElementById('restaurant-photo-overlay');
            if (restaurantPhotoOverlay) {
                restaurantPhotoOverlay.classList.remove('show');
            }

            // Reset explore button
            const exploreBtn = document.getElementById('explore-property-btn');
            if (exploreBtn) {
                setTimeout(() => {
                    exploreBtn.style.pointerEvents = 'auto';
                    exploreBtn.style.cursor = 'pointer';
                }, 1000);
            }

        } catch (error) {
            console.error('Error resetting map:', error);
        }
    }


    setupContactForm() {
        const form = document.querySelector('.contact-form form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit(form);
            });
        }
    }

    handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        console.log('Contact form submitted:', data);
        
        // Show success message
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(45deg, #00b894, #00a085)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'linear-gradient(45deg, #d4af37, #f4d03f)';
            form.reset();
        }, 3000);
    }

    updatePageCounter() {
        const currentPageElement = document.querySelector('.current-page');
        if (currentPageElement) {
            currentPageElement.textContent = this.currentSlide + 1;
        }
    }

    toggleMobileMenu() {
        // For now, just scroll to menu section
        // In a full implementation, this would show/hide a mobile menu
        this.scrollToSection('menu');
    }

}

// Global functions for carousel controls
function changeSlide(direction) {
    if (window.restaurantWebsite) {
        window.restaurantWebsite.changeSlide(direction);
    }
}

function currentSlide(slideNumber) {
    if (window.restaurantWebsite) {
        window.restaurantWebsite.currentSlide(slideNumber);
    }
}

function changeMenuSlide(direction) {
    if (window.restaurantWebsite) {
        window.restaurantWebsite.changeMenuSlide(direction);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.restaurantWebsite = new RestaurantWebsite();
});
