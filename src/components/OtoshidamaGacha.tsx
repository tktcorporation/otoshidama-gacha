import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Sparkles, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OTOSHIDAMA_CONFIG, spinGacha } from '@/lib/gacha';
import { Input } from '@/components/ui/input';
import { saveGachaResult, getGachaResult } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export function GachaForm() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSpin = async () => {
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // 既存の結果を確認
      const existingResult = await getGachaResult(name.trim());
      if (existingResult !== null) {
        navigate(`/result/${encodeURIComponent(name.trim())}`, { state: { isNewResult: false } });
        return;
      }

      // 新規ガチャ実行
      setIsSpinning(true);
      setTimeout(async () => {
        try {
          const amount = spinGacha(OTOSHIDAMA_CONFIG);
          await saveGachaResult(amount, name.trim());
          navigate(`/result/${encodeURIComponent(name.trim())}`, { state: { isNewResult: true } });
        } catch (error) {
          console.error('Error saving result:', error);
          toast({
            title: "エラー",
            description: error instanceof Error ? error.message : "予期せぬエラーが発生しました",
            variant: "destructive",
          });
        } finally {
          setIsSpinning(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error checking result:', error);
      toast({
        title: "エラー",
        description: "結果の確認中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700">
      <Card className="w-full min-h-screen sm:min-h-0 sm:w-[600px] sm:rounded-xl p-6 sm:p-8 space-y-6 bg-white/95 backdrop-blur-sm">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-700">お年玉ガチャ</h1>
          <p className="text-base sm:text-lg text-gray-600">新年の運試し！どのお年玉が当たるかな？</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              お名前
            </label>
            <Input
              id="name"
              type="text"
              placeholder="お名前を入力してください"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg"
              maxLength={20}
              disabled={isLoading || isSpinning}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        <div className="relative aspect-square w-full max-w-[320px] mx-auto flex items-center justify-center">
          <div className={cn(
            "w-40 h-40 sm:w-48 sm:h-48 rounded-full border-8 border-red-600 flex items-center justify-center transition-transform duration-1000",
            isSpinning && "animate-[spin_0.5s_linear_infinite]"
          )}>
            <Gift className="w-20 h-20 sm:w-24 sm:h-24 text-red-600" />
          </div>
          {isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-400 animate-pulse" />
            </div>
          )}
        </div>

        <Button
          onClick={handleSpin}
          disabled={isLoading || isSpinning}
          className="w-full h-14 text-xl bg-red-600 hover:bg-red-700"
        >
          {isSpinning ? 'ガチャ回転中...' : 'ガチャを回す'}
        </Button>

        <div className="text-sm sm:text-base text-gray-500 text-center">
          <p>当選金額: ¥1,000 ～ ¥5,000</p>
          <p className="mt-2">※お年玉ガチャは1人1回限りです</p>
        </div>
      </Card>
    </div>
  );
}

export function GachaResult() {
  const [result, setResult] = useState<number | null>(null);
  const [isExistingResult, setIsExistingResult] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { playerName } = useParams<{ playerName: string }>();
  const location = useLocation();
  const isNewResult = location.state?.isNewResult ?? false;

  useEffect(() => {
    const fetchResult = async () => {
      if (!playerName) {
        navigate('/');
        return;
      }

      try {
        const result = await getGachaResult(decodeURIComponent(playerName));
        if (result === null) {
          navigate('/');
          return;
        }

        setResult(result);
        setName(decodeURIComponent(playerName));
        setIsExistingResult(!isNewResult);
      } catch (error) {
        console.error('Error fetching result:', error);
        toast({
          title: "エラー",
          description: "結果の取得中にエラーが発生しました",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    fetchResult();
  }, [playerName, navigate, toast, isNewResult]);

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700">
      <Card className="w-full min-h-screen sm:min-h-0 sm:w-[600px] sm:rounded-xl p-6 sm:p-8 space-y-6 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          {isExistingResult ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400">
              <Gift className="w-full h-full" />
            </div>
          ) : (
            <Coins className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-500 animate-bounce" />
          )}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-xl sm:text-2xl text-gray-700">{name} さん</p>
              {isExistingResult ? (
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">過去の結果</h2>
                  <p className="text-base sm:text-lg text-gray-600">お年玉ガチャは1人1回限りです</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-red-600">おめでとうございます！</h2>
                  <p className="text-base sm:text-lg text-gray-600">素敵なお年玉が当たりました！</p>
                </div>
              )}
            </div>
            <div className={cn(
              "text-4xl sm:text-5xl font-bold",
              isExistingResult ? "text-gray-600" : "text-red-600"
            )}>
              ¥{result?.toLocaleString()}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">このページをスクリーンショットして保存してください</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}