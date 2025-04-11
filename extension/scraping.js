// Dynamic scraping module for e-commerce sites
console.log("3RVision scraping module loaded");

// Site configuration with CSS selectors and extraction methods
const siteConfig = {
  // Amazon configuration
  amazon: {
    productContainers: [
      '[data-component-type="s-search-result"]',
      ".s-result-item",
      'div[data-asin]:not([data-asin=""])',
    ],
    productTitle: ["h2 a span", ".a-text-normal", ".a-size-base-plus"],
    productDescription: [
      ".a-section .a-size-base",
      ".a-size-base .a-color-secondary",
      ".a-text-normal",
    ],
    productFeatures: ".a-list-item",
    productMaterials: {
      containers: [
        ".a-row",
        "span",
        "td",
        "tr",
        "li",
        "div",
        "p",
        "h3",
        "h4",
        "ul",
        ".a-unordered-list",
      ],
      textMatch: [
        // Material identifiers
        "material",
        "composition",
        "made of",
        "made from",
        "constructed from",
        "built with",
        "fabricated from",
        "components",
        "ingredient",
        "content",
        "fabric",
        "construction",
        "shell",
        "outer",
        "inner",
        "lining",
        "filling",
        "made with",
        "manufactured from",
        "structure",
        "frame",
        "housing",

        // Plastic materials
        "plastic",
        "polyester",
        "nylon",
        "pvc",
        "polyethylene",
        "polypropylene",
        "polyurethane",
        "vinyl",
        "acrylic",
        "synthetic",
        "polymer",
        "hdpe",
        "ldpe",
        "pet",
        "neoprene",
        "polycarbonate",
        "synthetic fabric",
        "artificial",
        "polyvinyl",
        "thermoplastic",
        "polystyrene",
        "abs",
        "polyamide",
        "spandex",
        "elastane",
        "lycra",
        "rayon",
        "viscose",
        "polyvinyl chloride",
        "pleather",
        "faux leather",
        "synthetic leather",
        "microfiber",
        "microfibre",

        // Natural and biodegradable materials
        "cotton",
        "wool",
        "linen",
        "hemp",
        "jute",
        "sisal",
        "bamboo",
        "cork",
        "wood",
        "paper",
        "cardboard",
        "biodegradable",
        "compostable",
        "natural",
        "organic",
        "plant-based",
        "cellulose",
        "straw",
        "bagasse",
        "wheat",
        "mushroom leather",
        "mycelium",
        "cork fabric",
        "tencel",
        "lyocell",
        "modal",
        "kapok",
        "ramie",
        "flax",
        "abaca",
        "pina",
        "soy fabric",
        "silk",
        "cashmere",
        "merino",
        "alpaca",
        "mohair",
        "angora",
        "down",
        "feather",
        "leather",
        "suede",
        "cotton canvas",
        "denim",
        "chambray",
        "muslin",
        "twill",
        "flannel",
        "velvet",
        "corduroy",

        // Recyclable materials
        "recyclable",
        "recycled",
        "upcycled",
        "repurposed",
        "reclaimed",
        "post-consumer",
        "pre-consumer",
        "recycled content",
        "glass",
        "metal",
        "aluminum",
        "steel",
        "tin",
        "copper",
        "brass",
        "iron",
        "ceramic",
        "terracotta",
        "porcelain",
        "stone",
        "marble",
        "granite",
        "silicone",
        "recycled plastic",
        "recycled polyester",
        "recycled nylon",
        "recycled paper",
        "recycled metal",
        "recycled glass",
        "reclaimed wood",

        // Eco-friendly identifiers
        "eco-friendly",
        "environmentally friendly",
        "sustainable",
        "renewable",
        "green",
        "zero waste",
        "plastic-free",
        "eco-conscious",
        "earth-friendly",
        "carbon neutral",
        "low impact",
        "non-toxic",
        "chemical-free",
        "non-plastic",
        "biodegradable packaging",
        "eco packaging",
        "fair trade",
        "ethical",
        "vegan",
        "cruelty-free",
        "organic certified",
        "gots certified",
        "oeko-tex",
        "bluesign",
        "cradle to cradle",
      ],
    },
    price: ".a-price .a-offscreen",
    rating: ".a-icon-star-small .a-icon-alt",
    isProductValid: (node) => {
      return node.querySelector("h2 a span") || node.querySelector(".a-price");
    },
    domainMatches: [
      "amazon.com",
      "amazon.in",
      "amazon.co.uk",
      "amazon.de",
      "amazon.ca",
    ],
  },

  // Enhanced Flipkart configuration
  flipkart: {
    productContainers: [
      "._1AtVbE", // Main product card
      "._4ddWXP", // Grid view product
      "._1xHGtK", // List view product
      "._2kHMtA", // New product card
      "._1fQZEK", // Product in search results
      "._1YokD2._2MImQY", // Product in category page
      "._1YokD2._2MImQY ._1AtVbE", // Nested product cards
      "div[data-id]", // Generic product container
      "._2kHMtA", // Alternative product card
      "._1fQZEK", // Another product card variant
      "._1YokD2._2MImQY ._4ddWXP", // Nested grid products
      "._1YokD2._2MImQY ._1xHGtK", // Nested list products
      "._1YokD2._2MImQY ._2kHMtA", // Nested new products
      "._1YokD2._2MImQY ._1fQZEK", // Nested search results
      "._1YokD2._2MImQY div[data-id]", // Nested generic products
    ],
    productTitle: [
      "._4rR01T", // Main title
      ".s1Q9rs", // Alternative title
      ".IRpwTa", // Another title variant
      "._2WkVRV", // Brand name
      "._2B099V", // Product name
      "._1YokD2._2MImQY ._4rR01T", // Nested title
      "._1YokD2._2MImQY .s1Q9rs", // Nested alternative title
      "._1YokD2._2MImQY .IRpwTa", // Nested another variant
      "._1YokD2._2MImQY ._2WkVRV", // Nested brand name
      "._1YokD2._2MImQY ._2B099V", // Nested product name
    ],
    productDescription: [
      "._1xgFaf", // Main description
      ".fMghEO", // Features
      "._3Djpdu", // Additional info
      "._1YokD2._2MImQY ._1xgFaf", // Nested description
      "._1YokD2._2MImQY .fMghEO", // Nested features
      "._1YokD2._2MImQY ._3Djpdu", // Nested additional info
    ],
    productFeatures: [
      "._1mXcCf", // Features list
      "._3ExdjG", // Key features
      "li._21lJbe", // Feature items
      "._1YokD2._2MImQY ._1mXcCf", // Nested features
      "._1YokD2._2MImQY ._3ExdjG", // Nested key features
      "._1YokD2._2MImQY li._21lJbe", // Nested feature items
    ],
    productMaterials: {
      containers: [
        "li",
        "td",
        "tr",
        ".crafting",
        "div",
        "p",
        "span",
        "ul",
        ".LGMpV",
        "._1AtVbE",
        "._16PBlm",
        "._1YokD2._2MImQY li",
        "._1YokD2._2MImQY td",
        "._1YokD2._2MImQY tr",
        "._1YokD2._2MImQY .crafting",
        "._1YokD2._2MImQY div",
        "._1YokD2._2MImQY p",
        "._1YokD2._2MImQY span",
        "._1YokD2._2MImQY ul",
        "._1YokD2._2MImQY .LGMpV",
        "._1YokD2._2MImQY ._1AtVbE",
        "._1YokD2._2MImQY ._16PBlm",
      ],
      textMatch: [
        // Same material identifiers as Amazon
        "material",
        "composition",
        "made of",
        "made from",
        "constructed from",
        "built with",
        "fabricated from",
        "components",
        "ingredient",
        "content",
        "fabric",
        "construction",
        "shell",
        "outer",
        "inner",
        "lining",
        "filling",
        "made with",
        "manufactured from",
        "structure",
        "frame",
        "housing",

        // Plastic materials
        "plastic",
        "polyester",
        "nylon",
        "pvc",
        "polyethylene",
        "polypropylene",
        "polyurethane",
        "vinyl",
        "acrylic",
        "synthetic",
        "polymer",
        "hdpe",
        "ldpe",
        "pet",
        "neoprene",
        "polycarbonate",
        "synthetic fabric",
        "artificial",
        "polyvinyl",
        "thermoplastic",
        "polystyrene",
        "abs",
        "polyamide",
        "spandex",
        "elastane",
        "lycra",
        "rayon",
        "viscose",
        "polyvinyl chloride",
        "pleather",
        "faux leather",
        "synthetic leather",
        "microfiber",
        "microfibre",

        // Natural and biodegradable materials
        "cotton",
        "wool",
        "linen",
        "hemp",
        "jute",
        "sisal",
        "bamboo",
        "cork",
        "wood",
        "paper",
        "cardboard",
        "biodegradable",
        "compostable",
        "natural",
        "organic",
        "plant-based",
        "cellulose",
        "straw",
        "bagasse",
        "wheat",
        "mushroom leather",
        "mycelium",
        "cork fabric",
        "tencel",
        "lyocell",
        "modal",
        "kapok",
        "ramie",
        "flax",
        "abaca",
        "pina",
        "soy fabric",
        "silk",
        "cashmere",
        "merino",
        "alpaca",
        "mohair",
        "angora",
        "down",
        "feather",
        "leather",
        "suede",
        "cotton canvas",
        "denim",
        "chambray",
        "muslin",
        "twill",
        "flannel",
        "velvet",
        "corduroy",

        // Recyclable materials
        "recyclable",
        "recycled",
        "upcycled",
        "repurposed",
        "reclaimed",
        "post-consumer",
        "pre-consumer",
        "recycled content",
        "glass",
        "metal",
        "aluminum",
        "steel",
        "tin",
        "copper",
        "brass",
        "iron",
        "ceramic",
        "terracotta",
        "porcelain",
        "stone",
        "marble",
        "granite",
        "silicone",
        "recycled plastic",
        "recycled polyester",
        "recycled nylon",
        "recycled paper",
        "recycled metal",
        "recycled glass",
        "reclaimed wood",

        // Eco-friendly identifiers
        "eco-friendly",
        "environmentally friendly",
        "sustainable",
        "renewable",
        "green",
        "zero waste",
        "plastic-free",
        "eco-conscious",
        "earth-friendly",
        "carbon neutral",
        "low impact",
        "non-toxic",
        "chemical-free",
        "non-plastic",
        "biodegradable packaging",
        "eco packaging",
        "fair trade",
        "ethical",
        "vegan",
        "cruelty-free",
        "organic certified",
        "gots certified",
        "oeko-tex",
        "bluesign",
        "cradle to cradle",
      ],
    },
    price: [
      "._30jeq3",
      "._1_WHN1",
      "._1YokD2._2MImQY ._30jeq3",
      "._1YokD2._2MImQY ._1_WHN1",
    ],
    rating: [
      "._3LWZlK",
      "._2d4LTz",
      "._1YokD2._2MImQY ._3LWZlK",
      "._1YokD2._2MImQY ._2d4LTz",
    ],
    isProductValid: (node) => {
      // Check for any of the title selectors
      const hasTitle = [
        "._4rR01T",
        ".s1Q9rs",
        ".IRpwTa",
        "._2WkVRV",
        "._2B099V",
      ].some((selector) => node.querySelector(selector));

      // Check for any of the price selectors
      const hasPrice = ["._30jeq3", "._1_WHN1"].some((selector) =>
        node.querySelector(selector)
      );

      // Check for product data-id attribute
      const hasDataId = node.hasAttribute("data-id");

      // Product is valid if it has either a title, price, or data-id
      return hasTitle || hasPrice || hasDataId;
    },
    domainMatches: ["flipkart.com"],
  },

  // New Jiomart configuration
  jiomart: {
    productContainers: [
      ".jm-col-4", // Grid product
      ".jm-col-3", // Alternative grid
      ".product-list", // List view
      ".product-item", // Individual product
      ".product-card", // Card view
      ".product-grid-item", // Grid item
    ],
    productTitle: [
      ".product-title", // Main title
      ".product-name", // Alternative title
      ".jm-product-name", // Specific title
      ".product-title a", // Title with link
      ".product-card-title", // Card title
    ],
    productDescription: [
      ".product-description", // Main description
      ".product-short-description", // Short description
      ".product-features", // Features
      ".product-specifications", // Specifications
      ".product-details", // Details
    ],
    productFeatures: [
      ".product-features-list", // Features list
      ".product-specifications-list", // Specifications list
      ".product-details-list", // Details list
      ".product-attributes", // Attributes
    ],
    productMaterials: {
      containers: [
        ".product-description",
        ".product-features",
        ".product-specifications",
        ".product-details",
        "p",
        "span",
        "div",
        "li",
        "td",
        "tr",
      ],
      textMatch: [
        // Same material identifiers as other sites
        "material",
        "composition",
        "made of",
        "made from",
        "constructed from",
        "built with",
        "fabricated from",
        "components",
        "ingredient",
        "content",
        "fabric",
        "construction",
        "shell",
        "outer",
        "inner",
        "lining",
        "filling",
        "made with",
        "manufactured from",
        "structure",
        "frame",
        "housing",
        // ... rest of textMatch remains the same ...
      ],
    },
    price: [
      ".product-price",
      ".jm-product-price",
      ".price",
      ".product-card-price",
      ".product-list-price",
    ],
    rating: [
      ".product-rating",
      ".jm-product-rating",
      ".rating",
      ".product-card-rating",
      ".product-list-rating",
    ],
    isProductValid: (node) => {
      return (
        node.querySelector(".product-title") ||
        node.querySelector(".product-name") ||
        node.querySelector(".product-price") ||
        node.querySelector(".product-rating")
      );
    },
    domainMatches: ["jiomart.com"],
  },

  // Myntra configuration
  myntra: {
    productContainers: [
      ".product-base",
      ".product-sliderContainer",
      ".product-productMetaInfo",
    ],
    productTitle: [".product-product", ".product-brand", ".pdp-title"],
    productDescription: [
      ".product-product",
      ".pdp-product-description-content",
      ".index-rowValue",
    ],
    productFeatures: [".size-buttons-size-button", ".pdp-sizeFitDesc"],
    productMaterials: {
      containers: [
        ".pdp-productDescriptorsContainer",
        "p",
        ".index-row",
        "div",
        "li",
        "span",
        "ul",
        ".pdp-product-description-content",
      ],
      textMatch: [
        // Same material identifiers as Amazon
        "material",
        "composition",
        "made of",
        "made from",
        "constructed from",
        "built with",
        "fabricated from",
        "components",
        "ingredient",
        "content",
        "fabric",
        "construction",
        "shell",
        "outer",
        "inner",
        "lining",
        "filling",
        "made with",
        "manufactured from",
        "structure",
        "frame",
        "housing",

        // Plastic materials
        "plastic",
        "polyester",
        "nylon",
        "pvc",
        "polyethylene",
        "polypropylene",
        "polyurethane",
        "vinyl",
        "acrylic",
        "synthetic",
        "polymer",
        "hdpe",
        "ldpe",
        "pet",
        "neoprene",
        "polycarbonate",
        "synthetic fabric",
        "artificial",
        "polyvinyl",
        "thermoplastic",
        "polystyrene",
        "abs",
        "polyamide",
        "spandex",
        "elastane",
        "lycra",
        "rayon",
        "viscose",
        "polyvinyl chloride",
        "pleather",
        "faux leather",
        "synthetic leather",
        "microfiber",
        "microfibre",

        // Natural and biodegradable materials
        "cotton",
        "wool",
        "linen",
        "hemp",
        "jute",
        "sisal",
        "bamboo",
        "cork",
        "wood",
        "paper",
        "cardboard",
        "biodegradable",
        "compostable",
        "natural",
        "organic",
        "plant-based",
        "cellulose",
        "straw",
        "bagasse",
        "wheat",
        "mushroom leather",
        "mycelium",
        "cork fabric",
        "tencel",
        "lyocell",
        "modal",
        "kapok",
        "ramie",
        "flax",
        "abaca",
        "pina",
        "soy fabric",
        "silk",
        "cashmere",
        "merino",
        "alpaca",
        "mohair",
        "angora",
        "down",
        "feather",
        "leather",
        "suede",
        "cotton canvas",
        "denim",
        "chambray",
        "muslin",
        "twill",
        "flannel",
        "velvet",
        "corduroy",

        // Recyclable materials
        "recyclable",
        "recycled",
        "upcycled",
        "repurposed",
        "reclaimed",
        "post-consumer",
        "pre-consumer",
        "recycled content",
        "glass",
        "metal",
        "aluminum",
        "steel",
        "tin",
        "copper",
        "brass",
        "iron",
        "ceramic",
        "terracotta",
        "porcelain",
        "stone",
        "marble",
        "granite",
        "silicone",
        "recycled plastic",
        "recycled polyester",
        "recycled nylon",
        "recycled paper",
        "recycled metal",
        "recycled glass",
        "reclaimed wood",

        // Eco-friendly identifiers
        "eco-friendly",
        "environmentally friendly",
        "sustainable",
        "renewable",
        "green",
        "zero waste",
        "plastic-free",
        "eco-conscious",
        "earth-friendly",
        "carbon neutral",
        "low impact",
        "non-toxic",
        "chemical-free",
        "non-plastic",
        "biodegradable packaging",
        "eco packaging",
        "fair trade",
        "ethical",
        "vegan",
        "cruelty-free",
        "organic certified",
        "gots certified",
        "oeko-tex",
        "bluesign",
        "cradle to cradle",
      ],
    },
    price: [".product-discountedPrice", ".pdp-price"],
    rating: [".product-ratingsContainer", ".index-overallRating"],
    isProductValid: (node) => {
      return (
        node.querySelector(".product-brand") ||
        node.querySelector(".product-product")
      );
    },
    domainMatches: ["myntra.com"],
  },
};

