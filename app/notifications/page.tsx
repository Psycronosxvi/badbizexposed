import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Gift, Heart, MessageSquare, UserPlus, AlertTriangle, Check } from "lucide-react"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Notifications | BadBizExposed",
  description: "View your notifications on BadBizExposed."
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?redirect=/notifications')
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const getIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <Gift className="h-5 w-5 text-purple-500" />
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            </div>
            {notifications && notifications.some(n => !n.is_read) && (
              <form action={async () => {
                'use server'
                const supabase = await createClient()
                await supabase
                  .from('notifications')
                  .update({ is_read: true })
                  .eq('user_id', user.id)
              }}>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Mark all as read
                </button>
              </form>
            )}
          </div>

          {!notifications || notifications.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  When someone interacts with your content, you&apos;ll see it here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <Link 
                  key={notification.id} 
                  href={notification.link || '#'}
                  className="block"
                >
                  <Card className={cn(
                    "bg-card border-border hover:border-primary/50 transition-colors",
                    !notification.is_read && "bg-primary/5 border-primary/20"
                  )}>
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-foreground",
                              !notification.is_read && "font-medium"
                            )}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                          </div>
                          {notification.message && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
