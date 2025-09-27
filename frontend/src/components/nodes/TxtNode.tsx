'use client';

import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Star } from 'lucide-react';
import { saveMemo } from '@/services/nodeService'; // saveMemo는 실제 API를 사용하도록 유지 (테스트 가능)
import { getAiSuggestionDummy } from '@/lib/dummyApi'; // [수정] 더미 제안 함수 import
import { cn } from '@/lib/utils';

// Debounce Hook (기존과 동일)
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
  const [isImportant, setIsImportant] = useState(false);
  
  const debouncedMemo = useDebounce(memoContent, 1000);

  useEffect(() => {
    if (debouncedMemo) {
        // saveMemo는 실제 백엔드가 없으면 에러가 발생하므로, 테스트 시에는 주석 처리하거나 dummy 함수로 교체할 수 있습니다.
        // saveMemo(Number(id), debouncedMemo)
        //   .then(() => console.log(`노드 ${id}의 메모 저장 성공`))
        //   .catch(err => console.error(`메모 저장 실패:`, err));
        console.log(`[DUMMY SAVE] 노드 ${id}에 메모 저장: ${debouncedMemo}`);
    }
  }, [debouncedMemo, id]);

  const handleSuggestionClick = async () => {
    setIsLoading(true);
    setSuggestion('');
    try {
      // [수정] 실제 API 대신 더미 함수 호출
      const result = await getAiSuggestionDummy(Number(id));
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
        isImportant ? 'border-yellow-400 border-2 shadow-xl' : 'border-gray-200'
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-stone-500" />
      
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