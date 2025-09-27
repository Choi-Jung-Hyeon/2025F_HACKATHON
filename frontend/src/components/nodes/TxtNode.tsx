'use client';

import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Star } from 'lucide-react'; // Star 아이콘 import
import { saveMemo, getAiSuggestion } from '@/services/nodeService';
import { cn } from '@/lib/utils'; // cn 유틸리티 import

// Debounce Hook (이전과 동일)
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function TxtNode({ id, data }: NodeProps<{ label: string }>) {
  const [memoContent, setMemoContent] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // '중요' 상태 추가
  const [isImportant, setIsImportant] = useState(false);
  
  const debouncedMemo = useDebounce(memoContent, 1000);

  useEffect(() => {
    if (debouncedMemo) {
      saveMemo(Number(id), debouncedMemo)
        .then(() => console.log(`노드 ${id}의 메모 저장 성공`))
        .catch(err => console.error(`메모 저장 실패:`, err));
    }
  }, [debouncedMemo, id]);

  const handleSuggestionClick = async () => {
    setIsLoading(true);
    setSuggestion('');
    try {
      const result = await getAiSuggestion(Number(id));
      setSuggestion(result.content);
    } catch (error) {
      console.error('AI 제안 받기 실패:', error);
      setSuggestion('아이디어를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImportance = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsImportant(prev => !prev);
  };

  return (
    <div
      className={cn(
        "w-72 bg-white rounded-lg shadow-lg border transition-all duration-300",
        // '중요' 상태일 때의 스타일
        isImportant ? 'border-yellow-400 border-2 shadow-xl' : 'border-gray-200'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-stone-500" />
      
      {/* 노드 헤더 수정 */}
      <div className={cn(
        "p-3 rounded-t-lg border-b flex items-center justify-between",
        isImportant ? 'bg-yellow-50' : 'bg-gray-50'
      )}>
        <p className="font-semibold text-gray-700">{data.label}</p>
        <button onClick={toggleImportance} className="p-1 rounded-full hover:bg-yellow-200">
          <Star className={cn(
            "h-4 w-4 transition-colors",
            isImportant ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          )} />
        </button>
      </div>

      <div className="p-3">
        <Textarea
          placeholder="여기에 생각을 자유롭게 적어보세요..."
          className="text-sm min-h-[80px]"
          value={memoContent}
          onChange={(e) => setMemoContent(e.target.value)}
        />
      </div>

      {suggestion && (
        <div className="p-3 border-t text-sm text-gray-600 bg-yellow-50">
          <p className="font-bold mb-1 text-yellow-800">AI 제안:</p>
          <p>{suggestion}</p>
        </div>
      )}

      <div className="p-3 border-t bg-gray-50 rounded-b-lg">
        <Button className="w-full" onClick={handleSuggestionClick} disabled={isLoading}>
          <Lightbulb className="mr-2 h-4 w-4" />
          {isLoading ? '생각 중...' : 'AI에게 아이디어 제안받기'}
        </Button>
      </div>
    </div>
  );
}

export default memo(TxtNode);