import React from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface SettingsComponentProps {
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
}

export default function SettingsComponent({ userProfile, setUserProfile }: SettingsComponentProps) {
  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        [name]: checked
      }
    }))
  }

  const handleLanguageChange = (value: string) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      preferences: {
        ...prevProfile.preferences,
        language: value
      }
    }))
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Notifications
          </Label>
          <Switch
            id="notifications"
            checked={userProfile.preferences.notifications}
            onCheckedChange={handleSwitchChange('notifications')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Dark Mode
          </Label>
          <Switch
            id="darkMode"
            checked={userProfile.preferences.darkMode}
            onCheckedChange={handleSwitchChange('darkMode')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={userProfile.preferences.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}