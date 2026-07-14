import { useAuthStore } from '@repo/auth'

function HomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <section className="flex min-h-[calc(100dvh-9.5rem)] flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-2xl font-bold text-neutral-950">사용자 홈</h1>
      <p className="text-sm text-neutral-600">
        {user?.newUser ? '가입이 완료됐어요.' : '다시 만나서 반가워요.'}
      </p>
    </section>
  )
}

export default HomePage
