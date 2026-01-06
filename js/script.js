document.addEventListener('DOMContentLoaded', () => {

    // --- State & Config ---
    const productImages = {
        'original': ['assets/original_perfume_1.jpg', 'assets/original_perfume_2.jpg', 'assets/original_perfume_3.jpg'],
        'rose': ['assets/rose_perfume_1.jpg', 'assets/rose_perfume_2.jpg', 'assets/rose_perfume_3.jpg'],
        'lily': ['assets/lily_perfume_1.jpg', 'assets/lily_perfume_2.jpg', 'assets/lily_perfume_3.jpg']
    };

    // Default image if needed
    const defaultImage = 'assets/original_perfume_1.jpg';


    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);


    // --- Subscription Card Toggle Logic ---
    const subRadios = document.querySelectorAll('input[name="subscription_type"]');
    const cardSingle = document.getElementById('card-single');
    const cardDouble = document.getElementById('card-double');

    function handleSubChange() {
        // Toggle Active Classes
        if (cardSingle.querySelector('input').checked) {
            cardSingle.classList.add('active');
            cardDouble.classList.remove('active');
        } else {
            cardSingle.classList.remove('active');
            cardDouble.classList.add('active');
        }
        updateLink();
    }

    subRadios.forEach(radio => {
        radio.addEventListener('change', handleSubChange);
        // Also add click listener to header to ensure logic runs if label click doesn't bubble change fast enough
        // (Radio change event is sufficient usually, but just in case)
    });


    // --- Fragrance Logic & "Included" Images ---

    // Single Sub Inputs
    const singleFragRadios = document.querySelectorAll('input[name="fragrance_single"]');
    const dynamicSingleImg = document.querySelector('.dynamic-single-img');

    singleFragRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Update Included Image
            const val = e.target.value;
            // Use the first image of the set
            if (dynamicSingleImg && productImages[val]) {
                dynamicSingleImg.src = productImages[val][0];
            }
            // Update Main Gallery Link (Optional visual feedback)
            updateGalleryContext(val);
            updateLink();
        });
    });


    // Double Sub Inputs
    const doubleFrag1Radios = document.querySelectorAll('input[name="fragrance_double_1"]');
    const doubleFrag2Radios = document.querySelectorAll('input[name="fragrance_double_2"]');
    const dynamicDoubleImg1 = document.querySelector('.dynamic-double-img-1');
    const dynamicDoubleImg2 = document.querySelector('.dynamic-double-img-2');

    doubleFrag1Radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            if (dynamicDoubleImg1 && productImages[val]) {
                dynamicDoubleImg1.src = productImages[val][0];
            }
            updateGalleryContext(val);
            updateLink();
        });
    });

    doubleFrag2Radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            if (dynamicDoubleImg2 && productImages[val]) {
                dynamicDoubleImg2.src = productImages[val][0];
            }
            updateGalleryContext(val); // Optional
            updateLink();
        });
    });


    // --- Gallery Logic (Shared) ---
    const mainImage = document.getElementById('main-product-image');
    let currentGallerySet = productImages['original'];
    let currentImageIndex = 0;

    function updateGalleryContext(fragranceName) {
        if (productImages[fragranceName]) {
            currentGallerySet = productImages[fragranceName];
            currentImageIndex = 0;
            updateGalleryVisuals();
        }
    }

    function updateGalleryVisuals() {
        if (!mainImage) return;
        mainImage.style.opacity = 0;
        setTimeout(() => {
            mainImage.src = currentGallerySet[currentImageIndex];
            mainImage.style.opacity = 1;
        }, 200);

        // Update thumbnails contextually?? 
        // For now, let's keep thumbnails static 'original' set or update them?
        // Let's update logical thumbnails if they exist
        const thumbs = document.querySelectorAll('.thumbnail');
        thumbs.forEach((thumb, index) => {
            if (currentGallerySet[index]) {
                thumb.src = currentGallerySet[index];
            }
        });
    }

    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + currentGallerySet.length) % currentGallerySet.length;
            updateGalleryVisuals();
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % currentGallerySet.length;
            updateGalleryVisuals();
        });
    }

    // Thumbnails Click
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            updateGalleryVisuals();
        });
    });


    // --- Link Generation ---
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    function updateLink() {
        if (!addToCartBtn) return;

        const subType = document.querySelector('input[name="subscription_type"]:checked').value;
        let url = `#add-to-cart?sub=${subType}`;

        if (subType === 'single') {
            const frag = document.querySelector('input[name="fragrance_single"]:checked').value;
            url += `&fragrance=${frag}`;
        } else {
            const frag1 = document.querySelector('input[name="fragrance_double_1"]:checked').value;
            const frag2 = document.querySelector('input[name="fragrance_double_2"]:checked').value;
            url += `&fragrance1=${frag1}&fragrance2=${frag2}`;
        }

        addToCartBtn.href = url;
    }


    // --- Collection Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                // Exclusive open
                accordionItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const icon = other.querySelector('.acc-icon');
                        if (icon) icon.innerText = '+';
                    }
                });

                item.classList.toggle('active');
                const icon = item.querySelector('.acc-icon');
                if (icon) icon.innerText = item.classList.contains('active') ? '-' : '+';
            });
        }
    });


    // --- Stats Counter ---
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        stat.innerText = target + "%";
                        clearInterval(timer);
                    } else {
                        stat.innerText = Math.floor(count) + "%";
                    }
                }, 16);
            });
        }
    }, { threshold: 0.5 });

    if (statsSection) observer.observe(statsSection);

});

    // --- Newsletter Form Logic ---
    const newsletterForm = document.querySelector(".newsletter-form");
    if(newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector("input[type=email]");
            if(emailInput.value) {
                alert("Thank you for subscribing! (This is a demo action)");
                emailInput.value = "";
            }
        });
    }


// --- Animation Intersection Observer ---
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach(el => observer.observe(el));
});

