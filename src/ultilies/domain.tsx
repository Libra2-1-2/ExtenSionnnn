import React from 'react';
type ScanResult = {
    detected: boolean;
    result: string | null;
    category: string;
};

type VirusTotalResponse = {
    last_analysis_results: Record<string, ScanResult>;
    domain_siblings?: string[];
    last_dns_records?: { value: string; ttl: number }[];
    whois?: string;
    reputation?: number;
    categories?: any;
    registrar?: any;
    popularity_ranks?: any;
    last_analysis_stats?: any;
    total_votes?: any;
};

type Props = {
    response: VirusTotalResponse;
};

export function getResultScanDomain(response: VirusTotalResponse){
    const getReputationMessage = (reputation: number | undefined) => {
        if (reputation === undefined) return 'Chưa có đánh giá uy tín.';
        if (reputation > 0) return `Tên miền có uy tín cao (${reputation}).`;
        if (reputation < 0) return `Tên miền có uy tín thấp (${reputation}).`;
        return 'Tên miền không có uy tín.';
    };

    const getScansSummary = (scans: Record<string, ScanResult>) => {
        const totalScans = Object.keys(scans).length;
        const detections = Object.values(scans).filter(scan => !(scan.result == "clean" || scan.result == "unrated" || scan.result == null)).length;
        return {
            totalScans,
            detections
        };
    };

    const getDnsInfo = (dnsRecords: { value: string; ttl: number }[] | undefined) => {
        if (!dnsRecords || dnsRecords.length === 0) return 'Không có thông tin DNS.';
        return dnsRecords;
    };

    const getWhoisInfo = (whois: string | undefined) => {
        if (!whois) return 'Không có thông tin WHOIS.';
        return whois;
    };

    const isMalicious = (stats: any ) => {
        return stats == null ? false : stats.malicious > 0;
    }

    const getContentSec = (scans: Record<string, ScanResult>) => {
        return Object.values(scans).filter(scan => !(scan.result == "clean" || scan.result == "unrated")).map(x => x.result).join(";");
    };

    return {
        Reputation: response.reputation,
        ReputationMessage: getReputationMessage(response.reputation),
        ScanSummary : getScansSummary(response.last_analysis_results),
        LastAnalysisResults: response.last_analysis_results,
        DNSInfo: getDnsInfo(response.last_dns_records),
        WHOIS: getWhoisInfo(response.whois),
        DomainName: "",
        Categorires: response.categories,
        PopularityRank: response.popularity_ranks,
        LastAnalysisStarts: response.last_analysis_stats,
        TotalVotes: response.total_votes,
        Registrar: response.registrar,
        IsMalicious: isMalicious(response.last_analysis_stats),
        ContentSec: getContentSec(response.last_analysis_results)
    }
}

export function getResultVote(response: any){
    if (!response) return;
    const harmless:any = response.filter((x: any) => x.attributes.verdict == "harmless");
    const malicious:any = response.filter((x: any) => x.attributes.verdict == "malicious");
    debugger
    return [
        {
            verdict : "harmless",
            value: harmless.length
        },
        {
            verdict : "malicious",
            value: malicious.length
        }
    ];
}


export function getResultComment(response: any){
    if (!response) return;
    return response.map((x:any) => x.attributes);
}


//#region  IP

