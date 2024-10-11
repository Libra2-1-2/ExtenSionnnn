import React, { useState } from "react";
import { ScanFile } from "../apis/api";
import "../css/ScanFile.css";
import LoadingButton from "./LoadingButton";
function FileScan({ setBackTab }: { setBackTab: any }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>();
  const [password, setPassword] = useState<any>("");
  const [isFileZip, setIsFileZip] = useState(false);
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileName = file.name
      const isZipFile1 = fileName.endsWith('.zip');
      setIsFileZip(isZipFile1)
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file first.");
      return;
    }
    setLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (password) {
      formData.append("password", password);
    }
    const response = await ScanFile(formData);
    response.FileName = selectedFile?.name;
    setResults(response);
    setLoading(false);
  };
  const handleBackToAdviseTab = (content:any, engine_name: string) => {
    setBackTab("advise", content, engine_name);
  };

  return (
    <div className="component-a">
      <h1 className="title">Scan File</h1>
      <div className="input-group" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            style={{
              cursor: "pointer",
              padding: "10px 20px",
              border: "1px solid #2e4a6f",
              borderRadius: "5px",
              
            }}
          >
            Choose file
          </label>
          {selectedFile && <p style={{marginLeft: 10}}>Selected file: {selectedFile?.name}</p>}
        </div>
      </div>
      <div style={{justifyContent: "center", display: "flex"}}>
        {
          isFileZip && 
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password .zip"
            style={{ width: 170, marginRight: 5, height: 25 }}
          />

        }
        <div
          className={`scan-button`}
        >
          <LoadingButton loading={loading} onClick={() => handleFileUpload()}>
            {loading ? "Scanning..." : "Scan"}
          </LoadingButton>
        </div> 


      </div>

      {results && (
        <div>
          <h2 className="recent-scans-title">Scan Results</h2>
          <div className="scan-results">
            <div className="domain-info-container">
              <div className="row row-cols">
                <div style={{ flex: 5, borderRadius: 8, border: "1px solid" }}>
                  <div className="row">
                    <div
                      className={
                        results.ScanSummary.detections > 0
                          ? "text-danger text-vendor"
                          : "text-vendor"
                      }
                    >
                      {results.ScanSummary.detections}/
                      {results.ScanSummary.totalScans} security vendor flagged
                      this file as malicious
                    </div>
                  </div>
                  <div className="row row-cols">
                    <div className="col">
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        {" "}
                        <strong>Sha256:</strong> {results.Sha256}
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        <strong>FileName:</strong> {results.FileName}
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                          paddingLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        <strong>FileSize:</strong> {results.FileSize}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-content table-container" style={{ marginTop: 10 }}>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileScan;
