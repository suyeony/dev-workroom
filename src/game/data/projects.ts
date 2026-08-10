export interface Project {
    title: string;
    tech: string;
    description: string;
    highlights: string[];
    url: string;
}
export const projects: Project[] = [
    {
        title: "MATH CANVAS",
        tech: "Vue3 · TypeScript · Pinia · SVG",
        description: "SVG 기반 수학 학습 캔버스 에디터",
        highlights: [
            "오픈 3주 1,250+ 사용자",
            "렌더링 구조 개선 및 상태 관리 최적화",
        ],
        url: "상세 포트폴리오 URL",
    },
    {
        title: "OUTBACK WEB APP",
        tech: "Vue · Node.js · MySQL",
        description: "상품 및 주문 서비스 개발",
        highlights: [
            "500만+ 다운로드 서비스",
            "관리자 상품 등록 플로우 4 → 2단계 개선",
        ],
        url: "상세 포트폴리오 URL",
    },
    {
        title: "BMW VANTAGE",
        tech: "Vue · JavaScript",
        description: "BMW 고객용 서비스 및 관리자 기능 개발",
        highlights: ["10만+ 가입자 서비스", "예약 차량 조회 및 통계 UI 개발"],
        url: "상세 포트폴리오 URL",
    },
    {
        title: "INSTAGRAM ARCHIVE",
        tech: "React · TypeScript · Supabase",
        description: "Instagram 저장 게시물 아카이브",
        highlights: [
            "React 기술 학습을 위해 직접 기획·개발",
            "검색·카테고리·CRUD 및 모바일 UI 구현",
        ],
        url: "상세 포트폴리오 URL",
    },
];