type VirusTotalIPResponse = {
    last_analysis_results: Record<string, ScanResult>;
    domain_siblings?: string[];
    last_dns_records?: { value: string; ttl: number }[];
    whois?: string;
    reputation?: number;
    categories?: any;
    registrar?: any;
    popularity_ranks?: any;
    last_analysis_stats?: any;
    total_votes?: any;
    as_owner?: any;
    regional_internet_registry?: any;
    country?: any;
    network?: any;
    asn?: any;
    continent?: any;
};
export function getResultIPDomain(response: VirusTotalIPResponse){
    const getReputationMessage = (reputation: number | undefined) => {
        if (reputation === undefined) return 'Chưa có đánh giá uy tín.';
        if (reputation > 0) return `Tên miền có uy tín cao (${reputation}).`;
        if (reputation < 0) return `Tên miền có uy tín thấp (${reputation}).`;
        return 'Tên miền không có uy tín.';
    };

    const getScansSummary = (scans: Record<string, ScanResult>) => {
        const totalScans = Object.keys(scans).length;
        const detections = Object.values(scans).filter(scan => !(scan.result == "clean" || scan.result == "unrated")).length;
        return {
            totalScans,
            detections
        };
    };

    const getDnsInfo = (dnsRecords: { value: string; ttl: number }[] | undefined) => {
        if (!dnsRecords || dnsRecords.length === 0) return 'Không có thông tin DNS.';
        return dnsRecords;
    };

    const getWhoisInfo = (whois: string | undefined) => {
        if (!whois) return 'Không có thông tin WHOIS.';
        return whois;
    };
    const isMalicious = (stats: any ) => {
        return stats == null ? false : stats.malicious > 0;
    }

    const getContentSec = (scans: Record<string, ScanResult>) => {
        return Object.values(scans).filter(scan => !(scan.result == "clean" || scan.result == "unrated")).map(x => x.result).join(";");
    };
    return {
        Reputation: response.reputation,
        ReputationMessage: getReputationMessage(response.reputation),
        ScanSummary : getScansSummary(response.last_analysis_results),
        LastAnalysisResults: response.last_analysis_results,
        DNSInfo: getDnsInfo(response.last_dns_records),
        WHOIS: getWhoisInfo(response.whois),
        Categorires: response.categories,
        PopularityRank: response.popularity_ranks,
        LastAnalysisStarts: response.last_analysis_stats,
        TotalVotes: response.total_votes,
        Registrar: response.registrar,
        AsOwner: response.as_owner,
        Regional: response.regional_internet_registry,
        Country: response.country?.toLowerCase(),
        IPAddress: "",
        Network: response.network,
        ASN: response.asn,
        Continent: response.continent,
        IsMalicious: isMalicious(response.last_analysis_stats),
        ContentSec: getContentSec(response.last_analysis_results)
    }
}




//#endregion



//#region File
export function getResultFile(response: any){

    const getScansSummary = (scans: Record<string, ScanResult>) => {
        const totalScans = Object.keys(scans).length;
        const detections = Object.values(scans).filter(scan => (scan.category == "malicious")).length;
        return {
            totalScans,
            detections
        };
    };
    const isMalicious = (stats: any ) => {
        return stats == null ? false : stats.malicious > 0;
    }

    const getContentSec = (scans: Record<string, ScanResult>) => {
        return Object.values(scans).filter(scan => !(scan.category == "clean" || scan.category == "unrated")).map(x => x.result).join(";");
    };
    return {
        ScanSummary : getScansSummary(response?.data.attributes.results),
        LastAnalysisResults: response?.data.attributes.results,
        Stats: response?.data.attributes.stats,
        Sha256: response?.meta.file_info.sha256,
        FileName: '',
        FileSize: response?.meta.file_info.size,
        IsMalicious: isMalicious(response?.data.attributes.stats),
        ContentSec: getContentSec(response?.data.attributes.results)
    }
} 
//#endregion


//#region URL
export function getResultURL(response: any){
    const isMalicious = (stats: any ) => {
        return stats == null ? false : stats.malicious > 0;
    }

    const getScansSummary = (scans: Record<string, ScanResult>) => {
        const totalScans = Object.keys(scans).length;
        const detections = Object.values(scans).filter(scan => !(scan.result == "clean" || scan.result == "unrated")).length;
        return {
            totalScans,
            detections
        };
    };
    const getReputationMessage = (reputation: number | undefined) => {
        if (reputation === undefined) return 'Chưa có đánh giá uy tín.';
        if (reputation > 0) return `Tên miền có uy tín cao (${reputation}).`;
        if (reputation < 0) return `Tên miền có uy tín thấp (${reputation}).`;
        return 'Tên miền không có uy tín.';
    };

    const getContentSec = (scans: Record<string, ScanResult>) => {
        return Object.values(scans).filter(scan => !(scan.result == "clean" || scan.result == "unrated")).map(x => x.result).join(";");
    };

    return {
        LastAnalysisResults: response?.attributes.last_analysis_results,
        IsMalicious: isMalicious(response?.attributes.last_analysis_stats),
        Stats: response?.attributes.stats,
        ScanSummary : getScansSummary(response?.attributes.last_analysis_results),
        Categorires: response?.attributes.categories,
        Reputation: response?.attributes.reputation,
        ReputationMessage: getReputationMessage(response?.attributes.reputation),
        PopularityRank: response?.attributes.popularity_ranks || {},
        LastAnalysisStarts: response?.attributes.last_analysis_stats,
        IDUrl: response?.id,
        ContentSec: getContentSec(response?.attributes.last_analysis_stats)
    }
}
//#endregion