import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  MapPin,
  History,
  Bot,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HistoryItem } from "@/components/HistoryItem";
import { useHealth } from "@/context/HealthContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { BotpressChatInitializer } from "@/components/BotpressChatInitializer";
import { HealthHistory } from "@/types/health";

const quickActions = [
  {
    title: "Check Symptoms",
    description: "Select your symptoms and get AI-powered health insights",
    icon: Stethoscope,
    href: "/symptoms",
    color: "bg-blue-500",
  },
  {
    title: "AI Assistant",
    description: "Chat with our AI for personalized health guidance",
    icon: Bot,
    color: "bg-purple-500",
  },
  {
    title: "Health History",
    description: "View your past consultations and track your health",
    icon: History,
    href: "/history",
    color: "bg-orange-500",
  },
];

const healthTips = [
  {
    title: "Stay Hydrated",
    tip: "Drink at least 8 glasses of water daily to maintain optimal health.",
    icon: "💧",
  },
  {
    title: "Regular Exercise",
    tip: "Aim for 30 minutes of moderate exercise at least 5 days a week.",
    icon: "🏃‍♀️",
  },
  {
    title: "Healthy Sleep",
    tip: "Get 7-9 hours of quality sleep each night for better recovery.",
    icon: "😴",
  },
  {
    title: "Balanced Diet",
    tip: "Include fruits, vegetables, lean proteins, and whole grains in your meals.",
    icon: "🥗",
  },
];

export const Dashboard: React.FC = () => {
  const { healthHistory } = useHealth();
  const { user, isAuthenticated } = useAuth();

  // Function to open the Botpress chat widget
  const handleOpenBotpressChat = () => {
    if (window.botpress) {
      window.botpress.open();
    } else {
      console.warn("Botpress not initialized yet. Please try again.");
    }
  };

  // Filter out empty or invalid history items
  const validHistory = healthHistory.filter(
    (item: HealthHistory) =>
      (item.type === "symptom_check" && item.disease) ||
      (item.type === "chat" && item.symptoms && item.symptoms.length > 0)
  );
  // Sort by timestamp descending (latest first)
  const recentHistory = [...validHistory]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  // Filter health history for statistics
  const emergencyCases = validHistory.filter(
    (h: HealthHistory) => h.type === 'symptom_check' && h.triage && h.triage.toLowerCase() === 'emergency'
  ).length;

  const followUpsNeeded = validHistory.filter(
    (h: HealthHistory) => h.type === 'symptom_check' && h.followUp?.required && !h.followUp.completed
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* BotpressChatInitializer will inject the script and initialize Botpress once */}
      <BotpressChatInitializer />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome
                {isAuthenticated && user
                  ? `, ${user.firstName}`
                  : " to Your Care"}
              </h1>
              <p className="text-muted-foreground">
                {isAuthenticated
                  ? "Your personal health companion for better wellness"
                  : "Start your wellness journey by creating an account or signing in"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
            </div>
            {healthHistory.length > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{healthHistory.length} consultations completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return action.title === "AI Assistant" ? (
                // This card will now trigger the floating widget directly
                <Card
                  key={index}
                  className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
                  onClick={handleOpenBotpressChat} // Call function to open floating chat
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Other cards remain as Links
                <Link key={index} to={action.href}>
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Health History */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Activity</h2>
              {healthHistory.length > 0 && (
                <Link to="/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              )}
            </div>

            {recentHistory.length > 0 ? (
              <div className="space-y-4">
                {recentHistory.map((item) => (
                  <HistoryItem key={item.id} historyItem={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No health records yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start by checking your symptoms or chatting with our AI
                    assistant
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link to="/symptoms">
                      <Button>Check Symptoms</Button>
                    </Link>
                    {/* This button will also open the floating chat */}
                    <Button
                      variant="outline"
                      onClick={handleOpenBotpressChat} // Call function to open floating chat
                    >
                      AI Assistant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Health Tips & Stats */}
          <div className="space-y-6">
            {/* Health Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span>AI Consultations:</span>
                  </div>
                  <span className="font-medium">
                    {healthHistory.filter((h: HealthHistory) => h.type === 'chat').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span>Symptom Checks:</span>
                  </div>
                  <span className="font-medium">
                    {healthHistory.filter((h: HealthHistory) => h.type === 'symptom_check').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Emergency Cases:</span>
                  </div>
                  <span className="font-medium text-red-600">
                    {emergencyCases}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Follow-ups Needed:</span>
                  </div>
                  <span className="font-medium text-orange-600">
                    {followUpsNeeded}
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* Health Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Health Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {healthTips.map((tip, index) => (
                    <li key={index}>
                      <span className="font-medium text-foreground">
                        {tip.icon} {tip.title}:
                      </span>{" "}
                      {tip.tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
