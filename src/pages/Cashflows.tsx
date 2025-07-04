
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import { useCashflows } from "@/hooks/useCashflows";

const Cashflows = () => {
  const { data: cashflowsData, isLoading } = useCashflows();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return <div>Loading cash flows...</div>;
  }

  const filteredCashflows = cashflowsData?.filter(
    (flow) =>
      flow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.accounts?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredCashflows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCashflows = filteredCashflows.slice(startIndex, endIndex);

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "income":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "expense":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "transfer":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cash Flows</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-background border-border"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Account</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentCashflows.map((flow) => (
                  <tr key={flow.id} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="py-3 px-4 text-sm">{new Date(flow.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm font-medium">{flow.accounts?.name}</td>
                    <td className="py-3 px-4">
                      <Badge className={getTypeColor(flow.types?.name || "")}>
                        {flow.types?.name}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{flow.categories?.name}</td>
                    <td className="py-3 px-4 text-sm">{flow.description}</td>
                    <td className="py-3 px-4 text-right text-sm font-medium">
                      {(flow.credit || 0) > 0 ? (
                        <span className="text-green-500">+${(flow.credit || 0).toLocaleString()}</span>
                      ) : (
                        <span className="text-red-500">-${(flow.debit || 0).toLocaleString()}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCashflows.length)} of{" "}
              {filteredCashflows.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cashflows;
