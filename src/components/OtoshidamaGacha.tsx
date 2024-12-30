import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gift, Sparkles, Coins, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OTOSHIDAMA_CONFIG, spinGacha } from '@/lib/gacha';

export function OtoshidamaGacha() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleSpin = () => {
    setIsSpinning(true);
    
    setTimeout(() => {
      const amount = spinGacha(OTOSHIDAMA_CONFIG);
      setIsSpinning(false);
      setResult(amount);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700 p-4 sm:p-6">
      <Card className="w-full max-w-[95vw] sm:max-w-md p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white/95 backdrop-blur-sm">
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-700">お年玉ガチャ</h1>
          <p className="text-sm sm:text-base text-gray-600">新年の運試し！どのお年玉が当たるかな？</p>
        </div>

        <div className="relative aspect-square flex items-center justify-center">
          <div className={cn(
            "w-32 h-32 sm:w-48 sm:h-48 rounded-full border-6 sm:border-8 border-red-600 flex items-center justify-center transition-transform duration-1000",
            isSpinning && "animate-[spin_0.5s_linear_infinite]"
          )}>
            <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-red-600" />
          </div>
          {isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 animate-pulse" />
            </div>
          )}
        </div>

        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full h-10 sm:h-12 text-base sm:text-lg bg-red-600 hover:bg-red-700"
        >
          {isSpinning ? 'ガチャ回転中...' : 'ガチャを回す'}
        </Button>

        <div className="text-xs sm:text-sm text-gray-500 text-center">
          <p>当選金額: ¥1,000 ～ ¥5,000</p>
        </div>
      </Card>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="w-[95vw] sm:max-w-md mx-auto bg-white p-0 gap-0">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-white transition-opacity hover:opacity-100"
              onClick={() => setShowResult(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="text-center space-y-4 sm:space-y-6 py-6 sm:py-8">
            <div className="flex justify-center">
              <Coins className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 animate-bounce" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">おめでとうございます！</h2>
            <div className="text-3xl sm:text-4xl font-bold text-red-600">
              ¥{result?.toLocaleString()}
            </div>
            <p className="text-sm sm:text-base text-gray-600">素敵なお年玉が当たりました！</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}