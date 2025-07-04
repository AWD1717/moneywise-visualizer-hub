
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useCashflows } from "@/hooks/useCashflows";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { MobileCardView } from "@/components/MobileCardView";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

const Cashflows = () => {
  const { data: cashflowsData, isLoading } = useCashflows();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
        <h2 className="text-3xl font-bold tracking-tight">Arus Kas</h2>
        <AddTransactionModal />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Riwayat Transaksi</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari transaksi..."
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
          {/* Mobile View */}
          <MobileCardView data={currentCashflows} type="cashflow" />

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tanggal</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Akun</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipe</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Kategori</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Deskripsi</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {currentCashflows.map((flow) => (
                  <tr key={flow.id} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="py-3 px-4 text-sm">{new Date(flow.date).toLocaleDateString('id-ID')}</td>
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
                        <span className="text-green-500">+{formatRupiah(flow.credit || 0)}</span>
                      ) : (
                        <span className="text-red-500">-{formatRupiah(flow.debit || 0)}</span>
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
              Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredCashflows.length)} dari{" "}
              {filteredCashflows.length} hasil
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded">
                {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cashflows;
