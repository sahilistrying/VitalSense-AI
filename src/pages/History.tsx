import React, { useState } from "react";
import {
  Calendar,
  Download,
  Trash2,
  Filter,
  Search,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HistoryItem } from "@/components/HistoryItem";
import { useHealth } from "@/context/HealthContext";
import { HealthHistory } from "@/types/health";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { formatSymptomName } from "@/lib/healthUtils";

export const History: React.FC = () => {
  const { healthHistory, clearHistory } = useHealth();
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<HealthHistory | null>(
    null,
  );

  // Filter history based on search and filters
  const filteredHistory = healthHistory.filter((entry) => {
    const matchesSearch =
      searchTerm === "" ||
      (entry.disease && entry.disease.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.symptoms && entry.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesUrgency =
      urgencyFilter === "all" || entry.triage === urgencyFilter;

    let matchesDate = true;
    if (dateFilter && dateFilter !== "all") {
      const entryDate = new Date(entry.timestamp);
      const today = new Date();

      switch (dateFilter) {
        case "today":
          matchesDate =
            format(entryDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
          break;
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = isAfter(entryDate, weekAgo);
          break;
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = isAfter(entryDate, monthAgo);
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesUrgency && matchesDate;
  });

  // Statistics
  const stats = {
    total: healthHistory.length,
    thisMonth: healthHistory.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const monthAgo = new Date(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
      );
      return isAfter(entryDate, monthAgo);
    }).length,
    emergencies: healthHistory.filter(
      (entry) => entry.triage === "emergency",
    ).length,
    followUpsNeeded: healthHistory.filter(
      (entry) => entry.followUp?.required && !entry.followUp.completed,
    ).length,
  };

  const handleViewDetails = (entry: HealthHistory) => {
    setSelectedEntry(entry);
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all health history? This action cannot be undone.",
      )
    ) {
      clearHistory();
    }
  };

  const handleExportHistory = () => {
    const dataStr = JSON.stringify(healthHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `health-history-${format(new Date(), "yyyy-MM-dd")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Health History</h1>
              <p className="text-muted-foreground">
                Track your health consultations and monitor your wellness
                journey
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportHistory}
                disabled={healthHistory.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearHistory}
                disabled={healthHistory.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Consultations
                    </p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">{stats.thisMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Badge className="p-1 rounded-lg bg-red-500">!</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Emergency Cases
                    </p>
                    <p className="text-2xl font-bold">{stats.emergencies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Follow-ups Due
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.followUpsNeeded}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by condition or symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="All Urgency Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency Levels</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Consultation History ({filteredHistory.length})
                </h2>
              </div>

              {filteredHistory.map((entry) => (
                <HistoryItem
                  key={entry.id}
                  historyItem={entry}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                {healthHistory.length === 0 ? (
                  <>
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">
                      No health history yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start tracking your health by completing a symptom check
                      or consulting with our AI assistant.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => (window.location.href = "/symptoms")}
                      >
                        Check Symptoms
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/assistant")}
                      >
                        AI Assistant
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No results found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Try adjusting your search criteria or clearing filters.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setUrgencyFilter("all");
                        setDateFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Follow-up Reminders */}
          {stats.followUpsNeeded > 0 && (
            <Alert className="mt-6">
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                You have {stats.followUpsNeeded} follow-up appointment
                {stats.followUpsNeeded > 1 ? "s" : ""} that need to be
                scheduled. Check your consultation details for more information.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
