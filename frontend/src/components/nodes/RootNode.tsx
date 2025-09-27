'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react'; // 별 아이콘 import

function RootNode({ data }: NodeProps<{ label: string }>) {
  // '중요' 상태 추가
  const [isImportant, setIsImportant] = useState(false);

  const toggleImportance = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsImportant(prev => !prev);
  };

  return (
    <div
      className={cn(
        'px-6 py-4 border-2 rounded-lg shadow-xl text-white font-bold transition-all duration-300',
        // '중요' 상태일 때의 스타일
        isImportant ? 'border-yellow-400 bg-yellow-800 scale-105' : 'border-stone-800 bg-stone-900'
      )}
    >
      {/* 하위 노드와 연결될 핸들 */}
      <Handle type="source" position={Position.Bottom} />
      
      {/* 노드 내용 및 중요 표시 버튼 */}
      <div className="flex items-center justify-between gap-4">
        <span>{data.label}</span>
        <button onClick={toggleImportance} className="p-1 rounded-full hover:bg-white/20">
          <Star className={cn(
            "h-5 w-5 transition-colors",
            isImportant ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          )} />
        </button>
      </div>
    </div>
  );
}

export default memo(RootNode);