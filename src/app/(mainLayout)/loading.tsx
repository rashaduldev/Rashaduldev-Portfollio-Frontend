export default function MainLayoutLoading() {
  return <main className="container min-h-[65vh] animate-pulse px-4 py-24" aria-label="Loading page"><div className="mx-auto h-8 w-56 rounded bg-muted" /><div className="mx-auto mt-5 h-4 w-full max-w-xl rounded bg-muted" /><div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-64 rounded-2xl bg-muted" />)}</div></main>;
}
