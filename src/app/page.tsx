"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [explanation, setExplanation] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;

  const trainingPrompt = [
    {
      parts: [
        {
          text: "Please act as a detailed code explainer. When I provide you with a piece of code, your task is to explain it thoroughly in a single, detailed response. Assume you are explaining to someone who is new to coding, so break down concepts step-by-step in simple terms. Avoid adding anything beyond the explanation itself. You can give 2-3 output examples as well while you explain the code. Also, if anything else is asked to you, (anything other than explanationn of code), like random questions, you cannot answer them. You just need to tell that you cannot answer such questions. Also, do not give anything in bold formatting when you respond.",
        },
      ],
      role: "user",
    },
    {
      parts: [
        {
          text: "okay",
        },
      ],
      role: "model",
    },
  ];

  const explainCode = async () => {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      API_KEY;

    const messageToSend = [
      ...trainingPrompt,
      {
        parts: [
          {
            text: code,
          },
        ],
        role: "user",
      },
    ];

    setIsSending(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messageToSend,
        }),
      });

      const resJson = await res.json();
      setIsSending(false);

      const responseMessage =
        resJson.candidates[0]?.content.parts[0]?.text || "No explanation found.";
      setExplanation(responseMessage);
    } catch (error) {
      setIsSending(false);
      console.error("Error explaining code:", error);
      setExplanation("An error occurred while generating the explanation.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        color: "white",
        overflow: "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: -1,
        }}
      />
      <div
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "8px",
          padding: "10px 20px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            margin: 0,
            background: "linear-gradient(90deg, #FAEBD7, #F0FFFF, #FAEBD7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI-Driven Code Analyzer
        </h1>
      </div>
      <div
        style={{
          width: "80%",
          maxWidth: "850px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 2.8)",
        }}
      >
        <p
          style={{
            marginBottom: "10px",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "10px 20px",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#fff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Input your code in the space provided, then press 'Explain Code' to analyze it.
        </p>
        <textarea
          style={{
            width: "100%",
            height: "500px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "16px",
            backgroundColor: "#f9f9f9",
            color: "#333",
            marginBottom: "20px",
            resize: "none",
          }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div>
          {explanation.length > 0 ? (
            <div
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <h2 style={{ color: "#333", fontSize: "1.2rem" }}>Explanation:</h2>
              <p style={{ color: "#555", whiteSpace: "pre-wrap" }}>{explanation}</p>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#fff", fontWeight: "bold" }}>
                Explanation will appear here...
              </p>
            </div>
          )}
        </div>
      </div>
      <button
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "white",
          background: isSending
            ? "linear-gradient(90deg, #ccc, #999)"
            : "linear-gradient(90deg, #1e90ff, #00bfff)",
          border: "none",
          borderRadius: "8px",
          cursor: isSending ? "not-allowed" : "pointer",
          transition: "background 0.3s",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
        onClick={isSending ? null : explainCode}
        disabled={isSending}
      >
        {isSending ? "Generating..." : "Explain Code"}
      </button>

      {isSending && (
        <div
          style={{
            marginTop: "20px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #1e90ff",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            animation: "spin 1s linear infinite",
          }}
        />
      )}

      {/* Provide Feedback Button */}
      <a
        href="https://forms.gle/QGVt1xN9HpiA9Npq6"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "white",
          background: "linear-gradient(90deg, #1e90ff, #00bfff)",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          textDecoration: "none",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        Give Feedback
      </a>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
