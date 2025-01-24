import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"

export function ModeToggle({ toggleDarkMode }: { toggleDarkMode: () => void }) {
  const { theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
    >
      {theme === "light" ? (
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
