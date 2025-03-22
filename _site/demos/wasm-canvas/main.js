import { dotnet } from './_framework/dotnet.js'
import * as canvasFunctions from './canvas.js';
import {getMousePosition} from "./canvas.js";

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

// Make the config and exports available globally for the canvas.js file
window.getDotnetConfig = () => config;
window.getDotnetExports = getAssemblyExports;

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

setModuleImports('main.js', {
    window: {
        location: {
            href: () => globalThis.window.location.href
        }
    }
});

setModuleImports('canvas.js', {
    setupCanvas: canvasFunctions.setupCanvas,
    updateCanvasImage: canvasFunctions.updateCanvasImage,
    requestAnimationFrame: canvasFunctions.requestAnimationFrame,
    getMousePosition: canvasFunctions.getMousePosition
});

// Initial greeting
const text = exports.MyClass.Greeting();
console.log(text);
document.getElementById('out').innerHTML = text;

// Initialize the canvas
exports.MyClass.InitializeCanvas();

await dotnet.run();