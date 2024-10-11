import React, { useState, useEffect } from "react";
import "../css/ScanURL.css"; // Đảm bảo bạn đã tạo file CSS này
import {
  getDomainReport,
  GetVotesURL,
  GetCommentURL,
  PostCommentURL,
  getIP,
  GetScanURLV2,
  GetScanURL,
} from "../apis/api";
import Vote from "./Vote";
import { getDomain } from "../ultilies/helper";
import LoadingButton from "./LoadingButton";
const ScanURL = ({ setBackTab }: { setBackTab: any }) => {
  const [url, setURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>();
  const [activeTab, setActiveTab] = useState(1);
  const [votes, setVotes] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState("");
  const [idURL, setIDURL] = useState("");
  const handleScan = async (url: any) => {
    setLoading(true);
    setResults(null);
    try {
      const response = await GetScanURLV2(url);
      if (response) {
        setResults(response);
        setIDURL(response.IDUrl);
      }
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
    const response = await GetVotesURL(idURL);
    setVotes(response || []);
  };

  const getComments = async () => {
    const reponse = await GetCommentURL(idURL);
    setComments(reponse || []);
  };
  const handleCommentSubmit = async () => {
    try {
      await PostCommentURL(idURL, newComment);
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
        setURL(tabs[0].url);
        handleScan(tabs[0].url);
      }
    });
  }, []);

  return (
    <div className="component-a">
      <div className="input-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="Enter URL"
        />
        <div
          className={`scan-button`}
        >
          <LoadingButton loading={loading} onClick={() => handleScan(url)}>
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
                    type={"url"}
                    content={idURL}
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
                      this URL as malicious
                    </div>
                  </div>
                  <div
                    className="row row-cols"
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div className="col" style={{ flex: 5 }}>
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                          wordBreak: "break-all",
                        }}
                      >
                        {url}
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        {getDomain(url)}
                      </div>
                      <div className="row-flex" style={{ marginTop: 5 }}>
                        {Object.values(results.Categorires).map(
                          (tag: any, index: number) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          )
                        )}
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
                        <th>Solution</th>
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

export default ScanURL;
