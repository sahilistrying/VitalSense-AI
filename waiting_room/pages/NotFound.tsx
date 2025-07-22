import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Heart, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                  The health page you're looking for doesn't exist or has been
                  moved.
                </p>
              </div>

              <div className="space-y-3">
                <Link to="/" className="block">
                  <Button className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t text-sm text-gray-500">
                <p>Need help? Our AI assistant is always available</p>
                <Link to="/assistant" className="text-primary hover:underline">
                  Chat with Health AI
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
