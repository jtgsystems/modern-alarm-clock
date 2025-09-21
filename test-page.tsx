import { DynamicThemeProvider } from "./components/DynamicThemeProvider"

export default function TestPage() {
  return (
    <DynamicThemeProvider>
      <div className="text-white p-8">
        <h1>Test Page</h1>
        <p>If you can see this, DynamicThemeProvider works!</p>
      </div>
    </DynamicThemeProvider>
  )
}