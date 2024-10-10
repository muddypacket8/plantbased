import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface UserProfile {
  name: string
  email: string
  profilePic: string
  preferences: {
    notifications: boolean
    darkMode: boolean
    language: string
  }
}

interface ProfileComponentProps {
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
}

export default function ProfileComponent({ userProfile, setUserProfile }: ProfileComponentProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div className="flex items-center space-x-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={userProfile.profilePic || '/placeholder.svg?height=96&width=96'} alt="Profile" />
          <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button variant="outline">Change Picture</Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={userProfile.name}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={userProfile.email}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>
      <Button className="w-full">Save Changes</Button>
    </div>
  )
}