// Update the identifySite function to handle more domains
function identifySite() {
  const hostname = window.location.hostname.toLowerCase();

  // Check for specific e-commerce sites first
  for (const [site, config] of Object.entries(siteConfig)) {
    if (config.domainMatches.some((domain) => hostname.includes(domain))) {
      console.log(`Identified site as: ${site}`);
      return site;
    }
  }

  // Generic fallback for unknown sites with more patterns
  if (
    hostname.includes("shop") ||
    hostname.includes("store") ||
    hostname.includes("product") ||
    hostname.includes("buy") ||
    hostname.includes("market") ||
    hostname.includes("mall") ||
    hostname.includes("bazaar") ||
    hostname.includes("mart")
  ) {
    console.log("Identified as a generic e-commerce site");
    return "generic";
  }

  console.log("Not recognized as an e-commerce site");
  return null;
}

// Get product elements based on the current site
function getProductElements() {
  const site = identifySite();
  if (!site || !siteConfig[site]) return [];

  let productElements = [];
  const config = siteConfig[site];

  // Try each selector until we find results
  for (const selector of config.productContainers) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(
          `Found ${elements.length} products using selector: ${selector}`
        );
        productElements = Array.from(elements);
        break;
      }
    } catch (error) {
      console.error(`Error with selector "${selector}":`, error);
    }
  }

  // For Flipkart, also check for dynamically loaded products
  if (site === "flipkart" && productElements.length === 0) {
    try {
      // Check for products in the main content area
      const mainContent = document.querySelector("._1YokD2._2MImQY");
      if (mainContent) {
        const dynamicElements = mainContent.querySelectorAll(
          "._1AtVbE, ._4ddWXP, ._1xHGtK, ._2kHMtA, ._1fQZEK, div[data-id]"
        );
        if (dynamicElements.length > 0) {
          console.log(
            `Found ${dynamicElements.length} dynamic products in main content`
          );
          productElements = Array.from(dynamicElements);
        }
      }
    } catch (error) {
      console.error("Error finding dynamic Flipkart products:", error);
    }
  }

  // Filter out invalid product elements
  if (config.isProductValid && productElements.length > 0) {
    productElements = productElements.filter(config.isProductValid);
    console.log(`After validation: ${productElements.length} valid products`);
  }

  return productElements;
}

