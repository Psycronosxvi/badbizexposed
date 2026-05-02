"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building2, 
  Home, 
  Users, 
  MapPin, 
  Hammer, 
  Truck, 
  Zap, 
  Shield, 
  CreditCard,
  Scale,
  ShoppingBag,
  Phone,
  Heart,
  Car,
  Plane,
  Wrench,
  GraduationCap,
  Grid
} from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryGridProps {
  categories: Category[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  building: Building2,
  home: Home,
  users: Users,
  "map-pin": MapPin,
  hammer: Hammer,
  truck: Truck,
  zap: Zap,
  shield: Shield,
  "credit-card": CreditCard,
  scale: Scale,
  "shopping-bag": ShoppingBag,
  phone: Phone,
  heart: Heart,
  car: Car,
  plane: Plane,
  wrench: Wrench,
  "graduation-cap": GraduationCap,
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Property Management', slug: 'property-management', icon: 'building', description: 'Property management companies and landlords', created_at: '' },
  { id: '2', name: 'HOA', slug: 'hoa', icon: 'home', description: 'Homeowners associations', created_at: '' },
  { id: '3', name: 'Retail', slug: 'retail', icon: 'shopping-bag', description: 'Retail stores and shopping', created_at: '' },
  { id: '4', name: 'Telecom', slug: 'telecom', icon: 'phone', description: 'Phone and internet providers', created_at: '' },
  { id: '5', name: 'Financial Services', slug: 'financial-services', icon: 'credit-card', description: 'Banks and financial institutions', created_at: '' },
  { id: '6', name: 'Healthcare', slug: 'healthcare', icon: 'heart', description: 'Hospitals and health insurance', created_at: '' },
  { id: '7', name: 'Auto', slug: 'auto', icon: 'car', description: 'Car dealerships and mechanics', created_at: '' },
  { id: '8', name: 'Insurance', slug: 'insurance', icon: 'shield', description: 'Insurance companies', created_at: '' },
]

export function CategoryGrid({ categories }: CategoryGridProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Grid className="h-5 w-5 text-accent" />
          Browse by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayCategories.slice(0, 8).map((category) => {
            const Icon = iconMap[category.icon || "building"] || Building2
            
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all group cursor-pointer">
                  <div className="p-3 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">
                    {category.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
        <Link
          href="/categories"
          className="block text-center text-sm text-primary hover:underline mt-4"
        >
          View all categories
        </Link>
      </CardContent>
    </Card>
  )
}
