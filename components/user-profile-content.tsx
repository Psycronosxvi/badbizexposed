"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerifiedBadge } from "@/components/verified-badge"
import { 
  UserPlus, 
  UserMinus, 
  MessageSquare, 
  Flag, 
  MapPin, 
  Link as LinkIcon,
  Calendar,
  FileText,
  Users,
  Ban,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  is_verified: boolean
  verification_level: string | null
  points: number
  created_at: string
}

interface Complaint {
  id: string
  title: string
  content: string
  status: string
  created_at: string
  businesses: { name: string; slug: string } | null
}

interface UserProfileContentProps {
  profile: Profile
  complaints: Complaint[]
  followersCount: number
  followingCount: number
  isFollowing: boolean
  isOwnProfile: boolean
  currentUserId?: string
}

export function UserProfileContent({
  profile,
  complaints,
  followersCount,
  followingCount,
  isFollowing: initialIsFollowing,
  isOwnProfile,
  currentUserId
}: UserProfileContentProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followers, setFollowers] = useState(followersCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFollow = async () => {
    if (!currentUserId) {
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    if (isFollowing) {
      await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', profile.id)
      setIsFollowing(false)
      setFollowers(f => f - 1)
    } else {
      await supabase
        .from('user_follows')
        .insert({ follower_id: currentUserId, following_id: profile.id })
      setIsFollowing(true)
      setFollowers(f => f + 1)
    }

    setIsLoading(false)
  }

  const handleBlock = async () => {
    if (!currentUserId) return
    const supabase = createClient()
    await supabase
      .from('user_blocks')
      .insert({ blocker_id: currentUserId, blocked_id: profile.id })
    router.push('/')
  }

  const getVerificationLevel = (): 'basic' | 'verified' | 'trusted' | null => {
    if (profile.verification_level === 'trusted') return 'trusted'
    if (profile.is_verified) return 'verified'
    if (profile.verification_level === 'basic') return 'basic'
    return null
  }

  const verificationLevel = getVerificationLevel()

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {(profile.display_name || profile.username || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.display_name || profile.username}
                    </h1>
                    {verificationLevel && (
                      <VerifiedBadge level={verificationLevel} size="lg" />
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/settings">Edit Profile</Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        onClick={handleFollow}
                        disabled={isLoading}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleBlock} className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Block User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Flag className="h-4 w-4 mr-2" />
                            Report User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-foreground">{profile.bio}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                </span>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{complaints.length}</p>
                  <p className="text-sm text-muted-foreground">Complaints</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{followingCount}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{profile.points || 0}</p>
                  <p className="text-sm text-muted-foreground">Points</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Complaints */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Complaints
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No complaints yet.
            </p>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Link 
                  key={complaint.id} 
                  href={`/complaints/${complaint.id}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground hover:text-primary">
                          {complaint.title}
                        </h3>
                        {complaint.businesses && (
                          <p className="text-sm text-muted-foreground">
                            About: {complaint.businesses.name}
                          </p>
                        )}
                      </div>
                      <Badge variant={complaint.status === 'resolved' ? 'default' : 'secondary'}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {complaint.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
