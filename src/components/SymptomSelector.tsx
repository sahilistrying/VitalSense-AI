import React, { useState, useEffect } from "react";
import { Check, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  symptoms,
  searchSymptoms,
  getSymptomsPage,
  getTotalPages,
} from "@/data/symptoms";
import { Symptom } from "@/data/symptoms";
import { cn } from "@/lib/utils";

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  onNext: () => void;
}

const SYMPTOMS_PER_PAGE = 50;

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
  onNext,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredSymptoms, setFilteredSymptoms] = useState<Symptom[]>([]);
  const [displayedSymptoms, setDisplayedSymptoms] = useState<Symptom[]>([]);

  // Update filtered symptoms when search term changes
  useEffect(() => {
    const filtered = searchSymptoms(searchTerm);
    setFilteredSymptoms(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm]);

  // Update displayed symptoms when filtered symptoms or page changes
  useEffect(() => {
    if (searchTerm.trim()) {
      // When searching, show all results (no pagination)
      setDisplayedSymptoms(filteredSymptoms.slice(0, 100)); // Limit to 100 for performance
    } else {
      // When not searching, use pagination
      const pageSymptoms = getSymptomsPage(currentPage, SYMPTOMS_PER_PAGE);
      setDisplayedSymptoms(pageSymptoms);
    }
  }, [filteredSymptoms, currentPage, searchTerm]);

  const totalPages = searchTerm.trim() ? 1 : getTotalPages(SYMPTOMS_PER_PAGE);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      onSymptomsChange(selectedSymptoms.filter((id) => id !== symptomId));
    } else {
      onSymptomsChange([...selectedSymptoms, symptomId]);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Select Your Symptoms
        </h2>
        <p className="text-muted-foreground">
          Choose all symptoms you're currently experiencing ({symptoms.length}{" "}
          symptoms available)
        </p>
      </div>

      {/* Search Bar with Analyze Button */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedSymptoms.length} selected
          </Badge>

          <Button
            onClick={onNext}
            disabled={selectedSymptoms.length === 0}
            size="lg"
          >
            Analyze Symptoms ({selectedSymptoms.length})
          </Button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            {filteredSymptoms.length === 0
              ? `No symptoms found matching "${searchTerm}"`
              : `Found ${filteredSymptoms.length} symptoms matching "${searchTerm}"${filteredSymptoms.length > 100 ? " (showing first 100)" : ""}`}
          </p>
        </div>
      )}

      {/* Pagination Info (when not searching) */}
      {!searchTerm && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * SYMPTOMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * SYMPTOMS_PER_PAGE, symptoms.length)} of{" "}
            {symptoms.length} symptoms
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Symptoms Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedSymptoms.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom.id);

          return (
            <Card
              key={symptom.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-gray-50",
              )}
              onClick={() => toggleSymptom(symptom.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <h4 className="font-medium text-sm leading-tight">
                      {symptom.name}
                    </h4>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-gray-300",
                    )}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {displayedSymptoms.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No symptoms found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm
              ? `No symptoms match "${searchTerm}". Try a different search term.`
              : "No symptoms to display."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={clearSearch}>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Pagination Controls (when not searching) */}
      {!searchTerm && totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Quick Analysis Button at Bottom (for mobile) */}
      <div className="flex justify-center pt-6 lg:hidden">
        <Button
          onClick={onNext}
          disabled={selectedSymptoms.length === 0}
          size="lg"
          className="w-full max-w-md"
        >
          Analyze Symptoms ({selectedSymptoms.length})
        </Button>
      </div>
    </div>
  );
};
