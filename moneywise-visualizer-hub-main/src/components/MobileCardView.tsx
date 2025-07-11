
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatRupiah } from "@/utils/currency";

interface MobileCardViewProps {
  data: any[];
  type: 'cashflow' | 'investment' | 'debt' | 'networth';
}

export const MobileCardView = ({ data, type }: MobileCardViewProps) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const renderCashflowCard = (item: any) => (
    <Card key={item.id} className="bg-card border-border mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {new Date(item.date).toLocaleDateString('id-ID')}
            </div>
            <div className="font-semibold text-base">
              {item.accounts?.name || 'Unknown Account'}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${
              (item.credit || 0) > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {(item.credit || 0) > 0 ? '+' : '-'}{formatRupiah(Math.abs(item.credit || item.debit || 0))}
            </div>
            <Badge variant="outline" className="mt-1">
              {item.categories?.name || 'No Category'}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground truncate flex-1 mr-2">
            {item.description || 'No description'}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleCard(item.id)}
            className="p-1"
          >
            {expandedCards.has(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {expandedCards.has(item.id) && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span>{item.types?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Month:</span>
              <span>{item.month}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderInvestmentCard = (item: any) => {
    const gainLoss = ((item.quantity || 0) * (item.current_price || 0)) - ((item.quantity || 0) * (item.buy_price || 0));
    const gainLossPercentage = item.buy_price > 0 ? (gainLoss / (item.quantity * item.buy_price)) * 100 : 0;
    
    return (
      <Card key={item.id} className="bg-card border-border mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">{item.symbol}</span>
                <Badge variant="outline">{item.platform}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{item.quantity} shares</div>
              <div className="text-lg font-bold">{formatRupiah(item.current_price || 0)}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gainLoss >= 0 ? '+' : ''}{formatRupiah(gainLoss)} ({gainLoss >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCard(item.id)}
              className="p-1"
            >
              {expandedCards.has(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {expandedCards.has(item.id) && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>{item.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sector:</span>
                <span>{item.sector}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Buy Price:</span>
                <span>{formatRupiah(item.buy_price || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Market Value:</span>
                <span>{formatRupiah(((item.quantity || 0) * (item.current_price || 0)))}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderDebtCard = (item: any) => {
    const daysUntilDue = item.due_date ? Math.ceil((new Date(item.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;
    
    return (
      <Card key={item.id} className="bg-card border-border mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="font-bold text-lg mb-1">{item.name}</div>
              <div className="text-2xl font-bold text-red-500">{formatRupiah(item.balance || 0)}</div>
            </div>
            <div className="text-right">
              {item.due_date && (
                <Badge variant={isOverdue ? "destructive" : isDueSoon ? "secondary" : "outline"} className="mb-2">
                  {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                   isDueSoon ? `Due in ${daysUntilDue} days` : 
                   `Due ${new Date(item.due_date).toLocaleDateString('id-ID')}`}
                </Badge>
              )}
              <div className="text-sm text-muted-foreground">{item.interest_rate}% APR</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Min Payment: </span>
              <span className="font-medium">{formatRupiah(item.minimum_payment || 0)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCard(item.id)}
              className="p-1"
            >
              {expandedCards.has(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {expandedCards.has(item.id) && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Strategy:</span>
                <Badge variant="outline">{item.strategy}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Interest:</span>
                <span className="text-red-500">{formatRupiah(((item.balance || 0) * (item.interest_rate || 0) / 100) / 12)}</span>
              </div>
              {item.notes && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="mt-1 text-sm">{item.notes}</p>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">Make Payment</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderNetWorthCard = (item: any) => {
    const previousItem = data[data.indexOf(item) + 1];
    const change = previousItem ? item.net_worth - previousItem.net_worth : 0;
    const changePercentage = previousItem && previousItem.net_worth > 0 ? (change / previousItem.net_worth) * 100 : 0;
    
    return (
      <Card key={item.id} className="bg-card border-border mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                {new Date(item.calculated_at).toLocaleDateString('id-ID')}
              </div>
              <div className="text-2xl font-bold text-primary">{formatRupiah(item.net_worth)}</div>
            </div>
            <div className="text-right">
              {previousItem && (
                <div className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change >= 0 ? '+' : ''}{formatRupiah(change)}
                  <div className="text-xs">
                    {change >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-green-500">Assets: {formatRupiah(item.total_assets)}</span>
              <span className="text-muted-foreground mx-2">|</span>
              <span className="text-red-500">Liabilities: {formatRupiah(item.total_liabilities)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCard(item.id)}
              className="p-1"
            >
              {expandedCards.has(item.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {expandedCards.has(item.id) && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Assets:</span>
                <span className="text-green-500 font-medium">{formatRupiah(item.total_assets)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Liabilities:</span>
                <span className="text-red-500 font-medium">{formatRupiah(item.total_liabilities)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Net Worth:</span>
                <span className="text-primary">{formatRupiah(item.net_worth)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCard = (item: any) => {
    switch (type) {
      case 'cashflow':
        return renderCashflowCard(item);
      case 'investment':
        return renderInvestmentCard(item);
      case 'debt':
        return renderDebtCard(item);
      case 'networth':
        return renderNetWorthCard(item);
      default:
        return null;
    }
  };

  return (
    <div className="md:hidden">
      {data.map(renderCard)}
    </div>
  );
};
