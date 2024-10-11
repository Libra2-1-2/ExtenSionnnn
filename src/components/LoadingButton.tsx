import React from "react";
import { FaSpinner } from "react-icons/fa";

// Định nghĩa kiểu props
interface LoadingButtonProps {
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, onClick, children }) => {
  return (
    <button onClick={onClick} disabled={loading} style={styles.button}>
      {loading ? (
        <FaSpinner style={styles.spinner} />
      ) : (
        children
      )}
    </button>
  );
};

const styles = {
  button: {
    padding: "7px 13px",
    fontSize: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#266f15",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  spinner: {
    fontSize: "16px",
    animation: "spin 1s linear infinite",
  },
};

export default LoadingButton;
