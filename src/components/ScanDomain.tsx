import React, { useState, useEffect } from "react";
import "../css/ScanDomain.css"; // Đảm bảo bạn đã tạo file CSS này
import {
  getDomainReport,
  GetVotes,
  GetComment,
  PostComment,
} from "../apis/api";
import Vote from "./Vote";
import LoadingButton from "./LoadingButton";

const ScanDomain = ({ setBackTab }: { setBackTab: any }) => {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>();
  const [activeTab, setActiveTab] = useState(1);
  const [votes, setVotes] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState("");
  const handleScan = async (domain1: any) => {
    setLoading(true);
    setResults(null);
    try {
      const response = await getDomainReport(domain1);
      setResults(response);
    } catch (error) {
      console.error("Error during scan:", error);
    }
    setLoading(false);
  };
  const formatTimestamp = (timestamp: any) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // Format as local date string
  };
  const getReputationColor = (reputation: any) => {
    if (reputation <= 20) return "red"; // Tín nhiệm thấp
    if (reputation <= 70) return "#bd8235"; // Tín nhiệm trung bình
    return "green"; // Tín nhiệm cao
  };

  const getVotes = async () => {
    const response = await GetVotes(domain);
    setVotes(response || []);
  };

  const getComments = async () => {
    const reponse = await GetComment(domain);
    setComments(reponse || []);
  };
  const handleCommentSubmit = async () => {
    try {
      await PostComment(domain, newComment);
      setNewComment("");
      getComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleBackToAdviseTab = (content:any, engine_name: string) => {
    setBackTab("advise", content, engine_name);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        setDomain(domain);
        handleScan(domain);
      }
    });
  }, []);

  return (
    <div className="component-a">
      <div className="input-group align-center">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain"
        />
        <div
          className={`scan-button`}
        >
          <LoadingButton loading={loading} onClick={() => handleScan(domain)}>
            {loading ? "Scanning..." : "Scan"}
          </LoadingButton>
        </div> 


      </div>
      {results && (
        <div>
          <h2 className="recent-scans-title">Scan Results</h2>
          <div className="scan-results">
            <div className="domain-info-container">
              <div className="row row-cols" style={{marginBottom: 10}}>
                <div style={{ width: 174, flex: 1,display: "flex", alignItems: "center" }}>
                  <Vote
                    type={"domain"}
                    content={domain}
                    value={results.ScanSummary.detections}
                    total={results.ScanSummary.totalScans}
                  />
                </div>
                <div
                  style={{
                    marginLeft: 10,
                    flex: 5,
                    borderRadius: 8,
                    border: "1px solid",
                  }}
                >
                  <div className="row">
                    <div
                      className={
                        results.ScanSummary.detections > 0
                          ? "text-danger text-vendor"
                          : "text-white text-vendor"
                      }
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M11.997 16.63c.22 0 .404-.073.55-.217a.738.738 0 0 0 .22-.548.751.751 0 0 0-.217-.55.738.738 0 0 0-.547-.22.751.751 0 0 0-.55.217.737.737 0 0 0-.22.548.75.75 0 0 0 .764.77Zm-.686-3.553h1.399v-5.92h-1.4v5.92Zm.691 8.221a9.05 9.05 0 0 1-3.626-.733 9.395 9.395 0 0 1-2.954-1.99 9.407 9.407 0 0 1-1.988-2.951 9.034 9.034 0 0 1-.732-3.622 9.05 9.05 0 0 1 .733-3.626 9.394 9.394 0 0 1 1.99-2.954 9.406 9.406 0 0 1 2.951-1.988 9.034 9.034 0 0 1 3.622-.732 9.05 9.05 0 0 1 3.626.733 9.394 9.394 0 0 1 2.954 1.99 9.406 9.406 0 0 1 1.988 2.951 9.034 9.034 0 0 1 .732 3.622 9.05 9.05 0 0 1-.733 3.626 9.394 9.394 0 0 1-1.99 2.954 9.405 9.405 0 0 1-2.951 1.988 9.033 9.033 0 0 1-3.622.732ZM12 19.9c2.198 0 4.064-.767 5.598-2.3 1.534-1.534 2.301-3.4 2.301-5.599 0-2.198-.767-4.064-2.3-5.598C16.064 4.868 14.198 4.1 12 4.1c-2.198 0-4.064.767-5.598 2.3C4.868 7.936 4.1 9.802 4.1 12c0 2.198.767 4.064 2.3 5.598C7.936 19.132 9.802 19.9 12 19.9Z"></path>
                        </svg>
                      </span>
                      {results.ScanSummary.detections}/
                      {results.ScanSummary.totalScans} security vendor flagged
                      this domain as malicious
                    </div>
                  </div>
                  <div
                    className="row row-cols"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="col">
                      <strong>Domain Name:</strong> {results.DomainName}
                    </div>
                    <div className="col">
                      <strong>Registrar:</strong> {results.Registrar}
                    </div>
                    <div
                      className="col"
                      style={{ color: getReputationColor(results.Reputation) }}
                    >
                      <strong>Reputation:</strong> {results.Reputation}
                    </div>
                  </div>

                  <div className="row-flex">
                    {Object.values(results.Categorires).map(
                      (tag: any, index: number) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="tabs tab-container">
                <div
                  className={activeTab === 1 ? "tab-item active" : "tab-item"}
                  onClick={() => setActiveTab(1)}
                >
                  Detection
                </div>
                <div
                  className={activeTab === 2 ? "tab-item active" : "tab-item"}
                  onClick={() => setActiveTab(2)}
                >
                  Details
                </div>
                <div
                  className={activeTab === 3 ? "tab-item active" : "tab-item"}
                  onClick={() => {
                    setActiveTab(3);
                    getVotes();
                    getComments();
                  }}
                >
                  Community
                </div>
                  {/* { 
                    results.IsMalicious &&                 
                    <div
                      className={`btn-solution`}
                      onClick={() => handleBackToAdviseTab()}
                      
                    >
                      {"Solution"}
                    </div>                    
                  } */}
              </div>
              <div className="tab-content table-container">
                {activeTab === 1 && (
                  <table id="custom-table">
                    <thead>
                      <tr>
                        <th>Engine Name</th>
                        <th>Category</th>
                        <th>Result</th>
                        <th>Solution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(results.LastAnalysisResults).map(
                        (item: any, index: number) => (
                          <tr key={index}>
                            <td>{item.engine_name}</td>
                            <td className={
                              item.category == "malicious"
                                ? "text-danger"
                                : item.category == "suspicious"
                                  ? ""
                                  : ""
                            }>{item.category}</td>
                            <td
                              className={
                                item.category == "malicious"
                                  ? "text-danger"
                                  : item.category == "suspicious"
                                    ? ""
                                    : ""
                              }
                            >
                              {item.result}
                            </td>                         
                            <td>
                              {
                                item.category == "malicious"
                                ?                              
                                <div
                                    className={`btn-solution`}
                                    onClick={() => handleBackToAdviseTab(item.result, item.engine_name)}
                                    
                                  >
                                    {"Solution"}
                                  </div>  
                                : ""
                              }

                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
                {activeTab === 2 && (
                  <div className="details">
                    <div className="detail-block">
                      <strong className="detail-title">Categories</strong>
                      <hr />
                      <div className="key-value-list">
                        {Object.entries(results.Categorires).map(
                          (item: any, i) => (
                            <div key={i} className="key-value-row">
                              <div className="key" style={{ flex: 1 }}>
                                {item[0]}
                              </div>
                              <div className="value" style={{ flex: 1 }}>
                                {item[1]}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="detail-block">
                      <strong className="detail-title">Popularity ranks</strong>
                      <hr />
                      <table id="custom-table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Position</th>
                            <th>Ingestion Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(results.PopularityRank).map(
                            (item: any, i) => (
                              <tr key={i}>
                                <td>{item[0]}</td>
                                <td>{item[1].rank}</td>
                                <td>{formatTimestamp(item[1].timestamp)}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      {/* <div className="key-value-list">
                        <div className="key-value-row header">
                          <div className="key">Rank</div>
                          <div className="key">Position</div>
                          <div className="key">Ingestion Time</div>
                        </div>
                        {Object.entries(results.PopularityRank).map(
                          (item: any, i) => (
                            <div key={i} className="key-value-row">
                              <div className="value">{item[0]}</div>
                              <div className="value">{item[1].rank}</div>
                              <div className="value">
                                {formatTimestamp(item[1].timestamp)}
                              </div>
                            </div>
                          )
                        )}
                      </div> */}
                    </div>
                  </div>
                )}
                {activeTab === 3 && (
                  <div className="details">
                    <div className="detail-block">
                      <strong className="detail-title">Votes</strong>
                      <hr />
                      <div className="vote-list">
                        {votes.map((item: any) => (
                          <span
                            key={item.date}
                            style={{
                              padding: 4,
                              borderRadius: 8,
                              border: "1px solid grey",
                            }}
                          >
                            {item.verdict}: {item.value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="comments-section">
                      <strong className="detail-title">Comments</strong>
                      <hr />
                      <div className="comments-list">
                        {comments.map((comment: any, index: any) => (
                          <div key={index} className="comment-item">
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-date">{formatTimestamp(comment.date)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="add-comment">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="comment-input"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          onClick={handleCommentSubmit}
                          className="comment-button"
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanDomain;
