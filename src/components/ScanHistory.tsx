import React, { useEffect, useState } from 'react';

interface ScanHistoryItem {
    timestamp: string;
    type: string;
    content: string;
    result: string;
    isMalicious: boolean
}

function ScanHistory() {
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchScanHistory() {
            try {
                const data: any = await new Promise((resolve, reject) => {
                    if (!chrome.storage || !chrome.storage.local) {
                        reject(new Error('Chrome storage API is not available.'));
                        return;
                    }
                    chrome.storage.local.get(['scanHistory'], (result) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(result);
                        }
                    });
                });

                const scanHistory = data.scanHistory || {};
                setHistory(Object.values(scanHistory));
            } catch (err: any) {
                console.error('Error fetching scan history:', err);
                setError(err.message);
            }
        }

        fetchScanHistory();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="tab-content table-container" style={{marginTop: 16}}>
            <table id="custom-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Content</th>
                        <th>Result</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            
                            <td>{item.type}</td>
                            <td>{item.content}</td>
                            <td>{item.isMalicious ? "Malicious": "Harmless"}</td>
                            <td>{item.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default ScanHistory;
