import DigitalClock from "../components/DigitalClock"
import { DynamicThemeProvider } from "../components/DynamicThemeProvider"
import TimeBasedBackground from "../components/TimeBasedBackground"

export default function Home() {
  return (
    <DynamicThemeProvider>
      <main className="relative min-h-screen overflow-hidden bg-[#060b16] text-white">
        <TimeBasedBackground />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.35),_rgba(56,189,248,0))] blur-3xl" />
          <div className="absolute bottom-[-30%] right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(147,197,253,0.28),_rgba(147,197,253,0))] blur-3xl" />
          <div className="absolute top-[20%] left-[-15%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(167,139,250,0.28),_rgba(167,139,250,0))] blur-3xl" />
        </div>
        <div className="relative flex items-center justify-center px-4 py-12 sm:py-16 lg:py-20">
          <DigitalClock />
        </div>
      </main>
    </DynamicThemeProvider>
  )
}
