import { createClient } from "@/lib/supabase/server"
import { HeaderWrapper } from "@/components/header-wrapper"
import { Footer } from "@/components/footer"
import { UserProfileContent } from "@/components/user-profile-content"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username, bio')
    .eq('username', username)
    .single()

  if (!profile) {
    return { title: 'User Not Found | BadBizExposed' }
  }

  return {
    title: `${profile.display_name || profile.username} | BadBizExposed`,
    description: profile.bio || `View ${profile.display_name || profile.username}'s profile and complaints on BadBizExposed`
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) {
    notFound()
  }

  // Get user's complaints
  const { data: complaints } = await supabase
    .from('complaints')
    .select('*, businesses(name, slug)')
    .eq('user_id', profile.id)
    .eq('is_frozen', false)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get follower/following counts
  const [followersResult, followingResult] = await Promise.all([
    supabase.from('user_follows').select('id', { count: 'exact', head: true }).eq('following_id', profile.id),
    supabase.from('user_follows').select('id', { count: 'exact', head: true }).eq('follower_id', profile.id)
  ])

  // Check if current user is following this profile
  let isFollowing = false
  if (currentUser) {
    const { data: followCheck } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', profile.id)
      .single()
    isFollowing = !!followCheck
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderWrapper />
      
      <main className="flex-1">
        <UserProfileContent
          profile={profile}
          complaints={complaints || []}
          followersCount={followersResult.count || 0}
          followingCount={followingResult.count || 0}
          isFollowing={isFollowing}
          isOwnProfile={currentUser?.id === profile.id}
          currentUserId={currentUser?.id}
        />
      </main>

      <Footer />
    </div>
  )
}
