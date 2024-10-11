import { callAPIVirusTotal } from "./baseApi";
const baseUrl = "https://www.virustotal.com/api/v3";

import { getResultScanDomain, getResultVote, getResultComment,
    getResultIPDomain, getResultFile, getResultURL
 } from "../ultilies/domain";
import { saveScanResult, checkScanHistory, encodeURL, sleep } from "../ultilies/helper";
//#region common
const DOMAIN = "DOMAIN";
const ADDRESS = "ADDRESS";
const URL = "URL";
const FILE = "FILE" ;


export async function getIP(domain: string){
    const response = await fetch(`https://api.ipify.org?domain=${domain}&format=json`);
    const data = await response.json();
    const ip = data.ip;
    return ip;
}

export async function GetAnalyses(id:string) {
    const url = `${baseUrl}/analyses/${id}`;
    const response = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    return response;
}

//#endregion


//#region Domain
export async function getDomainReport (domain: string) {
    const cache = await checkScanHistory(DOMAIN, domain);
    if (cache != null){
        return cache;
    }
    const url = `${baseUrl}/domains/${domain}`;
    const {data} = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    const { attributes } = data;
    const result = getResultScanDomain(attributes);
    result.DomainName = data.id;
    saveScanResult(DOMAIN, domain, result);
    return result;
};

export async function GetVotes(domain:string) {
    const url = `${baseUrl}/domains/${domain}/votes`;
    const {data} = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    return getResultVote(data);
}

export async function GetComment(domain:string) {
    const url = `${baseUrl}/domains/${domain}/comments?limit=40`;
    const {data} = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    return getResultComment(data);
}

export async function PostComment(domain: string , comment: string) {
    const url = `${baseUrl}/domains/${domain}/comments`;
    const param: any = {
        data : {
            type: "comment",
            attributes: {
                text: comment
            }
        }
    }
    await callAPIVirusTotal(url, { method: "POST", data: param , contentType: "application/json"});
    return true;
}

export async function PostVote(domain: string , vote: string) {
    const url = `${baseUrl}/domains/${domain}/votes`;
    const param: any = {
        data : {
            type: "vote",
            attributes: {
                verdict: vote // harmless - malicious
            }
        }
    }
    await callAPIVirusTotal(url, { method: "POST", data: param, contentType: "application/json" });
    return true;
}

//#endregion


//#region IP
export async function getIPReport (ip: string) {
    const cache = await checkScanHistory(ADDRESS, ip);
    if (cache != null){
        return cache;
    }
    const url = `${baseUrl}/ip_addresses/${ip}`;
    const {data} = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    const { attributes } = data;
    const result = getResultIPDomain(attributes);
    result.IPAddress = ip;
    saveScanResult(ADDRESS, ip, result);
    return result;
};

export async function GetCommentIP(ipaddress:string) {
    const url = `${baseUrl}/ip_addresses/${ipaddress}/comments?limit=40`;
    const {data} = await callAPIVirusTotal(url, { method: "GET" , contentType: "application/json"});
    return getResultComment(data);
}

export async function PostCommentIP(ipaddress: string , comment: string) {
    const url = `${baseUrl}/ip_addresses/${ipaddress}/comments`;
    const param: any = {
        data : {
            type: "comment",
            attributes: {
                text: comment
            }
        }
    }
    await callAPIVirusTotal(url, { method: "POST", data: param, contentType: "application/json" });
    return true;
}

export async function GetVotesIP(ipaddress:string) {
    const url = `${baseUrl}/ip_addresses/${ipaddress}/votes`;
    const {data} = await callAPIVirusTotal(url, { method: "GET" , contentType: "application/json"});
    return getResultVote(data);
}

export async function PostVoteIP(ipaddress: string , vote: string) {
    const url = `${baseUrl}/ip_addresses/${ipaddress}/votes`;
    const param: any = {
        data : {
            type: "vote",
            attributes: {
                verdict: vote // harmless - malicious
            }
        }
    }
    await callAPIVirusTotal(url, { method: "POST", data: param , contentType: "application/json"});
    return true;
}

//#endregion

//#region  URL

export async function GetScanURL(urlParam: string){
    const cache = await checkScanHistory(URL, urlParam);
    if (cache != null){
        return cache;
    }
    const url = `${baseUrl}/urls/${encodeURL(urlParam)}`;
    const {data} = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    const result = getResultURL(data);
    saveScanResult(URL, urlParam, result);
    return ;
}

export async function GetScanURLV2(urlParam: string){
    const cache = await checkScanHistory(URL, urlParam);
    if (cache != null){
        return cache;
    }
    const url = `${baseUrl}/search?query=${encodeURIComponent(urlParam)}`;
    const {data} = await callAPIVirusTotal(url, { method: "GET" , contentType: "application/json"});
    if (!data || data.length == 0) return null;
    const responseUrl = data.find((x: any) => x.type == "url");
    if (!responseUrl) return null;
    const result = getResultURL(responseUrl);
    saveScanResult(URL, urlParam, result);
    return result;
}




export async function GetVotesURL(urlParam:string) {
    const url = `${baseUrl}/urls/${urlParam}/votes?limit=10`;
    const {data} = await callAPIVirusTotal(url, { method: "GET" , contentType: "application/json"});
    return getResultVote(data);
}

export async function PostVoteURL(urlParam: string , vote: string) {
    const url = `${baseUrl}/urls/${urlParam}/votes`;
    const param: any = {
        data : {
            type: "vote",
            attributes: {
                verdict: vote // harmless - malicious
            }
        }
    }
    await callAPIVirusTotal(url, { method: "POST", data: param, contentType: "application/json" });
    return true;
}
export async function GetCommentURL(urlParam:string) {
    const url = `${baseUrl}/urls/${urlParam}/comments?limit=40`;
    const {data} = await callAPIVirusTotal(url, { method: "GET", contentType: "application/json" });
    return getResultComment(data);
}

export async function PostCommentURL(urlParam: string , comment: string) {
    const url = `${baseUrl}/urls/${urlParam}/comments`;
    const param: any = {
        data : {
            type: "comment",
            attributes: {
                text: comment
            }
        }
    }
    await callAPIVirusTotal(url, { method: "POST", data: param, contentType: "application/json" });
    return true;
}

//#endregion


//#region Scan file

export async function ScanFile(file: FormData) {
    const url = `${baseUrl}/files`;
    const { data } = await callAPIVirusTotal(url, {
        method: "POST",
        data: file
    });

    const cachedResult = await checkScanHistory(FILE, data.id);
    if (cachedResult != null) {
        console.log(cachedResult);
        return cachedResult;
    }

    let response;
    let attempts = 0;
    const maxAttempts = 10; 
    const delay = 15000; 

    while (attempts < maxAttempts) {
        response = await GetAnalyses(data.id);
        const  data1  = response.data;
        const { attributes } = data1;
        if (attributes.status === "completed") {
            break;
        }

        if (attributes.status === "queued" || attributes.status === "in-progress") {
            attempts++;
            console.log(`Attempt ${attempts}: Status is '${attributes.status}'. Retrying in ${delay / 1000} seconds...`);
            await sleep(delay);
        } else {
            console.error("Unexpected status:", attributes.status);
            throw new Error("Unexpected status during file analysis.");
        }
    }

    if (response){
        const data2 = response.data;
        const { attributes } = data2;
        if (attributes.status !== "queued" && attributes.status !== "in-progress") {
            const result = getResultFile(response);
            await saveScanResult(FILE, data.id, result);
            return result;
        }
    }
    return null;
}





//#endregion