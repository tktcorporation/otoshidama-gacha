import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export function ResultPage() {
  const { amount } = useParams();
  const amountNumber = Number.parseInt(amount || '0', 10);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-red-700 p-4 sm:p-6">
      <Card className="w-full max-w-[95vw] sm:max-w-md p-8 sm:p-12 space-y-8 bg-white/95 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Coins className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">おめでとうございます！</h1>
          <div className="text-4xl sm:text-5xl font-bold text-red-600">
            ¥{amountNumber.toLocaleString()}
          </div>
          <p className="text-base sm:text-lg text-gray-600">素敵なお年玉が当たりました！</p>
          <p className="text-sm text-gray-500">このページをスクリーンショットして保存してください</p>
        </div>
      </Card>
    </div>
  );
}