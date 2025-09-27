'use client'

import React, { useState } from 'react';
import { Plus, Image, Mic, Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { postNewProject } from '@/services/AddProjectService';

const TextInput = () => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 추가

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // form의 기본 동작(페이지 새로고침) 방지
    if (!prompt.trim()) return; // 내용이 없으면 전송 안 함

    setIsSubmitting(true); // 로딩 시작
    try {
      const result = await postNewProject(prompt);
      console.log('API 응답:', result); // 성공 응답 로그
      alert('아이디어가 성공적으로 제출되었습니다!');
      setPrompt(''); // 입력창 비우기
    } catch (error) {
      console.error('제출 실패:', error);
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false); // 로딩 종료 (성공/실패 여부와 관계없이)
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form 
        className="flex flex-col gap-3 rounded-xl bg-[#1e1f20] p-3 shadow-lg"
        onSubmit={(e) => handleSubmit}
      >
        
       <TextareaAutosize
          minRows={1} 
          maxRows={6} 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="아이디어 입력"
          className="flex-1 w-full bg-transparent px-4 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
        
        <div className="flex items-center justify-between">
          {/* 왼쪽 버튼 그룹 */}
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-full p-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200">
              <Plus size={20} />
            </button>
            <button type="button" className="rounded-full p-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200">
              <Image size={20} />
            </button>
          </div>

          {/* 오른쪽 전송 버튼 */}
          <button
            type="submit"
            disabled={!prompt} // 입력 내용이 없으면 비활성화
            className="rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-500 disabled:bg-gray-500 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextInput;