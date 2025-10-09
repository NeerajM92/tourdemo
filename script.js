// Page Navigation and Animation Controller
class EstateTourApp {
    constructor() {
        this.currentPage = 'welcome';
        this.pages = {
            welcome: document.getElementById('welcome-page'),
            map: document.getElementById('map-page'),
            tour: document.getElementById('tour-page')
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeMap();
    }

    bindEvents() {
        // Start tour button
        document.getElementById('start-tour-btn').addEventListener('click', () => {
            this.navigateToPage('map');
        });

        // Explore property button
        document.getElementById('explore-property-btn').addEventListener('click', () => {
            this.flyToProperty('property-1');
        });

        // Back to map button
        document.getElementById('back-to-map-btn').addEventListener('click', () => {
            this.navigateToPage('map');
        });

    }

    navigateToPage(targetPage) {
        if (this.currentPage === targetPage) return;

        const currentPageElement = this.pages[this.currentPage];
        const targetPageElement = this.pages[targetPage];

        // Add blur-out animation to current page
        currentPageElement.classList.add('blur-out');
        
        // Wait for blur-out animation to complete
        setTimeout(() => {
            // Remove active class from current page
            currentPageElement.classList.remove('active', 'blur-out');
            
            // Add active class to target page
            targetPageElement.classList.add('active');
            
            // Update current page
            this.currentPage = targetPage;
            
            // Trigger page-specific animations
            this.triggerPageAnimations(targetPage);
        }, 400);
    }

    triggerPageAnimations(page) {
        switch (page) {
            case 'map':
                this.animateMapPage();
                break;
            case 'tour':
                this.animateTourPage();
                break;
        }
    }

    animateMapPage() {
        // Reset map to blurred state
        this.resetMapState();
        console.log('Animating map page');
        // Reset animations for map page elements
        const mapTitle = document.querySelector('.map-title');
        const mapSubtitle = document.querySelector('.map-subtitle');
        const exploreButton = document.querySelector('.explore-button');

        // Remove existing animation classes
        [mapTitle, mapSubtitle, exploreButton].forEach(el => {
            if (el) {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = null;
            }
        });

        // Re-trigger animations
        setTimeout(() => {
            mapTitle.style.animation = 'fadeInUp 0.8s ease-out 0.3s forwards';
            mapSubtitle.style.animation = 'fadeInUp 0.8s ease-out 0.6s forwards';
            exploreButton.style.animation = 'fadeInUp 0.8s ease-out 0.9s forwards';
        }, 100);
    }

    // Reset map to initial blurred state
    resetMapState() {
        const map = document.getElementById('map');
        const mapOverlay = document.querySelector('.map-overlay');
        const smallIframeContainer = document.getElementById('small-iframe-container');
        
        if (map) {
            map.classList.remove('unblurred');
        }
        
        if (mapOverlay) {
            mapOverlay.classList.remove('fade-out');
        }

        if (smallIframeContainer) {
            smallIframeContainer.classList.remove('show', 'expand');
        }
    }

    // Show small iframe after camera animation
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

    // Monitor document.activeElement to detect iframe interaction
    startActiveElementMonitoring() {
        const smallIframe = document.getElementById('small-iframe');
        let isMonitoring = true;
        
        const checkActiveElement = () => {
            if (!isMonitoring) return;
            
            const activeElement = document.activeElement;
            
            if (activeElement === smallIframe) {
                isMonitoring = false; // Stop monitoring immediately
                this.stopIframeAnimation();
                this.startIframeTransition();
            } else {
                // Continue monitoring
                setTimeout(checkActiveElement, 100); // Check every 100ms
            }
        };
        
        // Start monitoring
        checkActiveElement();
    }

    // Stop iframe animation and revert to original state
    stopIframeAnimation() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const enterTextBox = document.getElementById('enter-text-box');
        
        if (smallIframeContainer) {
            console.log('Stopping iframe animation and reverting to original state');
            
            // Remove animation and revert styling
            smallIframeContainer.classList.remove('show');
            smallIframeContainer.classList.add('static');
            
            // Remove white border
            smallIframeContainer.style.border = 'none';
        }
        
        // Hide enter text box when iframe becomes active
        if (enterTextBox) {
            enterTextBox.classList.add('hide');
            enterTextBox.classList.remove('show');
        }
    }

