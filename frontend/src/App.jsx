function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <section className="rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-green-900">
          Event Management Platform
        </h1>

        <p className="mt-3 text-stone-600">
          Discover events. Meet people. Make memories.
        </p>

        <button className="mt-6 rounded-lg bg-green-900 px-6 py-3 font-medium text-white hover:bg-green-800">
          Explore Events
        </button>
      </section>
    </main>
  )
}

export default App