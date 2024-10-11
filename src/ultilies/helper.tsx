import { ScanFile } from "../apis/api";

export async function getSettings() {
	const { settings } = await chrome.storage.sync.get(["settings"]);
	return settings as Settings;
}

export function getDomain(url:string) {
    const a = document.createElement('a');
    a.href = url;
    return a.hostname;
}

export function encodeURL(url:string) {
	let encodedURL = btoa(url);
	encodedURL = encodedURL.replace(/\+/g, '-').replace(/\//g, '_');
	encodedURL = encodedURL.replace(/=+$/, '');
	return encodedURL;
}

export function getFileBlob(downloadId: any) {
    return new Promise((resolve, reject) => {
        chrome.downloads.search({ id: downloadId }, function(items) {
            if (items && items[0]) {
                const fileURL = items[0].url;

                fetch(fileURL)
                    .then(response => response.blob())
                    .then(blob => resolve(blob))
                    .catch(err => reject(err));
            } else {
                reject(new Error('Download item not found.'));
            }
        });
    });
}

export function getFileBlobWithURL(fileURL: any) {
    return new Promise((resolve, reject) => {
        if (fileURL) {
            console.log("step 0");
            fetch(fileURL)
                .then(response => response.blob())
                .then(blob => resolve(blob))
                .catch(err => reject(err));
        } else {
            reject(new Error('Download item not found.'));
        }
    });
}

export async function handleDownload(downloadItem: any) {
    // Get the file's data using the downloadId
    const fileBlob = await getFileBlob(downloadItem.id);

    // Create a FormData object to upload the file
    const formData = new FormData();
	if (!(fileBlob instanceof Blob)) {
        console.error("Invalid fileBlob:", fileBlob);
        return { isSafe: false };
    }
    formData.append('file', fileBlob);
    try {
		const result = await ScanFile(formData);
        
		if (result.IsMalicious){
			return {
				isSafe : true
			} 
		};
		return { isSafe : false};
    } catch (err) {
        console.error("File scan failed:", err);
        return { isSafe: true };
    }
}

export async function handleDownloadV2(fileURL: any) {
    // Get the file's data using the downloadId
    const fileBlob = await getFileBlobWithURL(fileURL);

    // Create a FormData object to upload the file
    const formData = new FormData();
	if (!(fileBlob instanceof Blob)) {
        console.error("Invalid fileBlob:", fileBlob);
        return { isSafe: false };
    }
    formData.append('file', fileBlob);
    try {
		const result = await ScanFile(formData);
		if (!result.IsMalicious){
			return {
				isSafe : true
			} 
		};
		return { isSafe : false};
    } catch (err) {
        console.error("File scan failed:", err);
        return { isSafe: true };
    }
}

export function showNotification(message: string) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: "icon_48.png",
        title: 'File Scan Status', 
        message: message,
        priority: 2
    });
}

export function showWarningPopup(namePopup: string) {
    chrome.windows.getCurrent({}, (window:any) => {
        const screenWidth:any = window.width;
        const screenHeight:any = window.height;
        const popupWidth = 400;
        const popupHeight = 200;

        const left = Math.round((screenWidth - popupWidth) / 2 + window.left);
        const top = Math.round((screenHeight - popupHeight) / 2 + window.top);

        chrome.windows.create({
            url: chrome.runtime.getURL(namePopup),
            type: 'popup',
            width: popupWidth,
            height: popupHeight,
            left: left,
            top: top
        }, (popupWindow: any) => {
            chrome.runtime.onMessage.addListener(function (message) {
                if (message.action === 'closePopup') {
                    chrome.windows.remove(popupWindow.id);
                }
            });
        });
    });
}

export async function getTests() {
	const { VTtests } = await chrome.storage.sync.get(["VTtests"]);
	return VTtests as VTtest[];
}


export function saveScanResult(type: any, content: any, result: any) {
    const currentTime = new Date();
    const timestamp = currentTime.toISOString();
    const expirationTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000).toISOString();
    const scanData = { type, content, result, timestamp, expirationTime, isMalicious : result.IsMalicious };
    const key = `${type}:${content}`;

    chrome.storage.local.get(['scanHistory'], (data) => {
        const scanHistory = data.scanHistory || {};
        scanHistory[key] = scanData;
        chrome.storage.local.set({ scanHistory });
    });
}

export function loadScanHistory() {
    chrome.storage.local.get(['scanHistory'], (data) => {
        const scanHistory = data.scanHistory || {};
    });
}


export function removeScans(type: any, content: any) {
    chrome.storage.local.get(['scanHistory'], (data) => {
        const scanHistory = data.scanHistory || {};
        const key = `${type}:${content}`; 
        delete scanHistory[key];
        chrome.storage.local.set({ scanHistory });
    });
}

export async function checkScanHistory(type: any, content: any) {
    const currentTime = new Date().getTime();
    const key = `${type}:${content}`;

    // Wrap chrome.storage.get in a function that uses await
    const data: any = await new Promise((resolve) => {
        chrome.storage.local.get(['scanHistory'], (result) => {
            resolve(result);
        });
    });

    const scanHistory = data.scanHistory || {};

    if (scanHistory[key]) {
        const expirationTime = new Date(scanHistory[key].expirationTime).getTime();
        if (currentTime <= expirationTime) {
            return scanHistory[key].result;
        } else {
            removeScans(type, content); // Remove expired scans
        }
    }

    return null;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function setApiKey(apiKey: string) {
    const newSettings: Settings = {
        apikey: apiKey
    };
    chrome.storage.sync.set({ settings: newSettings });
}