    // Start the iframe transition sequence
    startIframeTransition() {
        console.log('Starting iframe transition sequence');
        const mapPage = document.getElementById('map-page');
        const smallIframeContainer = document.getElementById('small-iframe-container');
        
        console.log('Map page:', mapPage);
        console.log('Small iframe container:', smallIframeContainer);
        console.log('Container classes before expand:', smallIframeContainer ? smallIframeContainer.className : 'not found');
        
        // Step 1: Wait 0.3 seconds after iframe is detected as active
        setTimeout(() => {
            console.log('2 seconds passed - blurring page 100%');
            
            // Step 2: Blur the whole page to 100%
            if (mapPage) {
                mapPage.style.filter = 'blur(100px)';
                mapPage.style.transition = 'filter 0.8s ease-out';
                console.log('Page blurred to 100%');
            }
            
            // Step 3: Wait 1 second after blur, then expand and unblur
            setTimeout(() => {
                console.log('1 second passed - expanding iframe and unblurring');
                
                // Expand iframe to whole page
                if (smallIframeContainer) {
                    smallIframeContainer.classList.add('expand');
                    console.log('Iframe expanding to full screen');
                    console.log('Container classes after expand:', smallIframeContainer.className);
                    
                    // Force style application
                    smallIframeContainer.style.width = '100vw';
                    smallIframeContainer.style.height = '100vh';
                    smallIframeContainer.style.top = '0';
                    smallIframeContainer.style.left = '0';
                    smallIframeContainer.style.transform = 'none';
                    smallIframeContainer.style.borderRadius = '0';
                    smallIframeContainer.style.zIndex = '1000';
                }
                
                // Unblur the page
                if (mapPage) {
                    mapPage.style.filter = 'none';
                    console.log('Page unblurred');
                }
                
                // Show top bar
                this.showTopBar();
                
            }, 1000); // Wait 1 second after blur
            
        }, 2000); // Wait 0.3 seconds after iframe detection
    }

    // Expand small iframe to full screen with top bar
    expandSmallIframe() {
        console.log('Expanding small iframe');
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const map = document.getElementById('map');
        const mapPage = document.getElementById('map-page');
        
        if (smallIframeContainer) {
            // Blur the entire page
            if (mapPage) {
                mapPage.style.filter = 'blur(10px)';
                mapPage.style.transition = 'filter 0.8s ease-out';
            }
            
            // Expand iframe to full screen
            smallIframeContainer.classList.add('expand');
            
            // Show the top bar after expansion
            setTimeout(() => {
                this.showTopBar();
            }, 800); // Wait for expansion animation to complete
        }
    }

    // Show top bar with back button
    showTopBar() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        if (smallIframeContainer) {
            // Create top bar if it doesn't exist
            let topBar = document.getElementById('iframe-top-bar');
            if (!topBar) {
                topBar = document.createElement('div');
                topBar.id = 'iframe-top-bar';
                topBar.className = 'iframe-top-bar';
                topBar.innerHTML = `
                    <button id="back-to-map-from-iframe" class="back-button">
                        <span class="back-arrow">←</span>
                        Back to Map
                    </button>
                    <h3 class="tour-title">Property Tour</h3>
                `;
                smallIframeContainer.appendChild(topBar);
                
                // Add event listener for back button
                document.getElementById('back-to-map-from-iframe').addEventListener('click', () => {
                    this.hideExpandedIframe();
                });
            }
            
            topBar.style.opacity = '0';
            topBar.style.transform = 'translateY(-20px)';
            topBar.style.display = 'block';
            
            // Animate top bar in
            setTimeout(() => {
                topBar.style.transition = 'all 0.5s ease-out';
                topBar.style.opacity = '1';
                topBar.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Hide expanded iframe and return to property selection screen
    hideExpandedIframe() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const mapPage = document.getElementById('map-page');
        const topBar = document.getElementById('iframe-top-bar');
        const mapOverlay = document.querySelector('.map-overlay');
        
        if (topBar) {
            topBar.style.transition = 'all 0.3s ease-out';
            topBar.style.opacity = '0';
            topBar.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                topBar.style.display = 'none';
            }, 300);
        }
        
        if (smallIframeContainer) {
            // Remove expand class to shrink iframe
            smallIframeContainer.classList.remove('expand');
            
            // Unblur the page
            if (mapPage) {
                mapPage.style.filter = 'none';
            }
            
            // Hide small iframe after animation
            setTimeout(() => {
                smallIframeContainer.classList.remove('show');
                smallIframeContainer.style.opacity = '0';
                
                // Reset iframe state completely
                this.resetIframeState();
                
                // Reset map to property selection state
                this.resetMapToPropertySelection();
            }, 800);
        }
    }

