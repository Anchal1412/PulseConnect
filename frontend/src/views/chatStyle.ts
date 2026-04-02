import { SxProps } from "@mui/joy/styles/types";

export const container: SxProps = {
  display: "flex",
  height: "100%",
  flex: 1,
  bgcolor: "#e5ddd5",
};

export const chatWrapper: SxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export const usersBar: SxProps = {
  p: 1,
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
  bgcolor: "#f0f0f0",
};

export const messagesContainer: SxProps = {
  flex: 1,
  overflowY: "auto",
  p: 2,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
};

export const messageRow = (isMe: boolean): SxProps => ({
  display: "flex",
  justifyContent: isMe ? "flex-end" : "flex-start",
});

export const systemMessageStyle: SxProps = {
  textAlign: "center",
  width: "100%",
};

export const messageStyle = (isMe: boolean): SxProps => ({
  p: 1.5,
  borderRadius: "lg",
  maxWidth: "60%",
  bgcolor: isMe ? "#25d366" : "#fff",
  color: "#000",
});
