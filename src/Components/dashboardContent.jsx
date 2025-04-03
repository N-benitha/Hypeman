import React from 'react'
import './dashboardContent.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const DashboardContent = () => {
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;
    
        await fetch("http://localhost:3000/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text })
        });
      };

  return (
    <div className="dashboardChat">
        <div className="texts">
            <div className="logo">
                <img src="#" alt="logo" />
                <h1>HypeMan</h1>
            </div>

            <div className="options">
                <div className="option">
                    <img src="#" alt="first" />
                    <span>Create a New Chat</span>
                </div>

                <div className="option">
                    <img src="#" alt="second" />
                    <span>Analyze Images</span>
                </div>

                <div className="option">
                    <img src="#" alt="third" />
                    <span>Help with my Code</span>
                </div>

            </div>
        </div>

        <div className="formContainer">
            <form onSubmit={handleSubmit}>
                <input type="text" name="text" placeholder='Ask me anything...' />
                <button>
                    <FontAwesomeIcon icon={faArrowUp} style={{color:'white'}}/>
                </button>
            </form>
        </div>
    </div>
  )
}

export default DashboardContent