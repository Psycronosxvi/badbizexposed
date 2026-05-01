"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Category, State } from "@/lib/types"

interface CompanyFiltersProps {
  categories: Category[]
  states: State[]
  currentCategory?: string
  currentState?: string
  currentSort?: string
}

export function CompanyFilters({
  categories,
  states,
  currentCategory,
  currentState,
  currentSort,
}: CompanyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/companies?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/companies')
  }

  const hasFilters = currentCategory || currentState || currentSort

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={currentCategory || "all"}
        onValueChange={(value) => updateFilter('category', value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentState || "all"}
        onValueChange={(value) => updateFilter('state', value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {states.map((state) => (
            <SelectItem key={state.id} value={state.abbreviation}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentSort || "complaints"}
        onValueChange={(value) => updateFilter('sort', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="complaints">Most Complaints</SelectItem>
          <SelectItem value="rating">Lowest Rating</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
