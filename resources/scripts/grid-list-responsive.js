// GRID LIST RESPONSIVE HANDLER
// This script handles responsive behavior for grid-list components.
// It manages grid layout transitions, navigation buttons, and swipe support.

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation and swipe functionality
    const gridListContent = document.querySelector('.grid-list-content');
    const prevBtn = document.getElementById('grid-prev');
    const nextBtn = document.getElementById('grid-next');
    
    if (!gridListContent || !prevBtn || !nextBtn) return;
    
    const items = gridListContent.querySelectorAll('li');
    let currentIndex = 0;

    // Calculate responsive dimensions
    function getResponsiveDimensions() {
        const w = window.innerWidth;
        
        if (w <= 460) {
            // Mobile: use CSS clamp values
            const minWidth = 320;
            const maxWidth = 420;
            const itemWidth = Math.min(maxWidth, Math.max(minWidth, w * 0.8));
            const gap = w * 0.04; // 4vw gap
            
            // Get CSS variable value for padding-left
            const rootStyles = getComputedStyle(document.documentElement);
            const spacingLg = parseFloat(rootStyles.getPropertyValue('--spacing-lg')) || 24;
            
            return { itemWidth, gap, paddingLeft: spacingLg };
        }
        
        return { itemWidth: 0, gap: 0, paddingLeft: 0 }; // Not used on larger screens
    }

    // Update navigation state
    function updateNavigation() {
        const w = window.innerWidth;
        
        // Only active on mobile (460px and below)
        if (w > 460) {
            currentIndex = 0;
            gridListContent.style.transform = 'translateX(0px)';
            return;
        }
        
        const { itemWidth, gap, paddingLeft } = getResponsiveDimensions();
        const scrollAmount = itemWidth + gap;
        
        // Update button states
        if (currentIndex <= 0) {
            prevBtn.classList.add('grid-btn-disabled');
        } else {
            prevBtn.classList.remove('grid-btn-disabled');
        }
        
        const maxIndex = items.length - 1;
        if (currentIndex >= maxIndex) {
            nextBtn.classList.add('grid-btn-disabled');
        } else {
            nextBtn.classList.remove('grid-btn-disabled');
        }
        
        // Calculate translate position to align card left edge with screen left edge
        // Account for initial padding-left and position each card at the left edge
        const translateX = -(currentIndex * scrollAmount) - paddingLeft;
        gridListContent.style.transform = `translateX(${translateX}px)`;
    }
    
    // Button event listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateNavigation();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxIndex = items.length - 1;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateNavigation();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let isDragging = false;
    
    gridListContent.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 460) return; // Only on mobile
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    gridListContent.addEventListener('touchmove', (e) => {
        if (!isDragging || window.innerWidth > 460) return;
        e.preventDefault();
    });
    
    gridListContent.addEventListener('touchend', (e) => {
        if (!isDragging || window.innerWidth > 460) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                // Swipe left - next
                nextBtn.click();
            } else {
                // Swipe right - previous  
                prevBtn.click();
            }
        }
        
        isDragging = false;
    });

    // Initialize
    handleResponsivePadding();
    updateNavigation();
    
    // Update on resize
    window.addEventListener('resize', () => {
        handleResponsivePadding();
        updateNavigation();
    });
});