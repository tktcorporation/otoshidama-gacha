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

interface PageLayoutProps {
  children: React.ReactNode;
}

function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700 p-4">
      <div className="rounded-xl border text-card-foreground shadow-sm w-full min-h-[calc(100vh-2rem)] sm:min-h-0 sm:max-w-[600px] sm:rounded-xl p-6 sm:p-8 space-y-6 bg-white/95 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

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
    <PageLayout>
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">お年玉ガチャ</h1>
        <p className="text-gray-600">新年の運試し！ どのお年玉が当たるかな？</p>
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
    </PageLayout>
  );
}

interface GachaResult {
  name: string;
  amount: number;
}

export function GachaResult() {
  const [result, setResult] = useState<GachaResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { playerName } = useParams<{ playerName: string }>();
  const location = useLocation();

  useEffect(() => {
    const fetchResult = async () => {
      if (!playerName) {
        navigate('/');
        return;
      }

      try {
        const amount = await getGachaResult(decodeURIComponent(playerName));
        if (amount === null) {
          navigate('/');
          return;
        }

        setResult({
          name: decodeURIComponent(playerName),
          amount: amount
        });
      } catch (error) {
        console.error('Error fetching result:', error);
        toast({
          title: "エラー",
          description: error instanceof Error ? error.message : "予期せぬエラーが発生しました",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [playerName, navigate, toast]);

  if (!result) {
    return null;
  }

  return (
    <PageLayout>
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">お年玉ガチャ結果</h1>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700" />
          </div>
        ) : (
          <>
            <div className="text-center space-y-4">
              <p className="text-xl">{result?.name} さんの結果</p>
              <div className="relative w-32 h-32 mx-auto">
                <Sparkles className="absolute top-0 right-0 text-yellow-400" />
                <div className="w-full h-full rounded-full bg-red-100 flex items-center justify-center">
                  <Gift className="w-16 h-16 text-red-500" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">
                  ¥{result?.amount?.toLocaleString()}
                </p>
                <p className="text-gray-600">おめでとうございます！</p>
              </div>
            </div>
            <div className="mt-8 text-sm sm:text-base text-gray-500 text-center">
              <p>※お年玉ガチャは1人1回限りです</p>
              <p>※結果は保存されています</p>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}