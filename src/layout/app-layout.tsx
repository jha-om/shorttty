import Header from "@/components/Header"

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          background: "#000000",
          backgroundImage: `
        radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)
      `,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0",
        }}
      />

      <div className="relative z-10 min-h-screen px-12 md:px-36 mx-auto transition-all duration-500">
        <main className="min-h-screen">
          <div className="px-6 py-4">
            <Header />
            
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
