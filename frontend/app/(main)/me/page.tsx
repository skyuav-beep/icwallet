import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page / 마이페이지",
  description:
    "Profile, security, and notification management area for end-users.",
};

export default function MePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold">
          Personal Settings Hub
          <span className="block text-lg text-neutral-500">
            개인 설정 허브
          </span>
        </h2>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-400">
          Stage profile updates, security preferences, whitelist management, and
          notification controls that span wallet, mining, and P2P modules.
          <span className="block">
            지갑·마이닝·P2P 전 영역에서 활용되는 프로필 수정, 보안 설정,
            화이트리스트 관리, 알림 제어를 준비하는 공간입니다.
          </span>
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Security Center / 보안 센터
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Password, 2FA, and session management controls.</li>
            <li>비밀번호·2FA·세션 관리.</li>
            <li>Withdrawal whitelist and device trust lists.</li>
            <li>출금 화이트리스트·신뢰 기기 관리.</li>
            <li>Audit log viewer scoped to user actions.</li>
            <li>사용자 행위 범위의 감사 로그 뷰어.</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">
            Support & Notices / 고객센터·공지
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Access to announcements, FAQs, and support tickets.</li>
            <li>공지·FAQ·지원 티켓 접근.</li>
            <li>Preference center for email, SMS, and push alerts.</li>
            <li>이메일·SMS·푸시 알림 환경설정.</li>
            <li>Version and policy acknowledgements tracking.</li>
            <li>버전·정책 확인 내역 추적.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
