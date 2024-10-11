document.getElementById('confirmYes').addEventListener('click', function() {
    console.log('Yes clicked, sending message to background...');

    // Gửi thông điệp và chờ phản hồi trước khi đóng popup
    chrome.runtime.sendMessage({ action: 'continueDownload' }, function(response) {
        console.log('Response from background:', response);
        // Đóng popup sau khi nhận được phản hồi từ background
        window.close();
    });
});

document.getElementById('confirmClose').addEventListener('click', function() {
    console.log('Close clicked, closing popup');
    window.close();
});
