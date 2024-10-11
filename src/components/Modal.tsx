import React, { useState, useEffect } from "react";
import "../css/Modal.css";
import "react-circular-progressbar/dist/styles.css";
import { getSettings, setApiKey } from "../ultilies/helper";

const ModalComponent = ({
  id,
  className,
  header,
  body,
  footer,
  onCloseModal,
}: any) => {
  const [apiKey, setAPIKey] = useState("");
  const closeCustomModal = () => {
    onCloseModal();
  };
  useEffect(() => {
		async function getDataStorage() {
			const settings = await getSettings();
			setAPIKey(settings.apikey);

		}
		getDataStorage();
	}, []);
  const handleSubmit = function(){
    setApiKey(apiKey);
    closeCustomModal();
  }

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={closeCustomModal}>
            &times;
          </span>
          <h4 style={{ margin: "0px", textAlign: "start" }}>Settings</h4>
        </div>

        <div className="modal-body">
          <div className="input-group" style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter API key"
              style={{ padding: "10px" }}
              value={apiKey}
              onChange={(e) => setAPIKey(e.target.value)}
            />
            <div 
            onClick={handleSubmit}
            className="scan-button" style={{ padding: "4px 10px" }}>
              Submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
