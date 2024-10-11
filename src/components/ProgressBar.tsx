import "../css/ProgressBar.css";
import React, { useEffect, useState } from "react";
import ScanDomain from "./ScanDomain";
import ScanIP from "./ScanIP";
import ScanURL from "./ScanURL";
import FileScan from "./ScanFile";
import Advice from "./Advise";
import ModalComponent from "./Modal";
import ScanHistory from "./ScanHistory";

function ProgressBar() {
  const [alarms, setAlarms] = useState<chrome.alarms.Alarm[]>([]);
  useEffect(() => {
    async function setAlarm() {
      let allAlarms = await chrome.alarms.getAll();
      if (!allAlarms) allAlarms = [];
      setAlarms(allAlarms);
    }
    setAlarm();
  }, []);
  const [activeTab, setActiveTab] = useState("scandomain");
  const [showModal, setShowModal] = useState(false);
  const [contentSec, setContentSec] = useState("");
  const [sourceScan, setSourceScan] = useState("");
  const handleClick_btnSolution = (tab:string, content: string, source: string) => {
    setActiveTab(tab);
    setContentSec(content);
    setSourceScan(source);
  }
  const tabs = [
    {
      id: "scandomain",
      label: "ScanDomain",
      component: <ScanDomain setBackTab={handleClick_btnSolution} />,
    },
    {
      id: "scanip",
      label: "Scan IP",
      component: <ScanIP setBackTab={handleClick_btnSolution} />,
    },
    {
      id: "scanURL",
      label: "Scan URL",
      component: <ScanURL setBackTab={handleClick_btnSolution} />,
    },
    { id: "scanFile", label: "Scan File", component: <FileScan setBackTab={handleClick_btnSolution} /> },
    { id: "advise", label: "Advise", component: <Advice contentSec={contentSec} sourceScan={sourceScan} /> },
    { id: "scanHistory", label: "History Scan", component: <ScanHistory /> },
  ];

  const handleShowModal = () => {
    setShowModal(!showModal);
  };



  // Hàm để thay đổi tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setContentSec("");
    setSourceScan("");
  };
  return (
    <div>
      <div className="header">
        <span className="title">Scan VirusTotal</span>
        <div
          id="i-menu"
          title="Settings"
          className="icon"
          onClick={handleShowModal}
        >
          <svg viewBox="0 0 512 512" className="">
            <path d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 01-14.832 2.254l-42.584-24.595a191.577 191.577 0 01-60.759 35.13v49.182a12.01 12.01 0 01-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 01-60.759-35.13l-42.584 24.595a12.016 12.016 0 01-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 010-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0114.832-2.254l42.584 24.595a191.577 191.577 0 0160.759-35.13V25.759a12.01 12.01 0 019.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0160.759 35.13l42.584-24.595a12.016 12.016 0 0114.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 010 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"></path>
          </svg>
        </div>
        {showModal && <ModalComponent onCloseModal={handleShowModal} />}
      </div>
      <div className="tab-container">
        <div className="tab-container-left" style={{ display: "flex", flexDirection: "column", padding: "10px 0 10px 10px", border: "1px solid #ccc" }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className="tab-container-right" style={{ flex: "1 1 0%", padding: "10px 10px 10px 0" }}>
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
