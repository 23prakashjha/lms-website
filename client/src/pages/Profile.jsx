import { useState, useContext, useEffect, useRef } from 'react'
import { User, Mail, Lock, BookOpen, Save, CheckCircle, XCircle, Shield, Eye, EyeOff, Sparkles, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import AuthContext from '../context/AuthContext'

const getPasswordStrength = (pass) => {
  if (!pass) return { label: '', color: 'bg-gray-200', width: '0%', text: '' }
  let score = 0
  if (pass.length >= 6) score++
  if (pass.length >= 10) score++
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++
  if (/\d/.test(pass)) score++
  if (/[^a-zA-Z0-9]/.test(pass)) score++
  const levels = [
    { label: 'Weak', color: 'bg-red-500', width: '20%', text: 'text-red-500' },
    { label: 'Fair', color: 'bg-orange-500', width: '40%', text: 'text-orange-500' },
    { label: 'Good', color: 'bg-yellow-500', width: '60%', text: 'text-yellow-500' },
    { label: 'Strong', color: 'bg-lime-500', width: '80%', text: 'text-lime-500' },
    { label: 'Very Strong', color: 'bg-green-500', width: '100%', text: 'text-green-500' },
  ]
  return levels[Math.min(score, 4)]
}

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef(null)
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const { data } = await axios.post('/api/upload/avatar', fd)
      setFormData(prev => ({ ...prev, avatar: data.url }))
      toast.success('Avatar uploaded')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: response } = await axios.put('/api/users/profile', formData)
      updateUser(response.user)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await axios.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password updated successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const emailValid = formData.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  const nameValid = formData.name.length >= 2 || formData.name === ''
  const pswdLenOk = passwordData.newPassword.length >= 6 || passwordData.newPassword === ''
  const pswdMatchOk = passwordData.confirmPassword === '' || passwordData.newPassword === passwordData.confirmPassword
  const strength = getPasswordStrength(passwordData.newPassword)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-white">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-300/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">My Profile</h1>
            <p className="text-primary-200 mt-2 max-w-xl">Manage your personal information and security settings</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6 lg:p-8 animate-fade-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2.5 text-primary-600" />Personal Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`input-field pl-11 ${nameValid ? 'input-success' : 'input-error'}`}
                        placeholder="Your full name"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {nameValid
                          ? <CheckCircle className="h-4 w-4 text-green-500" />
                          : <XCircle className="h-4 w-4 text-red-500" />
                        }
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input-field pl-11 ${emailValid ? 'input-success' : 'input-error'}`}
                        placeholder="your@email.com"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {emailValid
                          ? <CheckCircle className="h-4 w-4 text-green-500" />
                          : <XCircle className="h-4 w-4 text-red-500" />
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar</label>
                  <div className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <img
                        src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name || 'U'}&size=56&background=7c3aed&color=fff`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                      <p className="text-xs text-gray-400 truncate">{formData.avatar ? formData.avatar.split('/').pop() : 'Click to upload'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="btn-secondary text-sm px-3 py-2 disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <div className="h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Upload'
                      )}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="card p-6 lg:p-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="h-5 w-5 mr-2.5 text-primary-600" />Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field pl-11 pr-11"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`input-field pl-11 pr-11 ${!pswdLenOk ? 'input-error' : passwordData.newPassword.length >= 6 ? 'input-success' : ''}`}
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {!pswdLenOk && <p className="text-xs text-red-500 mt-1.5 flex items-center"><XCircle className="h-3 w-3 mr-1" />Minimum 6 characters</p>}
                    {passwordData.newPassword.length >= 6 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                          </div>
                          <span className={`text-[11px] font-medium ${strength.text}`}>{strength.label}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span className={`${passwordData.newPassword.length >= 6 ? 'text-green-500' : ''}`}>6+ chars</span>
                          <span className={`${/[a-z]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>Upper + Lower</span>
                          <span className={`${/\d/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>Number</span>
                          <span className={`${/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}`}>Symbol</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`input-field pl-11 pr-11 ${passwordData.confirmPassword ? (pswdMatchOk ? 'input-success' : 'input-error') : ''}`}
                        placeholder="Re-enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordData.confirmPassword && (
                      <p className={`text-xs mt-1.5 flex items-center ${pswdMatchOk ? 'text-green-500' : 'text-red-500'}`}>
                        {pswdMatchOk ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {pswdMatchOk ? 'Passwords match' : 'Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary flex items-center">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="card p-6 lg:p-8 text-center sticky top-24 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full mx-auto overflow-hidden ring-4 ring-primary-100 shadow-xl">
                    <img
                      src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name || 'User'}&size=128&background=7c3aed&color=fff`}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-600/40 to-transparent rounded-full" />
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 bg-gradient-to-br from-primary-500 to-accent-500 p-2.5 rounded-full shadow-lg shadow-primary-200 hover:scale-110 transition-transform cursor-pointer group disabled:opacity-70"
                  >
                    {uploadingAvatar ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{formData.name || 'Your Name'}</h3>
                <div className="inline-block mt-2 px-4 py-1 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600 rounded-full text-sm font-medium capitalize border border-primary-100/50">
                  <Sparkles className="h-3 w-3 inline mr-1 -mt-0.5" />
                  {user?.role || 'student'}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Account Status</p>
                  <span className="inline-flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-1.5" />Active
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-400 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 mr-1.5" />PrakashEdu Learner
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center justify-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {formData.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