// Extract the specified information from an element using selectors
function extractFromSelectors(element, selectors) {
  if (!selectors) return "";

  // Handle array of selectors
  if (Array.isArray(selectors)) {
    for (const selector of selectors) {
      try {
        const result = extractFromSelectors(element, selector);
        if (result) return result;
      } catch (error) {
        console.error(`Error with selector "${selector}":`, error);
      }
    }
    return "";
  }

  // Handle string selector
  try {
    const elementFound = element.querySelector(selectors);
    if (elementFound) return elementFound.textContent.trim();
  } catch (error) {
    console.error(`Error with selector "${selectors}":`, error);
  }

  return "";
}

// Find elements containing specific text
function findElementsWithText(rootElement, selectors, textToMatch) {
  let results = [];

  // Convert single string to array for uniform processing
  const textPatterns = Array.isArray(textToMatch) ? textToMatch : [textToMatch];

  // For each potential container selector
  for (const selector of selectors) {
    try {
      // Find all elements of this type
      const elements = rootElement.querySelectorAll(selector);

      // Check each element for the text patterns
      for (const element of elements) {
        const elementText = element.textContent.toLowerCase();

        // Check if any of the text patterns match
        for (const pattern of textPatterns) {
          if (elementText.includes(pattern.toLowerCase())) {
            results.push(element);
            break; // Only add the element once if it matches multiple patterns
          }
        }
      }
    } catch (error) {
      console.error(
        `Error with selector "${selector}" in findElementsWithText:`,
        error
      );
    }
  }

  return results;
}

