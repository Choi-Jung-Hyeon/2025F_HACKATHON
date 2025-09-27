'use client';

import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';
import { saveMemo, getAiSuggestion } from '@/services/nodeService'; // API 함수 import

// Debounce Hook: 타이핑이 멈춘 후 일정 시간이 지나면 함수를 실행
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
  
  // Debounce를 사용하여 사용자가 타이핑을 멈추면(1초 후) API 호출
  const debouncedMemo = useDebounce(memoContent, 1000);

  useEffect(() => {
    // debouncedMemo가 변경될 때 (타이핑 멈춘 후) 메모 저장 API 호출
    if (debouncedMemo) {
      saveMemo(Number(id), debouncedMemo)
        .then(() => console.log(`노드 ${id}의 메모 저장 성공`))
        .catch(err => console.error(`메모 저장 실패:`, err));
    }
  }, [debouncedMemo, id]);

  // AI 제안 받기 버튼 핸들러
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

  return (
    <div className="w-72 bg-white rounded-lg shadow-lg border border-gray-200">
      <Handle type="target" position={Position.Top} className="!bg-stone-500" />
      
      <div className="p-3 bg-gray-50 rounded-t-lg border-b">
        <p className="font-semibold text-gray-700">{data.label}</p>
      </div>

      <div className="p-3">
        <Textarea
          placeholder="여기에 생각을 자유롭게 적어보세요..."
          className="text-sm min-h-[80px]"
          value={memoContent}
          onChange={(e) => setMemoContent(e.target.value)}
        />
      </div>

      {/* AI 제안 결과 표시 영역 */}
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