    // Reset iframe state completely by recreating it
    resetIframeState() {
        const smallIframeContainer = document.getElementById('small-iframe-container');
        const enterTextBox = document.getElementById('enter-text-box');
        
        if (smallIframeContainer) {
            // Remove all classes
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
    }

    // Reset map to property selection state
    resetMapToPropertySelection() {
        const map = document.getElementById('map');
        const mapOverlay = document.querySelector('.map-overlay');
        
        // Re-enable map interactions
        if (map) {
            try {
                map.draggable = true;
                map.scrollwheel = true;
                map.disableDoubleClickZoom = false;
                map.disableKeyboardShortcuts = false;
                map.style.pointerEvents = 'auto';
            } catch (error) {
                // Ignore errors
            }
        }
        
        // Reset map camera to earth view
        if (map && map.flyCameraTo) {
            try {
                map.flyCameraTo({
                    endCamera: {
                        center: { lat: 30.0, lng: 0.0, altitude: 20000000 },
                        tilt: 0,
                        range: 15000,
                        heading: 0
                    },
                    durationMillis: 3000
                });
            } catch (error) {
                // If flyCameraTo fails, try setting properties directly
                try {
                    map.center = { lat: 30.0, lng: 0.0,altitude: 20000000};
                    map.tilt = 0;
                    map.range = 15000;
                    map.heading = 0;
                } catch (e) {
                    // Ignore errors
                }
            }
        }
        
        // Show map overlay with property selection
        if (mapOverlay) {
            mapOverlay.classList.remove('fade-out');
            mapOverlay.style.opacity = '1';
            mapOverlay.style.pointerEvents = 'auto';
            mapOverlay.style.background = 'rgba(0, 0, 0, 0.3)';
            
            // Ensure button is clickable after a short delay
            setTimeout(() => {
                const exploreButton = document.getElementById('explore-property-btn');
                if (exploreButton) {
                    exploreButton.style.pointerEvents = 'auto';
                    exploreButton.style.cursor = 'pointer';
                }
            }, 100);
        }
        
        // Blur the map background
        if (map) {
            map.classList.add('blurred');
        }
    }

    animateTourPage() {
        // Add entrance animation for tour page
        console.log('Animating tour page');
        const tourContainer = document.querySelector('.tour-container');
        if (tourContainer) {
            tourContainer.style.opacity = '0';
            tourContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                tourContainer.style.transition = 'all 0.6s ease-out';
                tourContainer.style.opacity = '1';
                tourContainer.style.transform = 'translateY(0)';
            }, 100);
        }

