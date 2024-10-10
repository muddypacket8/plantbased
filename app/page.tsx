"use client";
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Heart, Home, Search as SearchIcon, ShoppingCart, User, X, Plus, Minus, Settings, LogOut, CreditCard, LogIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import ProfileComponent from './profile'
import SettingsComponent from './settings'

interface Meal {
  id: number
  name: string
  price: number
  image: string
  description: string
}

interface CartItem extends Meal {
  quantity: number
}

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

interface CheckoutInfo {
  paymentMethod: 'card' | 'paypal'
  cardNumber: string
  expiryDate: string
  cvv: string
  name: string
}

export default function PlantBasedApp() {
  const [activeTab, setActiveTab] = useState<string>('home')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Meal[]>([])
  const [searchResult, setSearchResult] = useState<Meal | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false)
  const [favorites, setFavorites] = useState<Meal[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    profilePic: '',
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'English',
    },
  })
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  })
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'search', icon: SearchIcon },
    { id: 'favorites', icon: Heart },
    { id: 'notifications', icon: Bell },
    { id: 'profile', icon: User },
  ]

  const meals: Meal[] = [
    { id: 1, name: 'Vegan Buddha Bowl', price: 6.49, image: '/placeholder.svg?height=200&width=300', description: 'A nourishing bowl filled with quinoa, roasted vegetables, and tahini dressing.' },
    { id: 2, name: 'Quinoa Salad', price: 5.49, image: '/placeholder.svg?height=200&width=300', description: 'Fresh mixed greens with quinoa, cherry tomatoes, and a zesty lemon vinaigrette.' },
    { id: 3, name: 'Avocado Toast', price: 4.49, image: '/placeholder.svg?height=200&width=300', description: 'Creamy avocado spread on artisanal whole grain toast, topped with microgreens.' },
    { id: 4, name: 'Lentil Curry', price: 7.99, image: '/placeholder.svg?height=200&width=300', description: 'Hearty red lentils simmered in a fragrant coconut curry sauce, served with brown rice.' },
    { id: 5, name: 'Mushroom Risotto', price: 8.49, image: '/placeholder.svg?height=200&width=300', description: 'Creamy Arborio rice cooked with a medley of wild mushrooms and truffle oil.' },
    { id: 6, name: 'Veggie Burger', price: 5.99, image: '/placeholder.svg?height=200&width=300', description: 'A plant-based patty made with black beans and quinoa, served on a whole wheat bun.' },
  ]

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredSuggestions = meals.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setSearchResult(null)
  }

  const handleSuggestionClick = (meal: Meal) => {
    setSearchTerm(meal.name)
    setSuggestions([])
  }

  const handleSearch = () => {
    const result = meals.find(meal => meal.name.toLowerCase() === searchTerm.toLowerCase())
    setSearchResult(result || null)
    setSuggestions([])
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResult(null)
    setSuggestions([])
  }

  const addToCart = (meal: Meal) => {
    const existingItem = cart.find(item => item.id === meal.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...meal, quantity: 1 }])
    }
  }

  const removeFromCart = (mealId: number) => {
    const existingItem = cart.find(item => item.id === mealId)
    if (existingItem && existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== mealId))
    } else {
      setCart(cart.map(item =>
        item.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const toggleFavorite = (meal: Meal) => {
    if (favorites.some(fav => fav.id === meal.id)) {
      setFavorites(favorites.filter(fav => fav.id !== meal.id))
    } else {
      setFavorites([...favorites, meal])
    }
  }

  const isFavorite = (mealId: number) => favorites.some(fav => fav.id === mealId)

  const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCheckoutInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }))
  }
  const handlePaymentMethodChange = (value: 'card' | 'paypal') => {
    setCheckoutInfo(prevInfo => ({
      ...prevInfo,
      paymentMethod: value
    }))
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the order and payment info to a server
    console.log('Order placed:', { cart, total: getTotalPrice(), paymentInfo: checkoutInfo })
    // Clear cart and close checkout
    setCart([])
    setIsCheckoutOpen(false)
    setIsCartOpen(false)
    alert('Thank you for your order!')
  }

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Simulate login process
    console.log('Login attempt:', credentials)
    setIsLoggedIn(true)
    setIsLoginModalOpen(false)
    setUserProfile({
      name: 'John Doe',
      email: credentials.email,
      profilePic: '/placeholder.svg?height=96&width=96',
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'English',
      },
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserProfile({
      name: '',
      email: '',
      profilePic: '',
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'English',
      },
    })
  }

  const renderMealCard = (meal: Meal, showFavoriteButton = true) => (
    <motion.div
      key={meal.id}
      className={`${userProfile.preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{meal.name}</h3>
          {showFavoriteButton && (
            <button
              onClick={() => toggleFavorite(meal)}
              className={`${isFavorite(meal.id) ? 'text-red-500' : userProfile.preferences.darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-red-500 transition-colors`}
              aria-label={isFavorite(meal.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-6 w-6 ${isFavorite(meal.id) ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        <p className={`${userProfile.preferences.darkMode ? 'text-green-400' : 'text-green-600'}`}>${meal.price.toFixed(2)}</p>
        <p className={`${userProfile.preferences.darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>{meal.description}</p>
        <button
          onClick={() => addToCart(meal)}
          className={`mt-2 ${userProfile.preferences.darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-full transition-colors`}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  )

  const LoginComponent = ({ onClose, onLogin, darkMode }: { onClose: () => void; onLogin: (credentials: { email: string; password: string }) => void; darkMode: boolean }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onLogin({ email, password })
    }
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Login</h2>
            <button onClick={onClose} className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={darkMode ? 'bg-gray-700 text-white' : ''}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={darkMode ? 'bg-gray-700 text-white' : ''}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className={`flex flex-col h-screen ${userProfile.preferences.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
    {/* Header */}
    <header className={`${userProfile.preferences.darkMode ? 'bg-gray-800' : 'bg-green-500'} text-white p-4 flex justify-between items-center`}>
      <h1 className="text-2xl font-bold">PlantPower</h1>
      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <Avatar>
            <AvatarImage src={userProfile.profilePic || '/placeholder.svg?height=32&width=32'} alt="Profile" />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <button
          onClick={() => isLoggedIn ? handleLogout() : setIsLoginModalOpen(true)}
          className="flex items-center space-x-2"
        >
          {isLoggedIn ? <LogOut size={24} /> : <LogIn size={24} />}
          <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
        </button>
      </div>
    </header>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Today's Specials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map((meal) => renderMealCard(meal))}
            </div>
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Search Meals</h2>
            <div className="relative mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search for plant-based meals..."
                  className={`w-full p-2 rounded-l-lg border ${userProfile.preferences.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  onClick={handleSearch}
                  className={`${userProfile.preferences.darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-r-lg transition-colors`}
                >
                  Search
                </button>
              </div>
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute z-10 w-full ${userProfile.preferences.darkMode ? 'bg-gray-800' : 'bg-white'} mt-1 rounded-lg shadow-lg`}
                  >
                    {suggestions.map((meal) => (
                      <motion.li
                        key={meal.id}
                        whileHover={{ backgroundColor: userProfile.preferences.darkMode ? '#374151' : '#f3f4f6' }}
                        className="p-2 cursor-pointer"
                        onClick={() => handleSuggestionClick(meal)}
                      >
                        {meal.name}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${userProfile.preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 relative`}
                >
                  <button
                    onClick={clearSearch}
                    className={`absolute top-2 right-2 ${userProfile.preferences.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <X size={20} />
                  </button>
                  {renderMealCard(searchResult)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
            {favorites.length === 0 ? (
              <p>You haven't added any favorites yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((meal) => renderMealCard(meal, false))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <p>You have no new notifications.</p>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isLoggedIn ? (
              <>
                <ProfileComponent userProfile={userProfile} setUserProfile={setUserProfile} />
                <SettingsComponent
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              </>
            ) : (
              <p>Please log in to view your profile and settings.</p>
            )}
          </motion.div>
        )}
      </main>

      {/* Navigation */}
      <nav className={`${userProfile.preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <ul className="flex justify-around">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full p-4 ${
                  activeTab === tab.id
                    ? userProfile.preferences.darkMode ? 'text-green-400' : 'text-green-500'
                    : userProfile.preferences.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <tab.icon className="h-6 w-6" />
                </motion.div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Shopping Cart */}
      <motion.button
        onClick={() => setIsCartOpen(true)}
        className={`fixed bottom-20 right-4 ${userProfile.preferences.darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white p-4 rounded-full shadow-lg`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ShoppingCart className="h-6 w-6" />
      </motion.button>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${userProfile.preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className={`${userProfile.preferences.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                  <X size={24} />
                </button>
              </div>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between py-2 ${userProfile.preferences.darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <div className="flex items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className={`text-sm ${userProfile.preferences.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>${item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className={`${userProfile.preferences.darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} mr-2`}
                        >
                          <Minus size={20} />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className={`${userProfile.preferences.darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-700'} ml-2`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">${getTotalPrice()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(true)
                      setIsCartOpen(false)
                    }}
                    className={`w-full mt-4 ${userProfile.preferences.darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white py-2 rounded-lg transition-colors`}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${userProfile.preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Checkout</h2>
                <button onClick={() => setIsCheckoutOpen(false)} className={`${userProfile.preferences.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCheckout}>
                <div className="mb-4">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <RadioGroup
                    value={checkoutInfo.paymentMethod}
                    onValueChange={(value: 'card' | 'paypal') => setCheckoutInfo(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </div>
                {checkoutInfo.paymentMethod === 'card' && (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={checkoutInfo.cardNumber}
                        onChange={handleCheckoutChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={checkoutInfo.expiryDate}
                          onChange={handleCheckoutChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={checkoutInfo.cvv}
                          onChange={handleCheckoutChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={checkoutInfo.name}
                    onChange={handleCheckoutChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Pay ${getTotalPrice()}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginComponent
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
            darkMode={userProfile.preferences.darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  )
}