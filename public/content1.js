
console.log("Content script has been injected successfully.");
(function() {
    const fileExtensions = [
        '.pdf', '.zip', '.rar', '.7z', '.tar', '.gz',    // Nén
        '.doc', '.docx', '.xlsx', '.pptx', '.txt',        // Tài liệu
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.tiff', '.webp',  // Hình ảnh
        '.mp4', '.mkv', '.webm', '.avi', '.mov', '.flv', '.wmv',  // Video
        '.mp3', '.wav', '.flac', '.aac', '.ogg',          // Âm thanh
        '.exe', '.msi', '.bat', '.sh', '.dmg'             // Tệp thực thi
    ];

    // Giám sát fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        const url = response.url;
        if (fileExtensions.some(ext => url.endsWith(ext))) {
            console.log(`File detected via fetch: ${url}`);
            chrome.runtime.sendMessage({ fileUrl: url });
        }
        return response;
    };

    // Giám sát XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        if (fileExtensions.some(ext => url.endsWith(ext))) {
            console.log(`File detected via XMLHttpRequest: ${url}`);
            chrome.runtime.sendMessage({ fileUrl: url });
        }
        return originalXHR.apply(this, args);
    };
})();
