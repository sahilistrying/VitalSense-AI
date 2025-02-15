import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/health";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className={cn("flex flex-col h-[600px] max-w-2xl w-full mx-auto", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Health AI Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask me about your symptoms, health concerns, or general health
          questions.
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 px-6 min-h-0 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">
                  Welcome to Health AI Assistant
                </h3>
                <p className="text-sm text-muted-foreground">
                  I'm here to help answer your health questions and provide
                  guidance. You can ask me about symptoms, conditions, or
                  general health advice.
                </p>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p>Try asking:</p>
                  <ul className="space-y-1">
                    <li>• "What could cause chest pain?"</li>
                    <li>• "Should I be concerned about my headaches?"</li>
                    <li>• "What are the symptoms of flu?"</li>
                  </ul>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {format(new Date(message.timestamp), "h:mm a")}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your health concerns..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-2">
            This AI assistant provides general health information and should not
            replace professional medical advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