// Expand the list of biodegradable terms
const biodegradableTerms = [
  "biodegradable",
  "compostable",
  "decomposable",
  "eco-friendly",
  "organic",
  "natural",
  "plant-based",
  "cotton",
  "wool",
  "linen",
  "hemp",
  "jute",
  "sisal",
  "bamboo",
  "cork",
  "wood",
  "paper",
  "cardboard",
  "bagasse",
  "wheat straw",
  "mushroom",
  "mycelium",
  "tencel",
  "lyocell",
  "modal",
  "kapok",
  "ramie",
  "flax",
  "bioplastic", // New term
  "bio-based",  // New term
  "starch-based", // New term
  "PLA", // Polylactic Acid, a common biodegradable plastic
  "PHA", // Polyhydroxyalkanoates, another biodegradable plastic
  "cellulose", // New term
  "palm leaf", // New term
  "banana leaf", // New term
  "areca leaf", // New term
  "coconut coir", // New term
  "seaweed", // New term
  "algae", // New term
];

// Improve pattern matching logic
function extractMaterialTextInfo(element, materialConfig) {
  if (
    !materialConfig ||
    !materialConfig.containers ||
    !materialConfig.textMatch
  ) {
    return "";
  }

  let materialText = "";

  // Find elements containing the material text
  const materialElements = findElementsWithText(
    element,
    materialConfig.containers,
    materialConfig.textMatch
  );

  // Get text from these elements and their siblings/children
  materialElements.forEach((materialElement) => {
    // Include the element's own text
    materialText += materialElement.textContent.trim() + " ";

    // Try to get sibling text (often materials are in key-value pairs)
    if (materialElement.nextElementSibling) {
      materialText +=
        materialElement.nextElementSibling.textContent.trim() + " ";
    }

    // Check children for material details
    const children = materialElement.children;
    for (let i = 0; i < children.length; i++) {
      materialText += children[i].textContent.trim() + " ";
    }
  });

  // Additional logic to check for biodegradable context
  biodegradableTerms.forEach((term) => {
    if (materialText.toLowerCase().includes(term.toLowerCase())) {
      console.log(`Detected biodegradable term: ${term}`);
    }
  });

  return materialText.trim();
}

