import React, { useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";
import { getChatGPTResponse } from "../apis/chatgptAPI";
import ChatMessage from "./ChatMessage";
import "../css/Advise.css";
import Avatar from "./Avatar";

const questions = [
  "Những biện pháp nào tôi có thể thực hiện để bảo vệ quyền riêng tư trực tuyến của mình?",
  "Làm thế nào để xác định và tránh các trang web giả mạo hoặc lừa đảo?",
  "GPT có thể giúp tôi phân tích và nhận diện các mối đe dọa trực tuyến như thế nào?",
  "Làm sao tôi có thể sử dụng GPT để đánh giá mức độ rủi ro của các tập tin hoặc liên kết trước khi mở chúng?",
  "Tôi nên làm gì để giảm thiểu rủi ro từ các cuộc tấn công mạng khi sử dụng mạng xã hội",
];

export type ChatType = "question" | "response";

export interface IChat {
  id: string;
  type: ChatType;
  message: string;
}

const ChatComponent = ({
  contentSec,
  sourceScan,
}: {
  contentSec: any;
  sourceScan: any;
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [chatHistory, setChatHistory] = useState<IChat[]>([]);

  useEffect(() => {
    console.log("contentSec", contentSec);
    const setContext = async () => {
      try {
        setLoading(true);
        const response = await getChatGPTResponse(
          `Bạn là một chuyên gia tư vấn về an ninh mạng và an toàn trực tuyến. 
        Nhiệm vụ của bạn là cung cấp lời khuyên chuyên sâu, phân tích mối đe dọa dựa trên dữ liệu cung cấp, 
        và hướng dẫn người dùng về các hành vi trực tuyến an toàn. 
        Hãy đưa ra các giải pháp và hướng dẫn cụ thể để giúp người dùng bảo vệ dữ liệu cá nhân, 
        phát hiện và tránh các mối đe dọa từ mạng, và duy trì các thói quen tốt khi sử dụng internet. Hãy trả lời toàn bộ các câu hỏi bằng tiếng Việt.`,
          "system"
        );
        setLoading(false);
        if (contentSec) {
          setLoading(true);
          handleContentSec(
            `After scanning I found that ${sourceScan} has a result of ${contentSec}, please tell me more about the specific symptoms of infection. Then please give me one or more measures with as detailed steps as possible for me to resolve ${sourceScan} has a result of ${contentSec}`
          );
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error setting context: ", error);
      }
    };

    setContext();
  }, []);

  const generateGuid = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleQuestionClick = (question: any) => {
    setShowQuestion(false);
    chatHistory.push({
      id: generateGuid(),
      type: "question",
      message: question,
    });
    setChatHistory([...chatHistory]);
    setSelectedQuestion(question);
    scrollToBottom("chat-container");

    handleChat(question);
  };

  const handleChat = async (input: any) => {
    try {
      setLoading(true);
      try {
        const response = await getChatGPTResponse(input, "user");
        chatHistory.push({
          id: generateGuid(),
          type: "response",
          message: response,
        });
      } catch (error: any) {
        chatHistory.push({
          id: generateGuid(),
          type: "response",
          message: error.message ?? error,
        });
      }
      setChatHistory([...chatHistory]);
      scrollToBottom("chat-container");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  };

  const scrollToBottom = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };
  const handleContentSec = (content: string) => {
    const question = content;
    if (question) {
      setShowQuestion(false);
      setUserInput("");
      chatHistory.push({
        id: generateGuid(),
        type: "question",
        message: question,
      });
      setChatHistory([...chatHistory]);
      handleChat(content);
      scrollToBottom("chat-container");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const question = userInput.trim();
    if (question) {
      setShowQuestion(false);
      setUserInput("");
      chatHistory.push({
        id: generateGuid(),
        type: "question",
        message: question,
      });
      setChatHistory([...chatHistory]);
      handleChat(userInput);
      scrollToBottom("chat-container");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        borderRadius: "10px",
        marginTop: 10,
      }}
    >
      <h2>ChatGPT Security Expert</h2>
      {showQuestion && (
        <div style={{ marginBottom: "20px" }}>
          <h4>Chọn một câu hỏi có sẵn:</h4>
          <ul className="list-question">
            {questions.map((question, index) => (
              <li key={index} className="question-item">
                <button
                  className="question-item-btn"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!showQuestion && (
        <div id="chat-container">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="chat-box">
              <Avatar type={chat.type} />
              <ChatMessage message={chat.message} />
            </div>
          ))}
          {loading && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <Circles color="#00BFFF" height={40} width={40} />
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="question-form">
        <textarea
          placeholder="Nhập câu hỏi của bạn..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="question-textarea"
        />
        <button className="btn-submit-question" type="submit">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