        // Initialize Matterport iframe with background loading and center click
        this.initializeMatterportIframe();
    }

    initializeMatterportIframe() {
        const iframe = document.getElementById('matterport-iframe');
        if (!iframe){ console.log('Matterport iframe not found'); return;}

        console.log('Initializing Matterport iframe');
        
        // Use timeout-based approach instead of load event
        // This is more reliable for cross-origin iframes
        setTimeout(() => {
            console.log('Matterport iframe should be loaded by now');
            this.simulateCenterClick(iframe);
            
            // Make iframe visible after 0.5 seconds
            setTimeout(() => {
                console.log('Making iframe visible');
                iframe.style.opacity = '1';
            }, 500);
        }, 2000); // Give iframe 2 seconds to load and initialize
    }

    simulateCenterClick(iframe) {
        try {
            console.log('Attempting to simulate center click on iframe');
            
            // Get iframe dimensions and position
            const rect = iframe.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const centerY = rect.top + (rect.height / 2);
            
            console.log(`Iframe dimensions: ${rect.width}x${rect.height}`);
            console.log(`Center coordinates (global): ${centerX}, ${centerY}`);

            // Create a more realistic click event with global coordinates
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                screenX: centerX,
                screenY: centerY,
                button: 0,
                buttons: 1
            });

            // Try multiple approaches to simulate the click
            console.log('Trying direct iframe click...');
            iframe.dispatchEvent(clickEvent);
            
            // Try clicking on the iframe container
            console.log('Trying container click...');
            iframe.parentElement.dispatchEvent(clickEvent);
            
            // Try using elementFromPoint to find what's under the center
            console.log('Trying elementFromPoint approach...');
            const elementAtCenter = document.elementFromPoint(centerX, centerY);
            if (elementAtCenter) {
                console.log('Element at center:', elementAtCenter);
                elementAtCenter.dispatchEvent(clickEvent);
            }
            
            // Try using a more aggressive approach with focus and click
            console.log('Trying focus and click approach...');
            iframe.focus();
            iframe.click();
            
            // Try simulating a mouse down and up sequence
            console.log('Trying mousedown/mouseup sequence...');
            const mouseDownEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                button: 0
            });
            
            const mouseUpEvent = new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                button: 0
            });
            
            iframe.dispatchEvent(mouseDownEvent);
            setTimeout(() => {
                iframe.dispatchEvent(mouseUpEvent);
            }, 50);
            
            console.log('All click simulation methods attempted');
            
        } catch (error) {
            console.log('Could not simulate click on iframe (cross-origin restriction):', error);
            // This is expected due to cross-origin restrictions
            // The iframe will still be made visible
        }
    }

    initializeMap() {
        // Google Maps 3D will be initialized by the callback function
        console.log('Map initialization ready - waiting for Google Maps API');
    }

    // Fly camera to property location
    flyToProperty(propertyId) {
        const map = document.getElementById('map');
        
        if (!map) {
            return;
        }

        // Step 1: Unblur the map and fade out overlay
        this.unblurMap();
        
        // Step 2: Wait for unblur animation, then try to fly camera
        setTimeout(() => {
            this.attemptCameraFlight(map, propertyId);
        }, 1600); // Wait for unblur animation to complete
    }

    // Attempt camera flight with retry logic
    attemptCameraFlight(map, propertyId, retryCount = 0) {
        if (map.flyCameraTo && typeof map.flyCameraTo === 'function') {
            const propertyLocation = this.getPropertyLocation(propertyId);
           
            try {
                // Fly camera to property
                map.flyCameraTo({
                    endCamera: propertyLocation,
                    durationMillis: 5000
                });

                // Show small iframe after camera animation instead of navigating
                setTimeout(() => {
                    console.log('About to show small iframe');
                    this.fixMapAfterFlyAnimation(map);
                    this.showSmallIframe();
                }, 5500);
            } catch (error) {
                console.error('Error during flyCameraTo:', error);
                this.navigateToPage('tour');
            }
        } else if (retryCount < 3) {
            // Retry after a short delay if flyCameraTo is not available yet
            setTimeout(() => {
                this.attemptCameraFlight(map, propertyId, retryCount + 1);
            }, 500);
        } else {
            // If flyCameraTo is still not available after retries, just navigate to tour page
            this.navigateToPage('tour');
        }
    }

    // Unblur the map and fade out overlay
    unblurMap() {
        const map = document.getElementById('map');
        const mapOverlay = document.querySelector('.map-overlay');
        
        if (map) {
            map.classList.add('unblurred');
        }
        
        if (mapOverlay) {
            mapOverlay.classList.add('fade-out');
            // Ensure overlay is completely hidden
            setTimeout(() => {
                mapOverlay.style.opacity = '0';
                mapOverlay.style.pointerEvents = 'none';
            }, 500);
        }
    }

    // Fix map after fly animation - disable drag and scroll
    fixMapAfterFlyAnimation(map) {
        try {
            map.draggable = false;
            map.scrollwheel = false;
            map.disableDoubleClickZoom = true;
            map.disableKeyboardShortcuts = true;
            
            try {
                map.disableDefaultUI = true;
            } catch (e) {
                // Ignore if not supported
            }
            
            try {
                map.zoomControl = false;
            } catch (e) {
                // Ignore if not supported
            }
            
            try {
                map.mapTypeControl = false;
                map.streetViewControl = false;
                map.fullscreenControl = false;
            } catch (e) {
                // Ignore if not supported
            }
            
            try {
                map.style.pointerEvents = 'none';
            } catch (e) {
                // Ignore if not supported
            }
        } catch (error) {
            // Ignore errors
        }
    }

    // Property locations for flyCameraTo
    getPropertyLocation(propertyId) {
        
        let rangec = 1000;
        let latc = 40.70258430593181;
        let lngc = -74.01364283499413;
       
        const properties = {
            'property-1': {
                // center: { lat: 40.7128, lng: -74.0060, altitude: 10 },
                center: { lat: latc, lng: lngc, altitude: 0 }, 
                tilt: 70,
                range: 100,
                heading: 0
            }
            // Add more properties as needed
        };
        return properties[propertyId] || properties['property-1'];
    }

   
}


// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EstateTourApp();
});

// Add some additional interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add parallax effect to floating shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const xPos = (x - 0.5) * speed * 20;
            const yPos = (y - 0.5) * speed * 20;
            
            shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
});