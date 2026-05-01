import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For demo purposes, we allow access without authentication
  // In production, uncomment the auth check below
  
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) {
  //   redirect("/login?next=/admin")
  // }
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.id)
  //   .single()
  // if (profile?.role !== 'admin') {
  //   redirect("/")
  // }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
