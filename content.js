

const script = document.createElement("script");

script.src = src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
script.onload = () => {
 
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.command === "filterImages") {
      const images = Array.from(document.getElementsByTagName("img"));
      const imageSources = images.map((img) => img.src);
      chrome.runtime.sendMessage({
        command: "processImages",
        images: images,
      });
    }
  });

  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    if (request.command === "processImages") {
      const images = request.images;
      const filteredImages = [];
      alert("df");
      const model = await tf.loadGraphModel("D:/finale/model/model.json");
    
      for (const imageSrc of images) {
        const imgElement = document.createElement("img");
        imgElement.src = imageSrc;

        const img = tf.browser.fromPixels(imgElement).expandDims(0).div(255);
        const prediction = model.predict(img);
        const predictedClass = prediction.argMax(1).dataSync()[0];
        if (prediction[0][0] > 0.5) {
          filteredImages.push(imageSrc);
        }
      }

      chrome.runtime.sendMessage({
        command: "removeImages",
        images: filteredImages,
      });
    }
  });
};


document.head.appendChild(script);