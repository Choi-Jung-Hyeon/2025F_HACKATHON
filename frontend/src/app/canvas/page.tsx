import MindMapCanvas from "@/components/MindMapCanvas";

// Suspense는 페이지가 로드되는 동안 로딩 상태를 보여주기 위해 필요합니다.
import { Suspense } from "react";

function CanvasPage() {
    return <MindMapCanvas />;
}

export default function CanvasPageWrapper() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <CanvasPage />
        </Suspense>
    );
}