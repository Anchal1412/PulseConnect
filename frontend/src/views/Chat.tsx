import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Sheet, Typography, Chip, Textarea } from "@mui/joy";
import { ChatProps } from "../models/User";
import {
  chatWrapper,
  container,
  messageRow,
  messagesContainer,
  messageStyle,
  systemMessageStyle,
  usersBar,
} from "./chatStyle";



const Chat: React.FC<ChatProps> = ({
  socket,
  messages,
  setMessages,
  roomUsers,
  currentUser,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    socket?.emit("send_message", {
      roomId: "room1",
      message: inputMessage,
    });

    setInputMessage("");
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={container}>
      <Box sx={chatWrapper}>
        <Sheet sx={usersBar}>
          {roomUsers.map((user) => (
            <Chip
              key={user.userId}
              size="sm"
              variant={user.name === currentUser ? "solid" : "soft"}
              color={user.name === currentUser ? "success" : "primary"}
            >
              {user.name} {user.name === currentUser && "(You)"}
            </Chip>
          ))}
        </Sheet>

        <Box sx={messagesContainer}>
          {messages.length === 0 ? (
            <Typography textAlign="center">Start chating</Typography>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender === currentUser;

              return (
                <Box key={idx} sx={messageRow(isMe)}>
                  {msg.isSystemMessage ? (
                    <Typography level="body-xs" sx={systemMessageStyle}>
                      {msg.sender === currentUser
                        ? msg.action==="JOIN"
                          ? "You joined"
                          : msg.action==="LEAVE"
                            ? "You left"
                            : msg.message
                        : msg.message.replace("the room", "")}
                    </Typography>
                  ) : (
                    <Sheet sx={messageStyle(isMe)}>
                      {!isMe && (
                        <Typography level="body-xs" fontWeight="bold">
                          {msg.sender}
                        </Typography>
                      )}

                      <Typography>{msg.message}</Typography>
                      

                      <Typography
                        level="body-xs"
                        sx={{ textAlign: "right", opacity: 0.6 }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Sheet>
                  )}
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        
        <Sheet sx={{ p: 2, bgcolor: "#f0f0f0" }}>
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{ display: "flex", gap: 1 }}
          >
            <Textarea
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              minRows={1}
              maxRows={3}
              sx={{ flex: 1 }}
            />
            <Button type="submit" disabled={!inputMessage.trim()}>
              Send
            </Button>
          </Box>
        </Sheet>
      </Box>

    </Box>
  );
};

export default Chat;
