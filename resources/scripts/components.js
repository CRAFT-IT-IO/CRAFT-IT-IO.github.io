import { SiteFooter } from "../components/footer/footer-component.js";
import { SiteNavigation } from "../components/navigation/navigation-component.js";

if (!customElements.get('site-footer')) {
  customElements.define('site-footer', SiteFooter);
}

if (!customElements.get('site-navigation')) {
  customElements.define('site-navigation', SiteNavigation);
}