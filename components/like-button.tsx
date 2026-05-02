"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  complaintId?: string
  commentId?: string
  initialLiked: boolean
  initialCount: number
  userId?: string
}

export function LikeButton({
  complaintId,
  commentId,
  initialLiked,
  initialCount,
  userId
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    if (isLiked) {
      // Unlike
      if (complaintId) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('complaint_id', complaintId)
      } else if (commentId) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)
          .eq('comment_id', commentId)
      }
      setIsLiked(false)
      setCount(c => Math.max(0, c - 1))
    } else {
      // Like
      const insertData: Record<string, string> = { user_id: userId }
      if (complaintId) insertData.complaint_id = complaintId
      if (commentId) insertData.comment_id = commentId

      await supabase.from('likes').insert(insertData)
      setIsLiked(true)
      setCount(c => c + 1)
    }

    setIsLoading(false)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "gap-1.5",
        isLiked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{count}</span>
    </Button>
  )
}
