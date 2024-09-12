import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Link } from "@remix-run/react"

interface BackButtonProps {
  label: string;
  className?: string;
}

export function BackButton({ label, className }: BackButtonProps) {
  return (
    <Button asChild className={cn(className)}>
      <Link to={".."} relative="path">
        {label}
      </Link>
    </Button>
  )
}