class SiteFooter extends HTMLElement {
    
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = 
        `
            <footer>
                <div class="contain-wrap site-grid">
                    <svg width="117" height="75" viewBox="0 0 117 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M82.5592 26.1849V13.9059C82.5689 6.22667 76.3631 0 68.6978 0H13.755C6.15738 0 0 6.16857 0 13.78V60.204C0 67.8445 6.17671 74.0325 13.8034 74.0325H68.6785C76.3535 74.0325 82.5688 67.7961 82.5688 60.1169V47.8572H68.8235V60.1653H13.755L13.7357 13.8672H68.8235V26.1946H82.5688L82.5592 26.1849Z" fill="#1F1C1A"/>
                        <path d="M103.234 74.0308H116.999V21.6707L103.234 21.7094V74.0308Z" fill="#1F1C1A"/>
                        <path d="M103.237 0H89.4722V21.7013H103.237V0Z" fill="#1F1C1A"/>
                    </svg>
                    <div class="headquarter">
                        <h4>Headquarter</h4>
                        <p>231 Louise Avenue, 1050 Brussels</p>
                        <p>Belgium</p>
                    </div>
                    <div class="office">
                        <h4>Office</h4>
                        <p>24 Autumn Street, 1050 Ixelles</p>
                        <p>Belgium</p>
                    </div>
                    <div class="reach-us">
                        <h4>Reach us</h4>
                        <p class="btn-action">[ <a class="coding" href="mailto:intouch@craft-it.io">Email Us</a> ]</p>
                        <p class="btn-action">[ <a class="coding" target="_blank" href="https://www.linkedin.com/company/craft-it-solution/">Linkedin</a> ]</p>
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-bottom-wrapper">
                            <p class="p-sm">©2025 Craft it, All Rights Reserved</p>
                        </div>
                        <p class="btn-action back-to-top">[ <a class="coding" href="#hero">back to top</a> ]</p>
                    </div>
                </div>
            </footer>
        `;
        
        // Initialiser l'effet hover pour les liens du footer
        if (window.initializeHoverEffect) {
            window.initializeHoverEffect(this);
        }
    }
}

export { SiteFooter };