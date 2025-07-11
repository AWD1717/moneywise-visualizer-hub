
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah } from "@/utils/currency";

interface Recommendation {
  id: string;
  type: 'transaction' | 'budget' | 'emergency_fund';
  title: string;
  description: string;
  amount?: number;
  category?: string;
  actionable: boolean;
}

interface AIRecommendationProps {
  webhookUrl?: string;
}

export const AIRecommendation = ({ webhookUrl }: AIRecommendationProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'emergency_fund',
      title: 'Dana Darurat',
      description: 'Sebaiknya alokasikan Rp 500.000 ke dana darurat bulan ini untuk mencapai target 6 bulan pengeluaran.',
      amount: 500000,
      actionable: true,
    },
    {
      id: '2',
      type: 'budget',
      title: 'Budget Makanan',
      description: 'Pengeluaran makanan bulan lalu melebihi budget. Pertimbangkan untuk mengurangi makan di luar.',
      actionable: false,
    },
    {
      id: '3',
      type: 'transaction',
      title: 'Investasi Bulanan',
      description: 'Saatnya melakukan investasi rutin bulanan sebesar Rp 1.000.000 ke reksa dana.',
      amount: 1000000,
      category: 'Investment',
      actionable: true,
    },
  ];

  const fetchRecommendations = async () => {
    setIsLoading(true);
    
    try {
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get_recommendations',
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || mockRecommendations);
        } else {
          setRecommendations(mockRecommendations);
        }
      } else {
        // Use mock data if no webhook URL is set
        setRecommendations(mockRecommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations(mockRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [webhookUrl]);

  const handleRecommendationClick = (recommendation: Recommendation) => {
    if (!recommendation.actionable) return;

    // Here you would typically open the appropriate modal or redirect
    // For now, we'll show a toast message
    toast({
      title: "Rekomendasi Diterapkan",
      description: `Menerapkan rekomendasi: ${recommendation.title}`,
    });

    // You could integrate this with the existing modals:
    // - AddTransactionModal for transaction recommendations
    // - CreateBudgetModal for budget recommendations
    // - Emergency fund setup for emergency fund recommendations
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return Plus;
      case 'budget':
        return TrendingUp;
      case 'emergency_fund':
        return Brain;
      default:
        return Brain;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'budget':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'emergency_fund':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => {
              const RecommendationIcon = getRecommendationIcon(recommendation.type);
              
              return (
                <div
                  key={recommendation.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    recommendation.actionable 
                      ? 'cursor-pointer hover:bg-accent/50 border-border' 
                      : 'border-border'
                  }`}
                  onClick={() => handleRecommendationClick(recommendation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <RecommendationIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{recommendation.title}</h4>
                        <Badge className={getRecommendationColor(recommendation.type)}>
                          {recommendation.type}
                        </Badge>
                        {recommendation.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Dapat diklik
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {recommendation.description}
                      </p>
                      {recommendation.amount && (
                        <p className="text-sm font-medium text-primary">
                          {formatRupiah(recommendation.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {!isLoading && recommendations.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Belum ada rekomendasi dari AI</p>
            <p className="text-sm text-muted-foreground">
              Atur webhook URL di Settings untuk mendapatkan rekomendasi
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
