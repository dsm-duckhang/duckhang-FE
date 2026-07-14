function AdminHomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm font-bold tracking-[-0.02em] text-neutral-500">관리자 전용</p>
      <h1 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">관리자 홈</h1>
      <p className="mt-1 text-sm leading-6 text-neutral-600">
        행사와 덕행 콘텐츠를 관리하는 화면이에요.
      </p>
    </section>
  )
}

export default AdminHomePage
