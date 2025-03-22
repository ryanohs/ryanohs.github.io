let canvas, ctx, canvasImageData, mouseX, mouseY;

export function setupCanvas(width, height) {
    console.log(`Setting up canvas with dimensions: ${width}x${height}`);

    // Get the canvas element
    canvas = document.getElementById('myCanvas');
    if (!canvas) {
        // Create canvas if it doesn't exist
        canvas = document.createElement('canvas');
        canvas.id = 'myCanvas';
        document.body.appendChild(canvas);
    }

    // Set dimensions
    canvas.width = width;
    canvas.height = height;

    // Get context and create ImageData
    ctx = canvas.getContext('2d');
    canvasImageData = ctx.createImageData(width, height);

    function updateCoordinates(eventX, eventY) {
        const rect = canvas.getBoundingClientRect();
        mouseX = Math.floor(eventX - rect.left);
        mouseY = Math.floor(eventY - rect.top);
    }

    // Mouse event for desktop
    canvas.addEventListener('mousemove', (event) => {
        updateCoordinates(event.clientX, event.clientY);
    });

    // Touch events for mobile
    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault(); // Prevents scrolling while drawing
        const touch = event.touches[0];
        updateCoordinates(touch.clientX, touch.clientY);
    });

    // Add touch start event to capture initial touch
    canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        updateCoordinates(touch.clientX, touch.clientY);
    });

    console.log("Canvas setup complete");
}

export function updateCanvasImage(imageData, width, height) {
    // Copy the byte array to the ImageData object
    const data = new Uint8ClampedArray(imageData);
    canvasImageData.data.set(data);

    // Draw the ImageData to the canvas
    ctx.putImageData(canvasImageData, 0, 0);
}

export function requestAnimationFrame() {
    window.requestAnimationFrame(async () => {
        try {
            const exports = await getDotNetExports();
            if (exports && exports.MyClass && typeof exports.MyClass.RenderFrame === 'function') {
                exports.MyClass.RenderFrame();
            } else {
                console.log("Waiting for .NET exports to be ready...");
                // Try again on next frame if not ready
                requestAnimationFrame();
            }
        } catch (error) {
            console.error("Error accessing .NET exports:", error);
            // Retry after a short delay
            setTimeout(() => requestAnimationFrame(), 100);
        }
    });
}

export function getMousePosition() {
    return [mouseX, mouseY];
}

// Helper function to get .NET exports
async function getDotNetExports() {
    if (!window.getDotnetConfig || !window.getDotnetExports) {
        return null;
    }

    try {
        const config = window.getDotnetConfig();
        return await window.getDotnetExports(config.mainAssemblyName);
    } catch (error) {
        console.error("Error getting .NET exports:", error);
        return null;
    }
}