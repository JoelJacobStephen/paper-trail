import { cn } from "@/lib/utils";
import { Message } from "ai";
import React from "react";

type Props = {
  messages: Message[];
};

const MessageList = ({ messages }: Props) => {
  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", {
            "justify-end pl-10": message.role === "user",
            "justify-start pr-10": message.role === "assistant",
          })}
        >
          <div
            className={cn(
              "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/100",
              {
                "bg-blue-600 text-white": message.role === "user",
                "bg-slate-200": message.role === "assistant",
              }
            )}
          ></div>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
