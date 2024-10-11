import { handleDownloadV2,getFileBlob, showWarningPopup, handleDownload, showNotification } from "../ultilies/helper";
import { GetScanURLV2 } from "../apis/api";


// install, update, active
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "downloadWithTool",
        title: "Download with Tool",
        contexts: ["link", "image", "video", "audio", "page"]
    });
	chrome.storage.sync.set({
		settings: {
			apikey:  process.env.APP_APIKEY ?? ""
		},
	});
	// giữ background luôn chạy
	chrome.alarms.create('keepAlive', { periodInMinutes: 1 });
});
let isScannedFromContextMenu = false; 
let pendingDownloadUrl:any = null;
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    isScannedFromContextMenu = false;
    if (info.menuItemId === "downloadWithTool") {
        const fileUrl =  info.srcUrl ? info.srcUrl : info.linkUrl;
        showNotification("Scanning file...");

        try {
            const scanResult = await handleDownloadV2(fileUrl);
            if (scanResult.isSafe) {
				isScannedFromContextMenu = true;
                chrome.downloads.download({ url: fileUrl || "" });
                showNotification("File is safe. Downloading...");
            } else {
                isScannedFromContextMenu = true;
                pendingDownloadUrl = fileUrl;  // Lưu lại URL của file
                // Hiển thị cảnh báo nếu file không an toàn
                showWarningPopup("popupconfirm.html");
            }
        } catch (error) {
            showWarningPopup("warning.html");
        }
    }
});


chrome.downloads.onDeterminingFilename.addListener(async (downloadItem, suggest) => {
	if (isScannedFromContextMenu) {
        // Đặt lại cờ sau khi đã xử lý
        isScannedFromContextMenu = false;
        suggest();  // Tiếp tục tải file mà không quét lại
        return;
    }
    // Trigger scan when the user clicks "Save"
	showNotification('Scanning file...');
	const scanResult = await handleDownload(downloadItem);
    if (scanResult.isSafe) {
		showWarningPopup("successURL.html"); 
    } else {
        showWarningPopup("warning.html");
    }
});

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'keepAlive') {
        console.log('Service Worker is alive');
    }
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const response = await GetScanURLV2(tab.url);
        if (response?.IsMalicious){
            showWarningPopup("warningURL.html")
        }else {
			showNotification("URL is safe");
		}
    }
});

  

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in background:', message);
    if (message.action === 'continueDownload' && pendingDownloadUrl) {
		isScannedFromContextMenu = true;
        // Người dùng đã chọn tiếp tục tải xuống
        chrome.downloads.download({ url: pendingDownloadUrl });
        pendingDownloadUrl = null;  // Reset lại sau khi đã tải
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in background:', message);
    if (message.action === 'continueDownload' && pendingDownloadUrl) {
        chrome.downloads.download({ url: pendingDownloadUrl });
        pendingDownloadUrl = null;  // Reset lại sau khi đã tải
        sendResponse({ status: 'Download continued' });
    } else {
        sendResponse({ status: 'No download to continue' });
    }
    return true; // Đảm bảo hàm có thể gửi phản hồi không đồng bộ
});
