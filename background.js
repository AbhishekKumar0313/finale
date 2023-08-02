
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { command: "filterImages" });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.command === "processImages") {
    // Filtering logic and sending "processImages" message to content script
    const tabId = sender.tab.id;
    chrome.tabs.sendMessage(tabId, {
      command: "processImages",
      images: request.images,
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "removeImages") {
    const imageSources = request.images;
    const images = Array.from(
      document.querySelectorAll(`img[src^="${imageSources}"]`)
    );
    for (const img of images) {
      const parentElement = img.parentElement;
      if (parentElement) {
        parentElement.removeChild(img);
      }
    }
  }
});
