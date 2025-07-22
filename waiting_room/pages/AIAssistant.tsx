import React, { useState } from "react";
import { Bot, Brain, MessageSquare, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AIAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">AI Health Assistant</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant answers to your health questions from our AI-powered
              assistant. Ask about symptoms, conditions, treatments, or general
              health advice.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Brain className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold mb-1">Smart Analysis</h3>
                <p className="text-xs text-muted-foreground">
                  AI-powered responses based on medical knowledge
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <MessageSquare className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold mb-1">24/7 Available</h3>
                <p className="text-xs text-muted-foreground">
                  Get health guidance anytime, anywhere
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <AlertTriangle className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <h3 className="font-semibold mb-1">Emergency Guidance</h3>
                <p className="text-xs text-muted-foreground">
                  Know when to seek immediate medical care
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This AI assistant provides general
              health information and should not replace professional medical
              advice, diagnosis, or treatment. Always consult with qualified
              healthcare providers for medical concerns.
            </AlertDescription>
          </Alert>

          {/* Botpress Chat */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 h-[600px]">
              
            </CardContent>
          </Card>

          {/* Emergency Notice */}
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">
                    Medical Emergency?
                  </h4>
                  <p className="text-sm text-red-800 mb-3">
                    If you're experiencing a medical emergency such as severe
                    chest pain, difficulty breathing, loss of consciousness, or
                    severe injury, don't use this chat. Call 911 immediately.
                  </p>
                  <Badge variant="destructive" className="text-xs">
                    Emergency: Call 911
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
