// Preloader Hiding Logic
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        if (typeof gsap !== 'undefined') {
            gsap.to('#preloader', {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                }
            });
        } else {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 600);
        }
    }
}

// Trigger preloader hide when window is fully loaded or as a fallback
window.addEventListener('load', hidePreloader);
document.addEventListener('DOMContentLoaded', () => {
    // Fallback if load event takes too long
    setTimeout(hidePreloader, 1500);
});

// Global Error Handling to prevent script crashes from breaking the UI
window.addEventListener('error', function(e) {
    console.error("Global Error Caught:", e.message);
    hidePreloader(); // Ensure preloader hides even on error
});

$(document).ready(function() {
    try {
        // AOS Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic',
            disable: 'mobile'
        });
    }

    // GSAP ScrollTrigger for Section Reveals
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Advanced Custom Cursor
    const cursorDot = $(".cursor-dot");
    const cursorFollower = $(".cursor-follower");

    if ($(window).width() > 991) {
        $("body").addClass("custom-cursor-active");
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        $(document).on("mousemove", function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(cursorDot, {
                    left: mouseX,
                    top: mouseY,
                    duration: 0.1
                });
            }
        });

        // Smooth follower animation
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add(() => {
                posX += (mouseX - posX) / 12;
                posY += (mouseY - posY) / 12;
                
                gsap.set(cursorFollower, {
                    left: posX,
                    top: posY
                });
            });
        }

        // Hover effects for cursor
        $("a, button, .travel-card, .service-box").on("mouseenter", function() {
            $("body").addClass("cursor-hover");
        }).on("mouseleave", function() {
            $("body").removeClass("cursor-hover");
        });
    } else {
        cursorDot.hide();
        cursorFollower.hide();
    }

    // Safe LocalStorage Helper
    const safeStorage = {
        getItem: (key) => {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, value);
            } catch (e) {}
        }
    };

    // Dark Mode Toggle
    const themeToggle = $('#themeToggle');
    const currentTheme = safeStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        $('body').attr('data-theme', 'dark');
        themeToggle.html('<i class="fas fa-sun"></i>');
    }

    themeToggle.on('click', function() {
        let theme = $('body').attr('data-theme');
        if (theme === 'dark') {
            $('body').removeAttr('data-theme');
            safeStorage.setItem('theme', 'light');
            $(this).html('<i class="fas fa-moon"></i>');
        } else {
            $('body').attr('data-theme', 'dark');
            safeStorage.setItem('theme', 'dark');
            $(this).html('<i class="fas fa-sun"></i>');
        }
    });

    // Navbar Scroll Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
            $('#backToTop').fadeIn();
        } else {
            $('.navbar').removeClass('scrolled');
            $('#backToTop').fadeOut();
        }
    });

    // Hero Slider
    const slides = $('.hero-slide');
    let currentSlide = 0;

    function nextSlide() {
        slides.eq(currentSlide).removeClass('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides.eq(currentSlide).addClass('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }

    // Smooth Scroll
    $('a.nav-link[href^="#"], a.sidebar-link[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutExpo');
        }
    });

    // Back to Top
    $('#backToTop').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Flatpickr Date Picker
    if (typeof flatpickr !== 'undefined') {
        if ($("#bookingDate").length) {
            flatpickr("#bookingDate", {
                minDate: "today",
                dateFormat: "Y-m-d",
                theme: "dark"
            });
        }
        if ($("#modalBookingDate").length) {
            flatpickr("#modalBookingDate", {
                minDate: "today",
                dateFormat: "Y-m-d",
                theme: "dark"
            });
        }
    }

    // Vanilla Tilt Initialization
    if (typeof VanillaTilt !== 'undefined' && $(".travel-card, .service-box").length) {
        VanillaTilt.init(document.querySelectorAll(".travel-card, .service-box"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // Swiper Testimonials
    if (typeof Swiper !== 'undefined' && $(".testimonialSwiper").length) {
        new Swiper('.testimonialSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                992: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // GSAP Animations for Hero Text
    if (typeof gsap !== 'undefined' && $(".hero h1").length) {
        const heroTl = gsap.timeline({ delay: 0.8 });

        heroTl.from(".hero h1", {
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out"
        })
        .from(".hero p", {
            y: 20,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out"
        }, "-=0.8")
        .from(".hero .btn-premium, .hero .booking-form-container", {
            y: 20,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out"
        }, "-=0.8");
    }

    // Section Title Animations
    if (typeof gsap !== 'undefined' && $(".section-title").length) {
        $(".section-title").each(function() {
            gsap.from($(this).find('h2, p'), {
                scrollTrigger: {
                    trigger: this,
                    start: "top 85%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        });
    }

    // --- Filtering Logic (Destinations & Packages) ---
    const filterCards = () => {
        const type = $('.filter-type').val();
        const maxPrice = parseInt($('.filter-price').val());
        const minDuration = parseInt($('.filter-duration').val());

        $('#priceDisplay').text(`$${maxPrice}`);

        $('.travel-card-item').each(function() {
            const cardType = $(this).data('type');
            const cardPrice = parseInt($(this).data('price'));
            const cardDuration = parseInt($(this).data('duration'));

            let show = true;

            if (type !== 'all' && cardType !== type) show = false;
            if (cardPrice > maxPrice) show = false;
            if (cardDuration < minDuration) show = false;

            if (show) {
                $(this).removeClass('filtered-out').fadeIn(400);
            } else {
                $(this).addClass('filtered-out').fadeOut(400);
            }
        });

        // Show "No Results" message if all filtered out
        if ($('.travel-card-item:not(.filtered-out)').length === 0) {
            if ($('#noResultsMsg').length === 0) {
                $('.row.g-4').append('<div id="noResultsMsg" class="col-12 text-center py-5" data-aos="fade-up"><h3>No matching results found.</h3><p>Try adjusting your filters.</p></div>');
            }
        } else {
            $('#noResultsMsg').remove();
        }
        
        // Refresh AOS to handle visibility changes
        setTimeout(() => {
            AOS.refresh();
        }, 500);
    };

    $('.filter-type, .filter-price, .filter-duration').on('change input', filterCards);

    $('#resetFilters').on('click', function() {
        $('.filter-type').val('all');
        const maxPrice = $('.filter-price').attr('max');
        $('.filter-price').val(maxPrice);
        $('.filter-duration').val('0');
        filterCards();
    });

    // Handle Home Page Search Redirection
    $('.booking-form').on('submit', function(e) {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            e.preventDefault();
            const destination = $(this).find('input[placeholder="Where to?"]').val();
            // Redirect to packages with a search query (simplified)
            window.location.href = `packages.html?search=${encodeURIComponent(destination)}`;
        }
    });

    // Check for search query on packages page
    if (window.location.pathname.includes('packages.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            // Simple search logic: filter by type if it matches or just show all
            // For now, just a visual cue or simple filter
            console.log('Searching for:', searchQuery);
        }
    }

    // --- Destination Search Autocomplete ---
    const destinations = [
        "Santorini, Greece",
        "Kyoto, Japan",
        "Bali, Indonesia",
        "Yosemite, USA",
        "Tuscany, Italy",
        "Venice, Italy",
        "Paris, France",
        "London, UK",
        "New York, USA",
        "Tokyo, Japan",
        "Sydney, Australia",
        "Rome, Italy",
        "Barcelona, Spain",
        "Dubai, UAE",
        "Cape Town, South Africa",
        "Machu Picchu, Peru",
        "Grand Canyon, USA",
        "Great Barrier Reef, Australia",
        "Swiss Alps, Switzerland",
        "Amalfi Coast, Italy",
        "Prague, Czech Republic",
        "Amsterdam, Netherlands",
        "Lisbon, Portugal",
        "Reykjavik, Iceland",
        "Marrakech, Morocco",
        "Cairo, Egypt",
        "Petra, Jordan",
        "Siem Reap, Cambodia",
        "Hanoi, Vietnam",
        "Bangkok, Thailand",
        "Singapore",
        "Hong Kong",
        "Seoul, South Korea",
        "Rio de Janeiro, Brazil",
        "Buenos Aires, Argentina",
        "Cusco, Peru",
        "Banff, Canada",
        "Vancouver, Canada",
        "Maui, Hawaii, USA"
    ];

    const searchInput = $('#destinationSearch');
    const autocompleteList = $('#autocomplete-list');

    if (searchInput.length > 0) {
        searchInput.on('input', function() {
            const val = $(this).val().toLowerCase();
            autocompleteList.empty();
            
            if (!val) {
                autocompleteList.hide();
                return;
            }

            const matches = destinations.filter(d => d.toLowerCase().includes(val));
            
            if (matches.length > 0) {
                matches.forEach(match => {
                    const suggestion = $('<div class="autocomplete-suggestion"></div>').text(match);
                    suggestion.on('click', function() {
                        searchInput.val(match);
                        autocompleteList.hide();
                    });
                    autocompleteList.append(suggestion);
                });
                autocompleteList.show();
            } else {
                autocompleteList.hide();
            }
        });

        searchInput.on('keydown', function(e) {
            if (e.keyCode === 13) { // Enter key
                const firstSuggestion = autocompleteList.find('.autocomplete-suggestion').first();
                if (firstSuggestion.length && autocompleteList.is(':visible')) {
                    e.preventDefault();
                    searchInput.val(firstSuggestion.text());
                    autocompleteList.hide();
                }
            }
        });

        // Close suggestions on click outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.position-relative').length) {
                autocompleteList.hide();
            }
        });
    }

    // --- Dashboard Sidebar Toggle ---
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('active');
    });

    // Close sidebar when clicking outside on mobile
    $(document).on('click', function(e) {
        if ($(window).width() <= 768) {
            if (!$(e.target).closest('.sidebar').length && !$(e.target).closest('#sidebarToggle').length) {
                $('.sidebar').removeClass('active');
            }
        }
    });

    // --- Dashboard Specific Animations ---
    if ($('.dashboard-container').length > 0) {
        gsap.from('.sidebar', {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.main-content > *', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        });

        // Initialize Charts if on main dashboard
        const bookingChartCtx = document.getElementById('bookingChart');
        if (bookingChartCtx && typeof Chart !== 'undefined') {
            new Chart(bookingChartCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Bookings',
                        data: [65, 59, 80, 81, 56, 95],
                        fill: true,
                        borderColor: '#0056b3',
                        backgroundColor: 'rgba(0, 86, 179, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    // --- Form Submission (Mock) ---
    $('.contact-form, .booking-form:not(#modalBookingForm)').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        const btn = $form.find('button');
        const originalText = btn.text();
        
        btn.html('<i class="fas fa-spinner fa-spin"></i> Sending...');
        btn.prop('disabled', true);
        
        setTimeout(() => {
            // Replace alert with a more subtle in-page notification
            const successMsg = $('<div class="alert alert-success mt-3" role="alert" style="display:none;">Thank you! Your request has been received. We will contact you shortly.</div>');
            $form.append(successMsg);
            successMsg.fadeIn();
            
            btn.text(originalText);
            btn.prop('disabled', false);
            $form[0].reset();

            // Remove message after 5 seconds
            setTimeout(() => {
                successMsg.fadeOut(() => successMsg.remove());
            }, 5000);
        }, 1500);
    });

    // --- Booking Modal Logic ---
    const bookingModalEl = document.getElementById('bookingModal');
    if (bookingModalEl) {
        const bsModal = new bootstrap.Modal(bookingModalEl);
        
        // Initialize flatpickr for modal
        if (typeof flatpickr !== 'undefined') {
            flatpickr("#modalBookingDate", {
                minDate: "today",
                dateFormat: "Y-m-d",
                theme: "dark"
            });
        }

        $(document).on('click', '.travel-card .btn-premium', function(e) {
            const btnText = $(this).text().trim();
            if (btnText === 'Book Now' || btnText === 'View Details') {
                e.preventDefault();
                const card = $(this).closest('.travel-card');
                const title = card.find('h3').text();
                const desc = card.find('p').first().text();
                const price = card.find('.card-price').text();
                const iconClass = card.find('i.fa-3x').attr('class');
                const included = card.data('included') || "";
                const exclusions = card.data('exclusions') || "";

                $('#modalTitle').text(title);
                $('#modalDesc').text(desc);
                $('#modalPrice').text(price);
                $('#modalPackageInput').val(title);
                
                // Populate Included Activities
                const includedList = $('#modalIncluded');
                includedList.empty();
                if (included) {
                    included.split(',').forEach(item => {
                        includedList.append(`<li><i class="fas fa-check me-2 text-white-50"></i>${item.trim()}</li>`);
                    });
                }

                // Populate Exclusions
                const exclusionsList = $('#modalExclusions');
                exclusionsList.empty();
                if (exclusions) {
                    exclusions.split(',').forEach(item => {
                        exclusionsList.append(`<li><i class="fas fa-times me-2 text-white-50"></i>${item.trim()}</li>`);
                    });
                }
                
                if (iconClass) {
                    $('#modalIcon').attr('class', iconClass.replace('fa-3x', 'fa-4x'));
                }

                bsModal.show();
            }
        });

        $('#modalBookingForm').on('submit', function(e) {
            e.preventDefault();
            const btn = $(this).find('button');
            const originalText = btn.text();
            
            btn.html('<i class="fas fa-spinner fa-spin"></i> Processing...');
            btn.prop('disabled', true);

            setTimeout(() => {
                btn.text('Booking Confirmed!');
                btn.removeClass('btn-premium').addClass('btn-success');
                
                setTimeout(() => {
                    bsModal.hide();
                    // Reset button for next time after modal is hidden
                    setTimeout(() => {
                        btn.text(originalText);
                        btn.removeClass('btn-success').addClass('btn-premium');
                        btn.prop('disabled', false);
                        $('#modalBookingForm')[0].reset();
                    }, 500);
                }, 1500);
            }, 2000);
        });
    }
} catch (err) {
    console.error("Initialization Error:", err);
    hidePreloader();
}
});
