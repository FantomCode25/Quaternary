document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const statusText = document.getElementById("status");
  const closeButton = document.getElementById("closeButton");
  const searchInput = document.getElementById("searchInput");

  // Load saved settings
  chrome.storage.local.get(["enabled"], function (result) {
    const enabled = result.enabled !== undefined ? result.enabled : false;
    toggleSwitch.checked = enabled;
    updateStatusDisplay(enabled);
  });

  // Toggle extension on/off
  toggleSwitch.addEventListener("change", function () {
    const enabled = toggleSwitch.checked;
    updateStatusDisplay(enabled);
    chrome.storage.local.set({ enabled: enabled });

    // Notify the active tab about the state change
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        try {
          chrome.tabs
            .sendMessage(tabs[0].id, {
              action: "toggleFilter",
              enabled: enabled,
            })
            .catch(() => {
              showNotification(
                "Please refresh the page to apply changes",
                "warning"
              );
            });
        } catch (error) {
          showNotification(
            "Please refresh the page to apply changes",
            "warning"
          );
        }
      }
    });
  });

  // Close button functionality
  closeButton.addEventListener("click", function () {
    window.close();
  });

  // Search input functionality
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const searchQuery = searchInput.value.trim();
      if (searchQuery) {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0]) {
              const currentUrl = new URL(tabs[0].url);
              const searchUrl = `${currentUrl.origin}/s?k=${encodeURIComponent(
                searchQuery + " eco-friendly"
              )}`;
              chrome.tabs.update(tabs[0].id, { url: searchUrl });
              window.close();
            }
          }
        );
      }
    }
  });

  function updateStatusDisplay(enabled) {
    if (enabled) {
      statusText.textContent = "ON";
      statusText.className = "status-on";
    } else {
      statusText.textContent = "OFF";
      statusText.className = "status-off";
    }
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${type === "success" ? "#2e7d32" : "#f57c00"};
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      z-index: 1000;
      text-align: center;
      min-width: 200px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 2000);
  }

  // Assuming you have a function to get product elements
  const products = document.querySelectorAll(
    '[data-component-type="s-search-result"]'
  ); // Update with actual selector

  products.forEach((product) => {
    // Create icon element
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("icons/logo.png"); // Path to your icon
    icon.style.cursor = "pointer";
    icon.style.width = "20px"; // Adjust size as needed
    icon.style.height = "20px";
    icon.style.position = "absolute";
    icon.style.top = "10px";
    icon.style.right = "10px";
    icon.style.zIndex = "100";
  });
});