// Extract all product information
function extractProductInfo(productElement) {
  const site = identifySite();
  if (!site || !siteConfig[site])
    return { text: productElement.textContent || "" };

  const config = siteConfig[site];

  // Extract primary information
  const title = extractFromSelectors(productElement, config.productTitle);
  const description = extractFromSelectors(
    productElement,
    config.productDescription
  );

  // Extract material-related information using our custom approach
  let materialInfo = extractMaterialTextInfo(
    productElement,
    config.productMaterials
  );

  // Extract product features (potentially containing material info)
  let featuresText = "";
  try {
    const featureElements = productElement.querySelectorAll(
      config.productFeatures
    );
    featureElements.forEach(
      (el) => (featuresText += el.textContent.trim() + " ")
    );
  } catch (error) {
    console.error("Error extracting features:", error);
  }

  // Extract additional info from nested elements for thorough search
  let additionalText = "";
  try {
    const allTextElements = productElement.querySelectorAll(
      "p, span, div, li, td, tr, th, h3, h4, h5, a"
    );

    // Define all material and plastic-related terms to look for
    const materialTerms = [
      "material",
      "composition",
      "made of",
      "made from",
      "constructed from",
      "built with",
      "fabricated from",
      "components",
      "ingredient",
      "content",
      "plastic",
      "polyester",
      "nylon",
      "acrylic",
      "polyurethane",
      "pvc",
      "polypropylene",
      "polyethylene",
      "pet",
      "vinyl",
      "synthetic",
      "polymer",
      "polycarbonate",
      "polystyrene",
      "abs",
      "polyamide",
      "acrylonitrile",
      "hdpe",
      "ldpe",
      "recycled",
      "biodegradable",
      "compostable",
      "bamboo",
      "cotton",
      "wood",
      "glass",
      "metal",
      "steel",
      "aluminum",
      "silicon",
      "bag",
      "container",
      "packaging",
      "eco",
      "sustainable",
      "green",
    ];

    allTextElements.forEach((el) => {
      const text = el.textContent.trim().toLowerCase();

      // Check if any material term exists in the text
      if (materialTerms.some((term) => text.includes(term))) {
        additionalText += el.textContent.trim() + " ";
      }
    });
  } catch (error) {
    console.error("Error extracting additional text:", error);
  }

  // Perform specific material detection
  let plasticsDetected = [];
  let biodegradableDetected = [];
  let recyclableDetected = [];

  const plasticTerms = [
    "plastic",
    "polyester",
    "nylon",
    "acrylic",
    "polyurethane",
    "pvc",
    "polypropylene",
    "polyethylene",
    "pet",
    "vinyl",
    "synthetic",
    "polymer",
    "polycarbonate",
    "polystyrene",
    "hdpe",
    "ldpe",
    "abs",
    "polyamide",
    "acrylonitrile",
  ];

  const biodegradableTerms = [
    "biodegradable",
    "compostable",
    "decomposable",
    "eco-friendly",
    "organic",
    "natural",
    "plant-based",
    "cotton",
    "wool",
    "linen",
    "hemp",
    "jute",
    "sisal",
    "bamboo",
    "cork",
    "wood",
    "paper",
    "cardboard",
    "bagasse",
    "wheat straw",
    "mushroom",
    "mycelium",
    "tencel",
    "lyocell",
    "modal",
    "kapok",
    "ramie",
    "flax",
    "bioplastic", // New term
    "bio-based",  // New term
    "starch-based", // New term
    "PLA", // Polylactic Acid, a common biodegradable plastic
    "PHA", // Polyhydroxyalkanoates, another biodegradable plastic
    "cellulose", // New term
    "palm leaf", // New term
    "banana leaf", // New term
    "areca leaf", // New term
    "coconut coir", // New term
    "seaweed", // New term
    "algae", // New term
  ];

  const recyclableTerms = [
    "recyclable",
    "recycled",
    "upcycled",
    "repurposed",
    "reclaimed",
    "post-consumer",
    "pre-consumer",
    "recycled content",
    "glass",
    "metal",
    "aluminum",
    "steel",
    "tin",
    "copper",
    "brass",
    "iron",
  ];

  // Special case for common plastic product searches
  const plasticProducts = [
    "plastic bag",
    "plastic bags",
    "ziplock",
    "zipbag",
    "sandwich bag",
    "freezer bag",
    "plastic container",
    "plastic bottle",
    "storage bag",
    "garbage bag",
    "trash bag",
    "plastic wrap",
    "packaging",
    "plastic packaging",
  ];

  // Special case for biodegradable products
  const biodegradableProducts = [
    "biodegradable bag",
    "compostable bag",
    "eco-friendly bag",
    "paper bag",
    "cloth bag",
    "canvas bag",
    "jute bag",
    "cotton bag",
    "reusable bag",
    "bamboo products",
    "wooden utensils",
    "bamboo utensils",
    "natural cleaning products",
    "sustainable packaging",
    "plant-based packaging",
  ];

  // Special case for recyclable products
  const recyclableProducts = [
    "recycled paper",
    "recycled packaging",
    "recycled plastic",
    "recycled materials",
    "recycled glass",
    "recycled metal",
    "recycled fabric",
    "recycled content",
    "glass container",
    "metal container",
    "recycled products",
    "recyclable packaging",
    "refillable container",
    "reusable packaging",
    "zero waste packaging",
  ];

  const fullText = (productElement.textContent || "").toLowerCase();
  const productTitle = (title || "").toLowerCase();

  // Check if this is explicitly a plastic product
  const isProbablyPlasticProduct = plasticProducts.some(
    (term) => fullText.includes(term) || productTitle.includes(term)
  );

  // Check if this is explicitly a biodegradable product
  const isProbablyBiodegradableProduct = biodegradableProducts.some(
    (term) => fullText.includes(term) || productTitle.includes(term)
  );

  // Check if this is explicitly a recyclable product
  const isProbablyRecyclableProduct = recyclableProducts.some(
    (term) => fullText.includes(term) || productTitle.includes(term)
  );

  if (isProbablyPlasticProduct) {
    console.log(
      "Product identified as likely plastic product based on keywords"
    );

    // If it's likely a plastic product but we haven't detected specific plastics,
    // add generic "plastic" to the detected list
    if (!plasticTerms.some((term) => fullText.includes(term))) {
      plasticsDetected.push("plastic");
    }
  }

  if (isProbablyBiodegradableProduct) {
    console.log(
      "Product identified as likely biodegradable product based on keywords"
    );

    // If it's likely a biodegradable product but we haven't detected specific materials,
    // add generic "biodegradable" to the detected list
    if (!biodegradableTerms.some((term) => fullText.includes(term))) {
      biodegradableDetected.push("biodegradable");
    }
  }

  if (isProbablyRecyclableProduct) {
    console.log(
      "Product identified as likely recyclable product based on keywords"
    );

    // If it's likely a recyclable product but we haven't detected specific materials,
    // add generic "recyclable" to the detected list
    if (!recyclableTerms.some((term) => fullText.includes(term))) {
      recyclableDetected.push("recyclable");
    }
  }

  // Check for specific plastic terms
  plasticTerms.forEach((term) => {
    if (fullText.includes(term) && !plasticsDetected.includes(term)) {
      plasticsDetected.push(term);
    }
  });

  // Check for specific biodegradable terms
  biodegradableTerms.forEach((term) => {
    if (fullText.includes(term) && !biodegradableDetected.includes(term)) {
      biodegradableDetected.push(term);
    }
  });

  // Check for specific recyclable terms
  recyclableTerms.forEach((term) => {
    if (fullText.includes(term) && !recyclableDetected.includes(term)) {
      recyclableDetected.push(term);
    }
  });

  // Default for typical plastic products by type
  if (
    (productTitle.includes("bag") &&
      !fullText.includes("paper") &&
      !fullText.includes("fabric") &&
      !fullText.includes("cotton")) ||
    (productTitle.includes("storage") && fullText.includes("zipper"))
  ) {
    if (!plasticsDetected.includes("plastic")) {
      plasticsDetected.push("plastic");
      console.log("Added default 'plastic' material for bag product");
    }
  }

  // Extract eco-friendly claims
  const ecoFriendlyClaims = [];
  const ecoFriendlyTerms = [
    "eco-friendly",
    "environmentally friendly",
    "sustainable",
    "renewable",
    "green",
    "zero waste",
    "plastic-free",
    "eco-conscious",
    "earth-friendly",
    "carbon neutral",
    "low impact",
    "non-toxic",
    "chemical-free",
    "natural",
  ];

  ecoFriendlyTerms.forEach((term) => {
    if (fullText.includes(term) && !ecoFriendlyClaims.includes(term)) {
      ecoFriendlyClaims.push(term);
    }
  });

  // Combine all text for material detection
  const combinedText = [
    title,
    description,
    materialInfo,
    featuresText,
    additionalText,
  ]
    .filter((text) => text.trim().length > 0)
    .join(" ");

  // Fallback to full text if we didn't get enough info
  if (combinedText.trim().length < 50) {
    console.log("Using fallback text extraction");
    return {
      text: productElement.textContent || "",
      plasticsDetected: plasticsDetected,
      biodegradableDetected: biodegradableDetected,
      recyclableDetected: recyclableDetected,
      ecoFriendlyClaims: ecoFriendlyClaims,
      title: title || "",
      isProbablyPlasticProduct,
      isProbablyBiodegradableProduct,
      isProbablyRecyclableProduct,
    };
  }

  return {
    title,
    description,
    materialInfo,
    featuresText,
    additionalText,
    plasticsDetected,
    biodegradableDetected,
    recyclableDetected,
    ecoFriendlyClaims,
    isProbablyPlasticProduct,
    isProbablyBiodegradableProduct,
    isProbablyRecyclableProduct,
    text: combinedText,
  };
}

// Main scraping function
function scrapeProducts() {
  const productElements = getProductElements();
  console.log(`Scraping ${productElements.length} products`);

  return productElements.map((element) => {
    try {
      return {
        element,
        info: extractProductInfo(element),
      };
    } catch (error) {
      console.error("Error scraping product:", error);
      return {
        element,
        info: { text: element.textContent || "" },
      };
    }
  });
}

// Export the API
window.eco3RScraper = {
  identifySite,
  getProductElements,
  extractProductInfo,
  scrapeProducts,
};

// Export for ES modules if supported
if (typeof exports !== "undefined") {
  exports.identifySite = identifySite;
  exports.getProductElements = getProductElements;
  exports.extractProductInfo = extractProductInfo;
  exports.scrapeProducts = scrapeProducts;
}
