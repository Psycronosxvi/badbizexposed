"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Coffee, Heart, Star, Award, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface GiftButtonProps {
  recipientId: string
  recipientName: string
  complaintId?: string
  userId?: string
}

const giftTypes = [
  { type: 'coffee', icon: Coffee, label: 'Coffee', points: 10, color: 'text-amber-600' },
  { type: 'heart', icon: Heart, label: 'Support', points: 25, color: 'text-red-500' },
  { type: 'star', icon: Star, label: 'Star', points: 50, color: 'text-yellow-500' },
  { type: 'award', icon: Award, label: 'Award', points: 100, color: 'text-purple-500' },
  { type: 'sparkle', icon: Sparkles, label: 'Super', points: 250, color: 'text-primary' },
]

export function GiftButton({
  recipientId,
  recipientName,
  complaintId,
  userId
}: GiftButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState<typeof giftTypes[0] | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSendGift = async () => {
    if (!userId) {
      router.push('/auth/login')
      return
    }

    if (!selectedGift) return

    setIsLoading(true)
    const supabase = createClient()

    // Check if user has enough points
    const { data: profile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single()

    if (!profile || (profile.points || 0) < selectedGift.points) {
      alert('Not enough points to send this gift!')
      setIsLoading(false)
      return
    }

    // Deduct points from sender
    await supabase
      .from('profiles')
      .update({ points: (profile.points || 0) - selectedGift.points })
      .eq('id', userId)

    // Add points to recipient
    const { data: recipientProfile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', recipientId)
      .single()

    await supabase
      .from('profiles')
      .update({ points: (recipientProfile?.points || 0) + selectedGift.points })
      .eq('id', recipientId)

    // Create gift record
    await supabase.from('gifts').insert({
      sender_id: userId,
      recipient_id: recipientId,
      complaint_id: complaintId || null,
      gift_type: selectedGift.type,
      amount: selectedGift.points,
      message: message || null
    })

    // Create notification for recipient
    await supabase.from('notifications').insert({
      user_id: recipientId,
      type: 'gift',
      title: 'You received a gift!',
      message: `Someone sent you a ${selectedGift.label} (+${selectedGift.points} points)`,
      link: complaintId ? `/complaints/${complaintId}` : null
    })

    setSuccess(true)
    setTimeout(() => {
      setIsOpen(false)
      setSuccess(false)
      setSelectedGift(null)
      setMessage('')
    }, 2000)

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Gift className="h-4 w-4" />
          <span>Gift</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send a Gift to {recipientName}</DialogTitle>
          <DialogDescription>
            Show your appreciation by sending a virtual gift. Points will be transferred to the recipient.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
            <p className="text-lg font-medium">Gift sent successfully!</p>
            <p className="text-muted-foreground">Thank you for your support.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Gift Selection */}
            <div>
              <Label>Select a Gift</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {giftTypes.map((gift) => (
                  <button
                    key={gift.type}
                    onClick={() => setSelectedGift(gift)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                      selectedGift?.type === gift.type
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <gift.icon className={cn("h-6 w-6", gift.color)} />
                    <span className="text-xs mt-1">{gift.points}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendGift}
                disabled={!selectedGift || isLoading}
              >
                {isLoading ? 'Sending...' : selectedGift ? `Send (${selectedGift.points} pts)` : 'Select a gift'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
