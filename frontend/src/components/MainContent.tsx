'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextInput from './TextInput';

const MainContent = () => {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (!topic.trim()) {
      alert('주제를 입력해주세요!');
      return;
    }
    // 입력된 주제를 URL 쿼리 파라미터로 담아 canvas 페이지로 이동합니다.
    router.push(`/canvas?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6">
      {/* 이 div가 남은 공간을 모두 차지하여 TextInput을 하단에 고정시킵니다. */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400">
          아이디어를 시작하세요.
        </h1>
      </div>
      
      {/* TextInput 컴포넌트에 필요한 상태와 함수를 props로 전달합니다. */}
      <TextInput 
        topic={topic} 
        setTopic={setTopic} 
        onStart={handleStart} 
      />
    </main>
  );
};

export default MainContent;