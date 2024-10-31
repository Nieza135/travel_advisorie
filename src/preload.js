// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Define any methods or variables you want to expose here
});
