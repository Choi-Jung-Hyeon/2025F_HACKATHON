'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react'; // 별 아이콘 import

function ChildNode({ data, selected }: NodeProps<{ label: string }>) {
  // [추가] '중요' 상태를 관리하기 위한 isImportant 상태 추가
  const [isImportant, setIsImportant] = useState(false);

  // [기존 로직] LLM에 의해 제안된 노드인지 여부 (임시)
  const isSuggested = true; 

  const toggleImportance = (event: React.MouseEvent) => {
    // 이벤트 버블링을 막아 노드가 선택되는 것을 방지합니다.
    event.stopPropagation();
    setIsImportant(prev => !prev);
  };

  return (
    <div
      className={cn(
        'px-4 py-3 border rounded-md shadow-md transition-all duration-300 w-48 bg-white',
        // [수정] '중요' 상태일 때의 스타일 추가
        isImportant ? 'border-yellow-400 border-2 bg-yellow-50 shadow-lg' : 'border-stone-400',
        // [기존 로직] 제안 상태이고, 선택되지 않았을 때 반투명 효과
        isSuggested && !selected && !isImportant && 'opacity-40'
      )}
    >
      {/* 상위 노드와 연결될 핸들 */}
      <Handle type="target" position={Position.Top} />

      {/* 노드 내용 */}
      <div className="flex items-center justify-between">
        <span className="text-sm">{data.label}</span>
        {/* [추가] 중요 표시를 위한 별 아이콘 버튼 */}
        <button onClick={toggleImportance} className="p-1 rounded-full hover:bg-yellow-200">
          <Star className={cn(
            "h-4 w-4 transition-colors",
            isImportant ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          )} />
        </button>
      </div>

      {/* 하위 노드와 연결될 핸들 */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(ChildNode);