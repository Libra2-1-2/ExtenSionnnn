import React, { useState, useEffect } from "react";
import "../css/ScanIP.css"; // Đảm bảo bạn đã tạo file CSS này
import {
  getIPReport,
  GetVotesIP,
  GetCommentIP,
  PostCommentIP,
  getIP,
} from "../apis/api";
import Vote from "./Vote";
import LoadingButton from "./LoadingButton";
const ScanIP = ({ setBackTab }: { setBackTab: any }) => {
  const [ip, setIP] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>();
  const [activeTab, setActiveTab] = useState(1);
  const [votes, setVotes] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState("");
  const handleScan = async (ipaddress: any) => {
    setLoading(true);
    setResults(null);
    try {
      const response = await getIPReport(ipaddress);
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
    const response = await GetVotesIP(ip);
    setVotes(response || []);
  };

  const getComments = async () => {
    const reponse = await GetCommentIP(ip);
    setComments(reponse || []);
  };
  const handleCommentSubmit = async () => {
    try {
      await PostCommentIP(ip, newComment);
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
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        const ipaddress = await getIP(domain);
        setIP(ipaddress);
        handleScan(ipaddress);
      }
    });
  }, []);

  return (
    <div className="component-a">
      <div className="input-group">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIP(e.target.value)}
          placeholder="Enter ipaddress"
        />
        <div
          className={`scan-button`}
        >
          <LoadingButton loading={loading} onClick={() => handleScan(ip)}>
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
                    type={"ip_addresses"}
                    content={ip}
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
                          : "text-vendor"
                      }
                    >
                      {results.ScanSummary.detections}/
                      {results.ScanSummary.totalScans} security vendors flagged
                      this IP address as malicious
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
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        {results.IPAddress} ({results.Network})
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        AS {results.ASN} ({results.AsOwner})
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        Country
                        <img
                          style={{ marginLeft: 10 }}
                          id="flag"
                          loading="lazy"
                          width="24"
                          src={`https://storage.googleapis.com/vtcdn/assets/png/flags/${results.Country}.png`}
                        />
                      </div>
                    </div>
                    <div
                      className="col"
                      style={{ color: getReputationColor(results.Reputation) }}
                    >
                      <strong>Reputation:</strong> {results.Reputation}
                    </div>
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
                      className={`scan-button`}
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
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(results.LastAnalysisResults).map(
                        (item: any, index: number) => (
                          <tr key={index}>
                            <td>{item.engine_name}</td>
                            <td
                              className={
                                item.result !== "clean" &&
                                item.result !== "unrated"
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              {item.category}
                            </td>
                            <td
                              className={
                                item.result !== "clean" &&
                                item.result !== "unrated"
                                  ? "text-danger"
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
                      <strong className="detail-title">Basic Properties</strong>
                      <hr />
                      <div className="key-value-list">
                        <div style={{ display: "flex" }}>
                          <div>
                            <strong>Network : </strong>
                          </div>
                          <div>{results.Network}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div>
                            <strong>Autonomous System Number : </strong>
                          </div>
                          <div>{results.ASN}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div>
                            <strong>Autonomous System Label : </strong>
                          </div>
                          <div>{results.AsOwner}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div>
                            <strong>Regional Internet Registry : </strong>
                          </div>
                          <div>{results.Regional}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div>
                            <strong>Country : </strong>
                          </div>
                          <div>{results.Country}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div>
                            <strong>Continent : </strong>
                          </div>
                          <div>{results.Continent}</div>
                        </div>
                      </div>
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
                              marginRight: 4,
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
                            <div className="comment-date">
                              {formatTimestamp(comment.date)}
                            </div>
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

export default ScanIP;
