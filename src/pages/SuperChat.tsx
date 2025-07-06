
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Settings, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WebhookSettings {
  url: string;
  isActive: boolean;
}

const SuperChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo! Saya adalah AI Assistant untuk membantu Anda dengan analisis keuangan dan rekomendasi finansial. Bagaimana saya bisa membantu Anda hari ini?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings>({
    url: '',
    isActive: false
  });
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse = '';

      if (webhookSettings.isActive && webhookSettings.url) {
        // Send to external webhook
        const response = await fetch(webhookSettings.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
            timestamp: new Date().toISOString(),
            context: 'finance_chat'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.response || data.message || 'Maaf, tidak ada respons dari AI.';
        } else {
          throw new Error('Webhook error');
        }
      } else {
        // Use mock responses when webhook is not active
        const mockResponses = [
          'Berdasarkan data keuangan Anda, saya merekomendasikan untuk meningkatkan dana darurat sebesar 20% dari penghasilan bulanan.',
          'Analisis pengeluaran Anda menunjukkan bahwa kategori makanan melebihi 30% dari total pengeluaran. Pertimbangkan untuk mengurangi makan di luar.',
          'Portofolio investasi Anda terlihat seimbang. Namun, pertimbangkan untuk menambahkan diversifikasi pada sektor teknologi.',
          'Saya melihat ada peluang untuk mengoptimalkan pembayaran hutang dengan strategi debt avalanche method.',
          'Berdasarkan tren pengeluaran 6 bulan terakhir, budget bulanan Anda bisa dioptimalkan dengan mengurangi 15% pada kategori hiburan.'
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        aiResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pesan ke AI. Silakan coba lagi.",
        variant: "destructive",
      });

      // Fallback to mock response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan dalam koneksi. Silakan periksa pengaturan webhook atau coba lagi nanti.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const testWebhook = async () => {
    if (!webhookSettings.url) {
      toast({
        title: "Error",
        description: "Silakan masukkan URL webhook terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(webhookSettings.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test connection',
          timestamp: new Date().toISOString(),
          context: 'webhook_test'
        }),
      });

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Webhook berhasil terhubung!",
        });
      } else {
        throw new Error('Webhook test failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghubungkan ke webhook. Periksa URL dan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">SuperChat AI</h2>
          <Badge variant={webhookSettings.isActive ? "default" : "secondary"} className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {webhookSettings.isActive ? "Webhook Aktif" : "Mode Demo"}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Pengaturan
        </Button>
      </div>

      {showSettings && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Pengaturan Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">URL Webhook Eksternal</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-api.com/webhook/chat"
                value={webhookSettings.url}
                onChange={(e) => setWebhookSettings(prev => ({ ...prev, url: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Masukkan URL endpoint API yang akan menerima pesan chat
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setWebhookSettings(prev => ({ ...prev, isActive: !prev.isActive }))}
                variant={webhookSettings.isActive ? "destructive" : "default"}
              >
                {webhookSettings.isActive ? "Nonaktifkan" : "Aktifkan"} Webhook
              </Button>
              
              {webhookSettings.url && (
                <Button onClick={testWebhook} variant="outline">
                  Test Koneksi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card className="bg-card border-border h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Financial Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col gap-4 p-0">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="px-6 pb-6">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Tanyakan tentang keuangan, investasi, atau minta saran finansial..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="min-h-[60px] resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="lg"
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperChat;
