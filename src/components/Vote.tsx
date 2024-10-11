import "../css/Vote.css"
import React, { useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import { PostVoteURL, PostVote, PostVoteIP } from "../apis/api";
type Props = {
	type: any;
	content: any;
    value: any;
    total: any;
};
const Vote = (props: Props) => {
    const [isCloseSelected, setIsCloseSelected] = useState(false);
    const [isCheckSelected, setIsCheckSelected] = useState(false);

    const handleClick = async (action: any) => {
        let vote = "";
        if (action === 'close') {
            setIsCloseSelected(!isCloseSelected);
            setIsCheckSelected(false);
            vote = "malicious";
        } else if (action === 'check') {
            setIsCheckSelected(!isCheckSelected);
            setIsCloseSelected(false);
            vote = "harmless";
        }
        try {
            if (props.type == "ip_addresses"){
                await PostVoteIP(props.content, vote); 
            } else if (props.type == "domain"){
                await PostVote(props.content, vote); 
            } else if (props.type == "url"){
                await PostVoteURL(props.content, vote); 
            }
          
        } catch (error) {
          console.error('Error posting comment:', error);
        }
      };

    return (
        <div style={{ textAlign: 'center'}}>
            <div style={{height: 100,width: 100, paddingLeft: 42}}>
                <ProgressIndicator value={props.value} total={props.total} />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 5, marginLeft: 14 }}>
                <div>
                    <button 
                        onClick={() => handleClick('close')} 
                        className={`close-button ${isCloseSelected ? 'selected' : ''}`}
                        style={{ marginRight: '10px' }}>
                        X
                    </button>
                </div>
                <div className="score">Community Score</div>
                <div>
                    <button 
                        onClick={() => handleClick('check')}
                        className={`check-button ${isCheckSelected ? 'selected' : ''}`}>
                        ✓
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Vote;

