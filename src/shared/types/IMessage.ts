interface Message {
  messageId: string;
  sender: "driver" | "user";
  content: string;
  timestamp: string;
  type: "text" | "image";
  fileUrl?: string;
  reactions: { emoji: string; sender: string }[];
}

export type {Message}