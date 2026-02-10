import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

type AuthContextType = {
  user: { username: string; role: 'ADMIN' | 'USER' } | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, password: string) => Promise<boolean>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string; role: 'ADMIN' | 'USER' } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const basic = `Basic ${btoa(`${username}:${password}`)}`

      const response = await fetch('http://localhost:30080/api/auth/me', {
        headers: { Authorization: basic },
      })

      if (!response.ok) {
        return false
      }

      const data = (await response.json()) as { username: string; role: 'ADMIN' | 'USER' }
      const userData = { username: data.username, role: data.role }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('auth', btoa(`${username}:${password}`))
      return true
    } catch {
      return false
    }
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:30080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      return await login(username, password)
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('auth')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
