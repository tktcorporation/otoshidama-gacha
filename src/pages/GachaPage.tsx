import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OTOSHIDAMA_CONFIG, playAndSaveGacha } from '@/lib/gacha';
import { useToast } from '@/components/ui/use-toast';

export function GachaPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSpin = async () => {
    if (!playerName.trim()) {
      setError('お名前を入力してください');
      return;
    }
    setError('');
    setIsSpinning(true);
    
    try {
      const amount = await playAndSaveGacha(playerName, OTOSHIDAMA_CONFIG);
      navigate(`/result/${amount}`);
    } catch (error) {
      console.error('Error in handleSpin:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "予期せぬエラーが発生しました。もう一度お試しください。",
        variant: "destructive"
      });
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700 p-4 sm:p-6">
      <Card className="w-full max-w-[95vw] sm:max-w-md p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white/95 backdrop-blur-sm">
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-700">お年玉ガチャ</h1>
          <p className="text-sm sm:text-base text-gray-600">新年の運試し！どのお年玉が当たるかな？</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">お名前</Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="お名前を入力してください"
              disabled={isSpinning}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
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
    </div>
  );
}