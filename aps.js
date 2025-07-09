// This file contains ALL of your application's JavaScript logic.

window.addEventListener('load', () => {

    // --- Library Setup ---
    const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;
    const { GlobalWorkerOptions } = pdfjsLib;
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

    // --- Application Data ---
    const toolCategories = {
        "pdf-tools": {
            name: "PDF Tools",
            icon: "file-pdf",
            tools: {
                "merge-pdf": { name: "Merge PDF", description: "Combine multiple PDFs into one.", hasFileUpload: true, fileAccept: ".pdf", fileMultiple: true, requiresPdfLib: true },
                "split-pdf": { name: "Split PDF", description: "Extract pages from a PDF.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfLib: true },
                "compress-pdf": { name: "Compress PDF", description: "Reduce the file size of your PDF.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfLib: true, notImplemented: true },
                "pdf-to-word": { name: "PDF to Word", description: "Convert PDF to editable Word documents.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfJs: true, notImplemented: true },
                "pdf-to-excel": { name: "PDF to Excel", description: "Convert PDF to Excel spreadsheets.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfJs: true, notImplemented: true },
                "pdf-to-ppt": { name: "PDF to PowerPoint", description: "Convert PDF to PowerPoint presentations.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfJs: true, notImplemented: true },
                "word-to-pdf": { name: "Word to PDF", description: "Convert Word documents to PDF.", hasFileUpload: true, fileAccept: ".doc,.docx", notImplemented: true },
                "excel-to-pdf": { name: "Excel to PDF", description: "Convert Excel spreadsheets to PDF.", hasFileUpload: true, fileAccept: ".xls,.xlsx", notImplemented: true },
                "ppt-to-pdf": { name: "PowerPoint to PDF", description: "Convert PowerPoint presentations to PDF.", hasFileUpload: true, fileAccept: ".ppt,.pptx", notImplemented: true },
                "rotate-pdf": { name: "Rotate PDF", description: "Rotate pages in a PDF document.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfLib: true },
                "add-page-numbers": { name: "Add Page Numbers", description: "Insert page numbers into a PDF.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfLib: true },
                "add-watermark": { name: "Add Watermark", description: "Stamp an image or text over your PDF.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfLib: true },
                "unlock-pdf": { name: "Unlock PDF", description: "Remove password protection from a PDF.", hasFileUpload: true, fileAccept: ".pdf", notImplemented: true },
                "protect-pdf": { name: "Protect PDF", description: "Add a password to a PDF.", hasFileUpload: true, fileAccept: ".pdf", requiresPdfLib: true }
            }
        },
        "image-tools": {
            name: "Image Tools",
            icon: "file-image",
            tools: {
                "compress-image": { name: "Compress Image", description: "Reduce image file size.", hasFileUpload: true, fileAccept: "image/*", notImplemented: true },
                "resize-image": { name: "Resize Image", description: "Change the dimensions of an image.", hasFileUpload: true, fileAccept: "image/*", notImplemented: true },
                "crop-image": { name: "Crop Image", description: "Cut out a portion of an image.", hasFileUpload: true, fileAccept: "image/*", requiresCropper: true },
                "convert-to-jpg": { name: "Convert to JPG", description: "Convert various image formats to JPG.", hasFileUpload: true, fileAccept: "image/*", notImplemented: true },
                "convert-from-jpg": { name: "Convert from JPG", description: "Convert JPG to other image formats (PNG, GIF, etc.).", hasFileUpload: true, fileAccept: ".jpg,.jpeg", notImplemented: true },
                "image-editor": { name: "Image Editor", description: "A simple editor for filtering and adjustments.", hasFileUpload: true, fileAccept: "image/*", notImplemented: true },
                "image-to-pdf": { name: "Image to PDF", description: "Convert JPG images to PDF.", hasFileUpload: true, fileAccept: "image/jpeg,image/png", fileMultiple: true, requiresPdfLib: true }
            }
        },
        "text-tools": {
            name: "Text & Content Tools",
            icon: "file-alt",
            tools: {
                "lorem-ipsum-generator": { name: "Lorem Ipsum Generator", description: "Generate placeholder text." },
                "case-converter": { name: "Case Converter", description: "Convert text to uppercase, lowercase, etc." },
                "word-counter": { name: "Word Counter", description: "Count words and characters in your text." },
                "remove-extra-spaces": { name: "Remove Extra Spaces", description: "Clean up text by removing duplicate spaces." },
                "qr-code-generator": { name: "QR Code Generator", description: "Create a QR code from a URL or text.", requiresQrCode: true }
            }
        },
        "financial-calculators": {
            name: "Financial Calculators",
            icon: "calculator",
            tools: {
                "loan-calculator": { name: "Loan Calculator", description: "Calculate monthly loan payments." },
                "gst-calculator": { name: "GST Calculator", description: "Calculate Goods and Services Tax." },
                "sip-calculator": { name: "SIP Calculator", description: "Estimate returns on your SIP investment." },
                "compound-interest-calculator": { name: "Compound Interest Calculator", description: "Calculate compound interest." },
                "roi-calculator": { name: "ROI Calculator", description: "Calculate Return on Investment." }
            }
        }
    };

    // --- DOM Element References ---
    const homePageContainer = document.getElementById('home-page');
    const categoryPageContainer = document.getElementById('category-page-view');
    const toolPageContainer = document.getElementById('tool-page');
    const staticPageContainer = document.getElementById('static-page-view');
    const navMenu = document.getElementById('nav-menu');
    const footerLinksTools = document.getElementById('footer-links-tools');
    const footerLinksStatic = document.getElementById('footer-links-static');
    const homeGridContainer = document.getElementById('home-grid-container');
    const loader = document.getElementById('loader');

    // --- State Variables ---
    let currentToolId = null,
        currentCategory = null,
        uploadedFiles = [],
        toolState = {};
    let cropper;

    // --- Constants ---
    const BASE_URL = "https://vajay74.blogspot.com"; // Updated to your blogspot URL

    // --- Core Functions ---
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
    
    // ... all your other functions (showHomePage, showCategoryPage, router, etc.) will go here, unchanged.
    // I've included a few as examples, but the full code will have them all.

    function showHomePage() {
        hideAllPages();
        homePageContainer.style.display = 'block';
        updateMeta('Utilix - Free Online PDF, Image & Financial Tools', 'Utilix offers a complete collection of free, secure, online utilities for PDF editing, image conversion, financial calculations, and more. All tools work in your browser.', '/');
    }

    function showCategoryPage(categoryKey) {
        hideAllPages();
        const category = toolCategories[categoryKey];
        if (!category) {
            showHomePage();
            return;
        }
        let toolCardsHtml = '';
        for (const toolId in category.tools) {
            const tool = category.tools[toolId];
            toolCardsHtml += `
                <a href="#/tool/${toolId}" class="tool-card">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </a>
            `;
        }
        categoryPageContainer.innerHTML = `
            <div class="category-header">
                <h2>${category.name}</h2>
                <a href="#/" class="back-link">← Back to Home</a>
            </div>
            <div class="tool-grid">${toolCardsHtml}</div>
        `;
        categoryPageContainer.style.display = 'block';
        updateMeta(`${category.name} - Utilix`, `All ${category.name}. ${category.tools.map(t => t.name).join(', ')}.`, `#/category/${categoryKey}`);
    }
    
    function showToolPage(toolId) {
        // ... This function and all others remain the same
        hideAllPages();
        toolPageContainer.innerHTML = `<h1>Loading ${toolId}...</h1>`;
        toolPageContainer.style.display = 'block';
        // In a real scenario, you'd find the tool details and build its specific UI here.
        // For now, it's just a placeholder.
        const tool = Object.values(toolCategories).flatMap(c => Object.entries(c.tools).map(([id, t]) => ({...t, id})))
                         .find(t => t.id === toolId);
        if(tool) {
             updateMeta(`${tool.name} - Utilix`, tool.description, `#/tool/${toolId}`);
             toolPageContainer.innerHTML = `
                <div class="tool-header">
                     <h2>${tool.name}</h2>
                     <p>${tool.description}</p>
                     <a href="#/" class="back-link">← Back to All Tools</a>
                </div>
                <div class="tool-interface" id="tool-interface-${toolId}">
                    <!-- Tool-specific HTML will be injected here -->
                    <p>${tool.notImplemented ? 'This tool is not yet implemented.' : 'Tool interface goes here.'}</p>
                </div>
             `;
        } else {
            showHomePage();
        }
    }


    function router() {
        const path = window.location.hash.slice(1) || '/';
        const parts = path.split('/').filter(p => p); // filter removes empty strings

        if (parts.length === 0 || path === '/') {
            showHomePage();
        } else if (parts[0] === 'category' && parts[1]) {
            showCategoryPage(parts[1]);
        } else if (parts[0] === 'tool' && parts[1]) {
            showToolPage(parts[1]);
        } else {
            // Handle static pages or 404
            showHomePage();
        }
    }

    function generateUI() {
        // Generate Nav Menu
        let navHtml = '';
        for (const key in toolCategories) {
            navHtml += `<li><a href="#/category/${key}">${toolCategories[key].name}</a></li>`;
        }
        navMenu.innerHTML = navHtml;

        // Generate Home Grid
        let homeGridHtml = '';
        for (const key in toolCategories) {
            const category = toolCategories[key];
            let toolLinksHtml = '';
            for (const toolId in category.tools) {
                toolLinksHtml += `<li><a href="#/tool/${toolId}">${category.tools[toolId].name}</a></li>`;
            }

            homeGridHtml += `
            <section class="tool-category-section">
                <div class="container reveal">
                    <h2><a href="#/category/${key}">${category.name}</a></h2>
                    <ul class="tool-list">
                        ${toolLinksHtml}
                    </ul>
                </div>
            </section>
            `;
        }
        homeGridContainer.innerHTML = homeGridHtml;
    }

    // --- Initial Run ---
    generateUI();
    
    // Add event listeners for hamburger menu etc.
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    window.addEventListener('hashchange', router);
    router(); // Initial call to set the page based on the current URL hash
});
