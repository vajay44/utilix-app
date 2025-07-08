// This file contains ALL of your application's JavaScript logic.

window.addEventListener('load', () => {

    const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;
    const { GlobalWorkerOptions } = pdfjsLib;
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

    const toolCategories = {
        // PASTE YOUR MASSIVE toolCategories OBJECT HERE.
        // It starts with "pdf-tools": { name: "PDF Tools", ...
    };

    const homePageContainer = document.getElementById('home-page');
    const categoryPageContainer = document.getElementById('category-page-view');
    const toolPageContainer = document.getElementById('tool-page');
    const staticPageContainer = document.getElementById('static-page-view');
    const navMenu = document.getElementById('nav-menu');
    const footerLinksTools = document.getElementById('footer-links-tools');
    const footerLinksStatic = document.getElementById('footer-links-static');
    const homeGridContainer = document.getElementById('home-grid-container');
    const loader = document.getElementById('loader');
    let currentToolId = null, currentCategory = null, uploadedFiles = [], toolState = {};
    let cropper;

    const BASE_URL = "https://www.utilix.co.in";

    function updateMeta(title, description, canonicalPath) {
        document.title = title;
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute('content', description);
        const canonLink = document.querySelector('link[rel="canonical"]');
        if (canonLink) canonLink.setAttribute('href', `${BASE_URL}${canonicalPath}`);
    }

    function hideAllPages() {
        homePageContainer.style.display = 'none';
        categoryPageContainer.style.display = 'none';
        toolPageContainer.style.display = 'none';
        staticPageContainer.style.display = 'none';
    }

    function showHomePage() {
        // ... all your other functions (showHomePage, showCategoryPage, router, etc.) go here, unchanged.
        // Just ensure they are all within the window.addEventListener('load', () => { ... }); block.
    }
    
    // ... (all other functions) ...

    function router() {
        const path = window.location.hash.slice(1) || '/';
        // ... rest of router function
    }

    function generateUI() {
        // ... rest of generateUI function
    }

    // --- Initial Run ---
    generateUI();
    // ... all other setup calls and event listeners

    window.addEventListener('hashchange', router);
    router(); // Initial call to router
});