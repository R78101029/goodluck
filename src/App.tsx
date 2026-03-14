import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateNumbers = () => {
    setIsGenerating(true);
    setAnalysis('');
    
    // Simulate a short delay for animation
    setTimeout(() => {
      const newNumbers: number[] = [];
      while (newNumbers.length < 5) {
        const num = Math.floor(Math.random() * 39) + 1;
        if (!newNumbers.includes(num)) {
          newNumbers.push(num);
        }
      }
      setNumbers(newNumbers.sort((a, b) => a - b));
      setIsGenerating(false);
    }, 600);
  };

  const getAIAnalysis = async () => {
    if (numbers.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `我剛剛抽出了台灣今彩539的五個幸運號碼：${numbers.join(', ')}。請給我一段大約50字的簡短、充滿正能量與財運的運勢分析或祝福語，讓我感覺今天會中大獎！`,
      });
      setAnalysis(response.text || '祝您好運連連，財源廣進！');
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      setAnalysis('AI 暫時無法連線，但您的好運依然不減！祝您中大獎！');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-2">
              今彩539 幸運預測
            </h1>
            <p className="text-indigo-200 text-sm">
              為您隨機抽取 5 個 1~39 的幸運號碼
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-10 min-h-[80px]">
            <AnimatePresence mode="popLayout">
              {numbers.length > 0 ? (
                numbers.map((num, index) => (
                  <motion.div
                    key={`${num}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15,
                      delay: index * 0.1 
                    }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] border-2 border-yellow-200/50"
                  >
                    <span className="text-2xl font-bold text-amber-950 drop-shadow-sm">
                      {num.toString().padStart(2, '0')}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-white/20 text-xl font-medium">?</span>
                    </div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <button
              onClick={generateNumbers}
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Dices className="w-5 h-5" />
              )}
              {isGenerating ? '抽取中...' : '抽取幸運號碼'}
            </button>

            {numbers.length > 0 && !analysis && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={getAIAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/15 border border-white/20 text-indigo-100 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400" />
                )}
                {isAnalyzing ? 'AI 正在解讀您的財運...' : 'AI 幸運解析'}
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl relative">
                  <Sparkles className="absolute top-3 right-3 w-4 h-4 text-amber-400/50" />
                  <h3 className="text-amber-300 font-medium mb-2 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    今日財運解析
                  </h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    {analysis}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
