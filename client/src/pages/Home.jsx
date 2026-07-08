import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Play, Star, Users, Clock, Award, CheckCircle, ChevronRight, ChevronLeft, BookOpen, TrendingUp, Database, Cloud, Zap, Globe, Heart, ArrowRight, MessageCircle, GraduationCap, Briefcase, Calendar, Quote, Sparkles, Shield, Target, Layers, Bot, Code2, GitBranch, ChevronDown, HelpCircle, Menu, X, Phone, Mail, MapPin, PlayCircle, Video, Monitor, Smartphone, Sun, Moon, Facebook, Twitter, Instagram, Linkedin, ChevronUp, Camera, Gift, Percent, Timer, Rocket, BarChart3, Headphones, Coffee, ThumbsUp, PenTool, Eye, Cpu, Infinity, Medal, Gem, Flame } from 'lucide-react'
import axios from 'axios'
import { formatPrice } from '../utils/priceFormatter'

const useInView = (options = {}) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.unobserve(el) }
    }, { threshold: 0.1, ...options })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

const AnimatedSection = ({ children, className = '' }) => {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  )
}

const CountUp = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView])
  return <span ref={ref}>{count}{suffix}</span>
}

const StarRating = ({ rating = 0, size = 'h-4 w-4' }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`${size} ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
    ))}
  </div>
)

const FloatingBadge = ({ icon: Icon, text, subtext, position, color }) => (
  <div className={`absolute ${position} bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 animate-float hidden lg:flex items-center gap-3`}>
    <div className={`${color} p-2.5 rounded-xl`}><Icon className="h-5 w-5 text-white" /></div>
    <div><p className="text-sm font-bold text-gray-900">{text}</p><p className="text-xs text-gray-500">{subtext}</p></div>
  </div>
)

const Home = () => {
  const navigate = useNavigate()
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentSuccess, setCurrentSuccess] = useState(0)
  const [instructors, setInstructors] = useState([])
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [showAllCourses, setShowAllCourses] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [dealTimer, setDealTimer] = useState({ hours: 23, minutes: 59, seconds: 59 })
  const [activePricing, setActivePricing] = useState('monthly')

  useEffect(() => {
    fetchFeaturedCourses()
    fetchInstructors()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSuccess((prev) => (prev + 1) % successStories.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setDealTimer(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchFeaturedCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses?featured=true&limit=8')
      setFeaturedCourses(data.courses || [])
    } catch (error) {
      setFeaturedCourses(sampleCourses)
    }
  }

  const fetchInstructors = async () => {
    try {
      const { data } = await axios.get('/api/users/instructors')
      setInstructors(data.users || [])
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery)}`)
  }

  const partners = [
    { name: 'Google', icon: 'G' }, { name: 'Microsoft', icon: 'M' }, { name: 'Amazon', icon: 'A' },
    { name: 'Meta', icon: 'M' }, { name: 'Apple', icon: 'A' }, { name: 'Netflix', icon: 'N' },
    { name: 'Tesla', icon: 'T' }, { name: 'IBM', icon: 'I' }
  ]

  const categories = [
    { icon: Code2, title: 'Web Development', count: '48 Courses', color: 'from-blue-500 to-cyan-500', desc: 'HTML, CSS, React, Node.js & more' },
    { icon: Database, title: 'Data Science', count: '36 Courses', color: 'from-emerald-500 to-teal-500', desc: 'Python, ML, AI & Analytics' },
    { icon: Cloud, title: 'Cloud Computing', count: '24 Courses', color: 'from-orange-500 to-red-500', desc: 'AWS, Azure, GCP & DevOps' },
    { icon: Shield, title: 'Cybersecurity', count: '18 Courses', color: 'from-purple-500 to-pink-500', desc: 'Ethical Hacking, Security & More' },
    { icon: Smartphone, title: 'Mobile Apps', count: '22 Courses', color: 'from-indigo-500 to-purple-500', desc: 'React Native, Flutter & Swift' },
    { icon: PenTool, title: 'UI/UX Design', count: '15 Courses', color: 'from-pink-500 to-rose-500', desc: 'Figma, Adobe XD & Prototyping' },
    { icon: Cpu, title: 'AI & Robotics', count: '12 Courses', color: 'from-violet-500 to-purple-500', desc: 'Deep Learning, NLP & Computer Vision' },
    { icon: TrendingUp, title: 'Digital Marketing', count: '20 Courses', color: 'from-green-500 to-emerald-500', desc: 'SEO, Social Media & Analytics' }
  ]

  const learningPaths = [
    { icon: Rocket, title: 'Frontend Mastery', desc: 'HTML → CSS → JS → React → Advanced', courses: 12, hours: '180h', color: 'from-blue-500 to-cyan-500' },
    { icon: Database, title: 'Data Science Pro', desc: 'Python → Statistics → ML → Deep Learning', courses: 8, hours: '140h', color: 'from-emerald-500 to-teal-500' },
    { icon: Cloud, title: 'Cloud Architect', desc: 'Basics → AWS/Azure → DevOps → Security', courses: 10, hours: '160h', color: 'from-orange-500 to-red-500' },
    { icon: Bot, title: 'AI Engineer', desc: 'Python → Math → ML → NLP → Computer Vision', courses: 6, hours: '120h', color: 'from-purple-500 to-pink-500' },
    { icon: Globe, title: 'Full Stack Developer', desc: 'Frontend → Backend → Database → Deploy', courses: 14, hours: '220h', color: 'from-indigo-500 to-purple-500' },
    { icon: Shield, title: 'Security Expert', desc: 'Networking → Hacking → Defense → Compliance', courses: 7, hours: '100h', color: 'from-red-500 to-rose-500' }
  ]

  const webinars = [
    { title: 'Building AI Apps with Python', date: 'Jul 15, 2026', time: '3:00 PM EST', instructor: 'Dr. Sarah Lin', attendees: 1240, status: 'upcoming', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400' },
    { title: 'Modern React Patterns', date: 'Jul 18, 2026', time: '2:00 PM EST', instructor: 'James Wilson', attendees: 980, status: 'upcoming', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
    { title: 'Cloud Migration Strategies', date: 'Jul 12, 2026', time: '1:00 PM EST', instructor: 'Priya Patel', attendees: 750, status: 'live', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' },
    { title: 'UX Research Methods', date: 'Jul 20, 2026', time: '4:00 PM EST', instructor: 'Maria Garcia', attendees: 620, status: 'upcoming', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400' }
  ]

  const pricingPlans = [
    { name: 'Starter', price: { monthly: 0, yearly: 0 }, icon: Rocket, popular: false, features: ['Access to 50+ free courses', 'Community forum access', 'Basic progress tracking', '30-day money back guarantee'], cta: 'Get Started Free' },
    { name: 'Pro', price: { monthly: 499, yearly: 3999 }, icon: Gem, popular: true, features: ['All Starter features', '500+ premium courses', 'Certificates of completion', 'Project reviews', 'Priority support', 'Career counseling'], cta: 'Start Pro Trial' },
    { name: 'Enterprise', price: { monthly: 999, yearly: 8999 }, icon: Briefcase, popular: false, features: ['All Pro features', 'Team management dashboard', 'Custom learning paths', 'Dedicated success manager', 'API access', 'Bulk enrollment', 'Analytics & reports'], cta: 'Contact Sales' }
  ]

  const blogPosts = [
    { title: 'Top 10 Web Development Trends in 2026', excerpt: 'Stay ahead with the latest frameworks, tools, and best practices shaping the web development landscape this year.', date: 'Jul 5, 2026', author: 'Alex Turner', category: 'Web Development', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400', readTime: '5 min' },
    { title: 'How to Break into Data Science', excerpt: 'A complete roadmap for beginners looking to start a career in data science with no prior experience.', date: 'Jul 3, 2026', author: 'Dr. Lisa Chen', category: 'Data Science', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', readTime: '7 min' },
    { title: 'The Future of AI in Education', excerpt: 'Explore how artificial intelligence is revolutionizing online learning and personalized education.', date: 'Jun 28, 2026', author: 'Mike Roberts', category: 'AI', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400', readTime: '6 min' },
    { title: 'Mastering Remote Collaboration', excerpt: 'Essential tools and techniques for effective team collaboration in distributed work environments.', date: 'Jun 25, 2026', author: 'Sarah Palmer', category: 'Career', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', readTime: '4 min' }
  ]

  const successStories = [
    { name: 'James Rodriguez', role: 'Frontend Developer at Google', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop', story: 'Went from self-taught beginner to professional developer in 6 months. The structured curriculum and mentor support made all the difference.', from: '$45k', to: '$120k', years: '1 year' },
    { name: 'Aisha Patel', role: 'Data Analyst at Amazon', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop', story: 'Transitioned from retail management to data analytics. The hands-on projects gave me real portfolio pieces that impressed hiring managers.', from: '$38k', to: '$95k', years: '8 months' },
    { name: 'Tom Harrison', role: 'DevOps Engineer at Netflix', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop', story: 'The cloud computing path completely changed my career trajectory. Got promoted within 6 months of completing the AWS certification course.', from: '$70k', to: '$150k', years: '1.5 years' }
  ]

  const certificationBenefits = [
    { icon: Medal, title: 'Industry Recognized', desc: 'Our certificates are valued by Fortune 500 companies worldwide', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: CheckCircle, title: 'Verified & Shareable', desc: 'Add certificates to LinkedIn, resume, and professional profiles', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Award, title: 'Skill-Based', desc: 'Demonstrate practical skills, not just theoretical knowledge', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Infinity, title: 'Lifetime Access', desc: 'Your certificates never expire - showcase them forever', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Target, title: 'Employer Trusted', desc: 'Trusted by HR teams at 5,000+ companies for hiring', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Globe, title: 'Globally Accepted', desc: 'Recognized across 100+ countries worldwide', color: 'text-indigo-500', bg: 'bg-indigo-50' }
  ]

  const achievements = [
    { icon: Medal, label: 'Top Rated', value: '4.9/5' },
    { icon: Users, label: 'Learners', value: '50K+' },
    { icon: BookOpen, label: 'Courses', value: '500+' },
    { icon: Award, label: 'Certificates', value: '25K+' },
    { icon: Briefcase, label: 'Job Placements', value: '10K+' },
    { icon: Globe, label: 'Countries', value: '150+' }
  ]

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer at Google', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop', content: 'This platform transformed my career. The courses are well-structured and the instructors are amazing. I went from junior developer to senior engineer in just 8 months!', rating: 5 },
    { name: 'Michael Chen', role: 'Data Scientist at Netflix', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop', content: 'The machine learning courses here are top-notch. The hands-on projects helped me build a portfolio that impressed interviewers at top tech companies.', rating: 5 },
    { name: 'Emily Rodriguez', role: 'UX Designer at Airbnb', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop', content: 'I love the flexibility of learning at my own pace. The UI/UX design courses helped me transition from graphic design to product design seamlessly.', rating: 5 },
    { name: 'David Kim', role: 'Full Stack Developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop', content: 'Best investment I ever made. The MERN stack course gave me all the skills I needed to build my own startup. Highly recommend!', rating: 5 },
    { name: 'Lisa Wang', role: 'Cloud Architect at AWS', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop', content: 'The cloud certification prep courses are incredibly thorough. Passed my AWS Solutions Architect exam on the first try thanks to this platform.', rating: 5 }
  ]

  const stats = [
    { icon: Users, value: '50K', suffix: '+', label: 'Active Students' },
    { icon: BookOpen, value: '500', suffix: '+', label: 'Expert Courses' },
    { icon: Award, value: '25K', suffix: '+', label: 'Certificates Issued' },
    { icon: Star, value: '4.9', label: 'Average Rating' }
  ]

  const features = [
    { icon: GraduationCap, title: 'Expert Instructors', description: 'Learn from industry professionals with real-world experience', color: 'from-primary-500 to-accent-600' },
    { icon: Clock, title: 'Learn Anytime', description: 'Access courses 24/7 at your own pace from anywhere', color: 'from-emerald-500 to-teal-600' },
    { icon: Award, title: 'Recognized Certificates', description: 'Earn certificates valued by top employers worldwide', color: 'from-amber-500 to-orange-600' },
    { icon: TrendingUp, title: 'Career Growth', description: 'Develop skills that directly impact your career advancement', color: 'from-blue-500 to-indigo-600' },
    { icon: Globe, title: 'Global Community', description: 'Connect with learners and instructors from around the world', color: 'from-cyan-500 to-blue-600' },
    { icon: Zap, title: 'Latest Technologies', description: 'Stay updated with cutting-edge tools and frameworks', color: 'from-purple-500 to-pink-600' }
  ]

  const howItWorks = [
    { step: '01', title: 'Choose Your Course', description: 'Browse our catalog of 500+ courses and select what matches your goals', icon: Search },
    { step: '02', title: 'Learn at Your Pace', description: 'Watch video lessons, complete assignments, and track your progress', icon: Play },
    { step: '03', title: 'Practice & Apply', description: 'Work on real-world projects and build your professional portfolio', icon: Code2 },
    { step: '04', title: 'Get Certified', description: 'Earn recognized certificates and showcase your achievements', icon: Award }
  ]

  const sampleCourses = [
    { _id: '1', title: 'Complete Web Development Bootcamp 2024', slug: 'web-development-bootcamp', description: 'Become a full-stack developer with HTML, CSS, JavaScript, React, Node.js and more', thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600', price: 7499, discountPrice: 4499, category: 'Web Development', level: 'beginner', instructor: { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' }, averageRating: 4.8, totalRatings: 2547, totalStudents: 15420, isFeatured: true },
    { _id: '2', title: 'Python for Data Science & Machine Learning', slug: 'python-data-science', description: 'Master Python for data analysis, visualization, and ML algorithms', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600', price: 8999, discountPrice: 5499, category: 'Data Science', level: 'intermediate', instructor: { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' }, averageRating: 4.9, totalRatings: 3210, totalStudents: 21500, isFeatured: true },
    { _id: '3', title: 'React Native - Build Mobile Apps', slug: 'react-native-mobile', description: 'Create cross-platform mobile applications with React Native', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600', price: 6499, discountPrice: 3999, category: 'Mobile Development', level: 'intermediate', instructor: { name: 'Alex Chen', avatar: 'https://ui-avatars.com/api/?name=Alex+Chen' }, averageRating: 4.7, totalRatings: 1890, totalStudents: 11200, isFeatured: true },
    { _id: '4', title: 'UI/UX Design Masterclass', slug: 'ui-ux-design', description: 'Design beautiful interfaces and user experiences from scratch', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', price: 5499, discountPrice: 3499, category: 'Design', level: 'beginner', instructor: { name: 'Sarah Wilson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson' }, averageRating: 4.8, totalRatings: 2150, totalStudents: 18500, isFeatured: true },
    { _id: '5', title: 'AWS Cloud Practitioner Certification', slug: 'aws-cloud', description: 'Prepare for AWS certification and master cloud computing', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', price: 10999, discountPrice: 6999, category: 'Cloud Computing', level: 'advanced', instructor: { name: 'Mike Johnson', avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson' }, averageRating: 4.9, totalRatings: 1450, totalStudents: 9800, isFeatured: true },
    { _id: '6', title: 'Cybersecurity Fundamentals', slug: 'cybersecurity', description: 'Learn ethical hacking, network security, and protection techniques', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600', price: 7499, discountPrice: 4499, category: 'Cybersecurity', level: 'beginner', instructor: { name: 'Lisa Brown', avatar: 'https://ui-avatars.com/api/?name=Lisa+Brown' }, averageRating: 4.6, totalRatings: 1680, totalStudents: 12300, isFeatured: true },
    { _id: '7', title: 'Digital Marketing Strategy', slug: 'digital-marketing', description: 'Master SEO, social media, email marketing, and paid advertising', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', price: 4999, discountPrice: 2999, category: 'Marketing', level: 'beginner', instructor: { name: 'David Park', avatar: 'https://ui-avatars.com/api/?name=David+Park' }, averageRating: 4.5, totalRatings: 2100, totalStudents: 16800, isFeatured: false },
    { _id: '8', title: 'Blockchain & Web3 Development', slug: 'blockchain-web3', description: 'Build decentralized apps, smart contracts, and explore the Web3 ecosystem', thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600', price: 8499, discountPrice: 5299, category: 'Blockchain', level: 'advanced', instructor: { name: 'Ananya Singh', avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh' }, averageRating: 4.7, totalRatings: 980, totalStudents: 7200, isFeatured: false }
  ]

  const faqs = [
    { question: 'How do I enroll in a course?', answer: 'Simply browse our catalog, select a course, and click Enroll Now. For free courses you get instant access. For paid courses complete the checkout process and gain immediate access to all materials.' },
    { question: 'Can I access courses on mobile?', answer: 'Absolutely! Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, and computers. Learn anywhere, anytime at your convenience.' },
    { question: 'Do I get a certificate after completion?', answer: 'Yes! Upon completing a course you will receive a verified certificate of completion that you can share on LinkedIn, add to your resume, or showcase to potential employers.' },
    { question: 'What if I am not satisfied with a course?', answer: 'We offer a 30-day money-back guarantee. If you are not completely satisfied contact our support team within 30 days for a full refund no questions asked.' },
    { question: 'Are the courses updated regularly?', answer: 'Yes! Our instructors regularly update course content to reflect the latest industry trends, tools, and best practices. You will always have access to the most current material.' },
    { question: 'Is there a mobile app available?', answer: 'Yes! Download our mobile app from the App Store or Google Play Store to learn on-the-go with offline access, push notifications, and seamless syncing across devices.' },
    { question: 'Can I switch my subscription plan?', answer: 'You can upgrade or downgrade your subscription at any time. Changes take effect immediately and we will prorate any differences in billing.' }
  ]

  const displayedCourses = (featuredCourses.length > 0 ? featuredCourses : sampleCourses).slice(0, showAllCourses ? undefined : 4)
  const activeCourses = displayedCourses.filter(c => activeCategory === 'all' || c.category?.toLowerCase() === activeCategory.toLowerCase())
  const displayCourses = activeCourses.length > 0 ? activeCourses : displayedCourses

  return (
    <div className="min-h-screen bg-white">
      {/* ======== 1. HERO ======== */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-primary-200">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>Trusted by 50,000+ learners worldwide</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-balance">
                Unlock Your{' '}
                <span className="bg-gradient-to-r from-primary-300 via-accent-300 to-yellow-300 bg-clip-text text-transparent">Potential</span>
                <br />with Expert-Led Learning
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed">
                Master in-demand skills with 500+ courses taught by industry experts. Learn at your own pace and advance your career.
              </p>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to learn today?" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-primary-500 to-accent-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-600 hover:to-accent-700 transition-all shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:-translate-y-0.5 whitespace-nowrap">
                  <Search className="h-5 w-5 inline mr-2" />Search
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">U{i}</div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-primary-500 flex items-center justify-center text-xs font-bold text-white">5K+</div>
                </div>
                <div>
                  <StarRating rating={4.9} size="h-4 w-4" />
                  <p className="text-sm text-gray-400 mt-0.5">Trusted by 50,000+ students</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/courses" className="bg-gradient-to-r from-primary-500 to-accent-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-primary-600 hover:to-accent-700 transition-all shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:-translate-y-0.5">
                  <Sparkles className="h-5 w-5 inline mr-2" />Explore Courses
                </Link>
                <Link to="/register" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all">
                  <Play className="h-5 w-5 inline mr-2" />Start Free Trial
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop" alt="Students learning" className="w-full h-auto rounded-3xl shadow-2xl object-cover" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-900/20 via-transparent to-transparent" />
                <FloatingBadge icon={Award} text="Get Certified" subtext="Industry recognized" position="-top-6 -right-6" color="bg-gradient-to-br from-amber-500 to-orange-600" />
                <FloatingBadge icon={Play} text="500+ Courses" subtext="Expert taught" position="-bottom-6 -left-6" color="bg-gradient-to-br from-primary-500 to-accent-600" />
                <FloatingBadge icon={Users} text="50K Students" subtext="Growing daily" position="top-1/2 -right-20" color="bg-gradient-to-br from-emerald-500 to-teal-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ======== 2. TRUSTED BY PARTNERS ======== */}
      <AnimatedSection>
        <section className="py-12 lg:py-16 bg-gray-50/50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams from leading companies</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {partners.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300 hover:text-gray-400 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">{p.icon}</div>
                  <span className="text-lg font-semibold text-gray-400">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 3. STATS COUNTER ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="relative text-center p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    <CountUp end={parseInt(stat.value)} suffix={stat.suffix || ''} />{stat.suffix === '+' && '+'}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 4. POPULAR CATEGORIES ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-100 mb-4">
                <Layers className="h-4 w-4 mr-1.5" />Categories
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Explore Popular Categories</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Choose from 8+ categories covering the most in-demand tech skills</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat, i) => (
                <Link key={i} to={`/courses?category=${encodeURIComponent(cat.title)}`} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${cat.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{cat.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-primary-600">{cat.count}</span>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 5. FEATURED COURSES ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-100 mb-4">
                  <BookOpen className="h-4 w-4 mr-1.5" />Featured Courses
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Top-Rated Courses</h2>
                <p className="text-lg text-gray-500 mt-4">Hand-picked courses to accelerate your learning journey</p>
              </div>
              <div className="flex items-center gap-4">
                {['all', 'web development', 'data science', 'cloud computing', 'design'].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {cat === 'all' ? 'All' : cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayCourses.map((course, i) => (
                <Link key={course._id} to={`/courses/${course.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="relative overflow-hidden aspect-video">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3"><Play className="h-10 w-10 text-white bg-white/20 backdrop-blur-sm rounded-full p-2" /></div>
                    </div>
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{course.level}</span>
                    {course.discountPrice && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{Math.round((1 - course.discountPrice / course.price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full inline-block w-fit mb-2">{course.category}</span>
                    <div className="flex items-center gap-1 mb-2">
                      <StarRating rating={course.averageRating} size="h-3.5 w-3.5" />
                      <span className="text-xs text-gray-400 ml-1">({course.totalRatings})</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <img src={course.instructor.avatar} alt="" className="h-6 w-6 rounded-full" />
                        <span className="text-xs text-gray-500 truncate">{course.instructor.name}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-400">{course.totalStudents}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      {course.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">{formatPrice(course.discountPrice)}</span>
                          <span className="text-sm text-gray-400 line-through">{formatPrice(course.price)}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">{course.price === 0 ? 'Free' : formatPrice(course.price)}</span>
                      )}
                      <span className="text-primary-600 group-hover:translate-x-1 transition-transform"><ArrowRight className="h-5 w-5" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <button onClick={() => setShowAllCourses(!showAllCourses)} className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg group">
                {showAllCourses ? 'Show Less' : 'View All Courses'}
                <ChevronDown className={`h-5 w-5 transition-transform ${showAllCourses ? 'rotate-180' : ''} group-hover:translate-y-0.5`} />
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 6. LEARNING PATHS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20 mb-4 backdrop-blur-sm">
                <Target className="h-4 w-4 mr-1.5" />Career Tracks
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Structured Learning Paths</h2>
              <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">Follow curated career tracks designed to take you from beginner to job-ready</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map((path, i) => (
                <div key={i} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${path.color} mb-4`}>
                    <path.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{path.desc}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{path.courses} courses</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{path.hours}</span>
                  </div>
                  <Link to="/courses" className="mt-4 inline-flex items-center text-sm font-semibold text-primary-300 hover:text-primary-200 gap-1 group-hover:gap-2 transition-all">
                    Explore Path <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 7. HOW IT WORKS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-100 mb-4">
                <Zap className="h-4 w-4 mr-1.5" />Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">How It Works</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Start learning in just four simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {howItWorks.map((step, i) => (
                <div key={i} className="relative text-center group">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-200 to-primary-400">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t-2 border-r-2 border-primary-400" />
                    </div>
                  )}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 flex items-center justify-center group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                    <step.icon className="h-12 w-12 text-primary-600" />
                  </div>
                  <div className="absolute top-2 right-1/2 translate-x-20 bg-primary-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 8. WHY CHOOSE US ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20 mb-4 backdrop-blur-sm">
                <Heart className="h-4 w-4 mr-1.5" />Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Built for Your Success</h2>
              <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">Everything you need to succeed in your learning journey</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, i) => (
                <div key={i} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${feat.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <feat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 9. SPECIAL OFFERS / DEALS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm">
                  <Gift className="h-4 w-4 mr-2 text-yellow-300" />Limited Time Offer
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">Save Up to <span className="text-yellow-300">40%</span> on Premium Courses</h2>
                <p className="text-lg text-red-100">Enroll today and get lifetime access with certificate. Offer ends soon!</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <Timer className="h-6 w-6 text-yellow-300" />
                    <div className="flex items-center gap-3 text-2xl font-bold tabular-nums">
                      <span className="bg-white/20 px-3 py-1 rounded-lg">{String(dealTimer.hours).padStart(2, '0')}</span>
                      <span className="text-red-300">:</span>
                      <span className="bg-white/20 px-3 py-1 rounded-lg">{String(dealTimer.minutes).padStart(2, '0')}</span>
                      <span className="text-red-300">:</span>
                      <span className="bg-white/20 px-3 py-1 rounded-lg">{String(dealTimer.seconds).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/courses" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-yellow-300 transition-all shadow-xl"><Percent className="h-5 w-5 inline mr-2" />Claim Discount</Link>
                  <Link to="/courses" className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all">Browse Deals</Link>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1553729459-afe8f2e6ad7e?w=500&h=400&fit=crop" alt="Sale" className="rounded-3xl shadow-2xl" />
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 rounded-full w-24 h-24 flex items-center justify-center text-2xl font-extrabold shadow-xl animate-pulse-slow">
                    <div className="text-center"><span className="text-sm block -mb-1">UP TO</span>40%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 10. LIVE WEBINARS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100 mb-4">
                <Video className="h-4 w-4 mr-1.5" />Live Events
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Upcoming Live Webinars</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Join live sessions with industry experts and get your questions answered</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {webinars.map((webinar, i) => (
                <div key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img src={webinar.image} alt={webinar.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${webinar.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-white/90 text-gray-800'}`}>
                        {webinar.status === 'live' ? '🔴 Live Now' : 'Upcoming'}
                      </span>
                      <span className="text-xs text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">{webinar.date}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{webinar.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="h-3.5 w-3.5" />{webinar.date} <span className="text-gray-300">|</span> {webinar.time}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{webinar.instructor.charAt(0)}</div>
                        <span className="text-xs text-gray-500 truncate">{webinar.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="h-3.5 w-3.5" />{webinar.attendees}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/webinars" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group">
                View All Webinars <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 11. ACHIEVEMENTS / GAMIFICATION ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-amber-100 mb-4">
                <Medal className="h-4 w-4 mr-1.5" />Our Achievements
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">By the Numbers</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Our growing community of learners and educators</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {achievements.map((a, i) => (
                <div key={i} className="text-center p-5 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <a.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900">{a.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 12. EXPERT INSTRUCTORS ======== */}
      {instructors.length > 0 && (
        <AnimatedSection>
          <section className="py-16 lg:py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="inline-flex items-center bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-100 mb-4">
                  <GraduationCap className="h-4 w-4 mr-1.5" />Expert Instructors
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Learn From Industry Experts</h2>
                <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Our instructors are passionate educators with years of industry experience</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {instructors.slice(0, 4).map((instructor, i) => (
                  <div key={i} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                    <img src={instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=3b82f6&color=fff&size=128`} alt={instructor.name} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover ring-4 ring-primary-50 group-hover:ring-primary-200 transition-all" />
                    <h3 className="font-bold text-gray-900">{instructor.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{instructor.headline || 'Expert Instructor'}</p>
                    <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{instructor.createdCourses?.length || 0} courses</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{instructor.totalStudents || 0}</span>
                    </div>
                    {instructor.bio && <p className="text-xs text-gray-400 mt-3 line-clamp-2">{instructor.bio}</p>}
                  </div>
                ))}
              </div>
              {instructors.length > 4 && (
                <div className="text-center mt-8">
                  <Link to="/instructor" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg group">
                    View All Instructors <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ======== 13. STUDENT SUCCESS STORIES ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.03]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100 mb-4">
                <TrendingUp className="h-4 w-4 mr-1.5" />Success Stories
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Real Career Transformations</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Hear from our alumni who landed their dream jobs</p>
            </div>
            <div className="max-w-4xl mx-auto">
              {successStories.map((story, i) => (
                <div key={i} className={`transition-all duration-500 ${currentSuccess === i ? 'block' : 'hidden'}`}>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 lg:p-10 border border-green-100">
                    <Quote className="h-10 w-10 text-green-300 mb-6" />
                    <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 italic">&ldquo;{story.story}&rdquo;</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <img src={story.image} alt={story.name} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white" />
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{story.name}</p>
                          <p className="text-sm text-gray-500">{story.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:ml-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-green-200 sm:border-l sm:border-green-200 sm:pl-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Was</p>
                          <p className="text-lg font-bold text-red-500">{story.from}<span className="text-xs font-normal text-gray-400">/yr</span></p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-green-400" />
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Now</p>
                          <p className="text-lg font-bold text-green-600">{story.to}<span className="text-xs font-normal text-gray-400">/yr</span></p>
                        </div>
                        <div className="text-center pl-4 border-l border-green-200">
                          <p className="text-xs text-gray-400">Timeline</p>
                          <p className="text-lg font-bold text-primary-600">{story.years}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-2 mt-6">
                {successStories.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSuccess(i)} className={`h-2 rounded-full transition-all duration-300 ${currentSuccess === i ? 'w-8 bg-green-500' : 'w-2 bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 14. TESTIMONIALS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-purple-100 mb-4">
                <MessageCircle className="h-4 w-4 mr-1.5" />Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">What Our Students Say</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Hear directly from our community of learners</p>
            </div>
            <div className="max-w-3xl mx-auto relative">
              <button onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:shadow-lg transition-all shadow-md">
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:shadow-lg transition-all shadow-md">
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
              <div className="overflow-hidden">
                {testimonials.map((t, i) => (
                  <div key={i} className={`transition-all duration-500 ${currentTestimonial === i ? 'block' : 'hidden'}`}>
                    <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 text-center">
                      <Quote className="h-8 w-8 text-primary-300 mx-auto mb-6" />
                      <StarRating rating={t.rating} size="h-5 w-5" />
                      <p className="text-lg text-gray-600 leading-relaxed mt-6 mb-8 italic max-w-xl mx-auto">&ldquo;{t.content}&rdquo;</p>
                      <img src={t.image} alt={t.name} className="h-16 w-16 rounded-full mx-auto mb-3 object-cover ring-4 ring-primary-50" />
                      <p className="font-bold text-gray-900 text-lg">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrentTestimonial(i)} className={`h-2 rounded-full transition-all duration-300 ${currentTestimonial === i ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 15. CERTIFICATION BENEFITS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-yellow-100 mb-4">
                <Award className="h-4 w-4 mr-1.5" />Certification
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Why Get Certified?</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Our certificates open doors to new career opportunities</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificationBenefits.map((ben, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`${ben.bg} p-3.5 rounded-2xl flex-shrink-0`}>
                    <ben.icon className={`h-6 w-6 ${ben.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{ben.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{ben.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 16. PRICING PLANS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20 mb-4 backdrop-blur-sm">
                <Gem className="h-4 w-4 mr-1.5" />Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">Choose the plan that fits your learning goals</p>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-1.5 mt-6">
                <button onClick={() => setActivePricing('monthly')} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activePricing === 'monthly' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-300 hover:text-white'}`}>Monthly</button>
                <button onClick={() => setActivePricing('yearly')} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activePricing === 'yearly' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-300 hover:text-white'}`}>Yearly <span className="text-green-400 text-xs ml-1">Save 33%</span></button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div key={i} className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${plan.popular ? 'bg-white text-gray-900 ring-2 ring-primary-500 shadow-2xl scale-105 lg:scale-110' : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10'}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>}
                  <plan.icon className={`h-10 w-10 mb-4 ${plan.popular ? 'text-primary-600' : 'text-white'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-gray-900' : 'text-white'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-5xl font-extrabold ${plan.popular ? 'text-gray-900' : 'text-white'}`}>₹{activePricing === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                    <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-400'}`}>/{activePricing === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-green-500' : 'text-green-400'}`} />
                        <span className={plan.popular ? 'text-gray-600' : 'text-gray-300'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className={`block w-full text-center py-3.5 rounded-2xl font-semibold transition-all ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 17. MOBILE APP ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary-100">
                  <Smartphone className="h-4 w-4 mr-1.5" />Mobile App
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Learn Anywhere, Anytime</h2>
                <p className="text-lg text-gray-500 leading-relaxed">Download our mobile app and access thousands of courses offline. Seamlessly sync your progress across all devices.</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition-all cursor-pointer shadow-lg">
                    <Smartphone className="h-8 w-8" />
                    <div><p className="text-xs text-gray-400">Download on the</p><p className="font-bold">App Store</p></div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition-all cursor-pointer shadow-lg">
                    <Monitor className="h-8 w-8" />
                    <div><p className="text-xs text-gray-400">Get it on</p><p className="font-bold">Google Play</p></div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500 pt-2">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" />Offline Access</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" />Push Notifications</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" />Sync Across Devices</span>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=500&fit=crop" alt="Mobile app" className="h-[400px] rounded-3xl shadow-2xl object-cover" />
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
                    <StarRating rating={4.9} size="h-4 w-4" />
                    <span className="text-sm font-semibold text-gray-900">4.9 App Store</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 18. LATEST BLOG POSTS ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-100 mb-4">
                <BookOpen className="h-4 w-4 mr-1.5" />Blog
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Latest Articles</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Tips, tutorials, and insights from our expert instructors</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {blogPosts.map((post, i) => (
                <Link key={i} to="/blog" className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-800">{post.category}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span>{post.date}</span>
                      <span className="text-gray-300">·</span>
                      <span>{post.readTime} read</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">{post.author.charAt(0)}</div>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 group">
                View All Articles <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 19. COMMUNITY / DISCUSSION ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-purple-100">
                  <MessageCircle className="h-4 w-4 mr-1.5" />Community
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Join Our Learning Community</h2>
                <p className="text-lg text-gray-500 leading-relaxed">Connect with 50,000+ learners from around the world. Share knowledge, ask questions, and grow together.</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">U{i}</div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-xs font-bold text-white">+</div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-gray-900">50K+ Active Members</p>
                    <p className="text-sm text-gray-500">Growing every day</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/community" className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-purple-700 transition-all shadow-lg">Join Discussion</Link>
                  <Link to="/chat" className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"><MessageCircle className="h-4 w-4 inline mr-2" />Start Chatting</Link>
                </div>
              </div>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1529155422123-4bebfb6c4455?w=500&h=400&fit=crop" alt="Community" className="rounded-3xl shadow-2xl" />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Active Discussions</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />234 topics</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />1.2K online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 20. DAILY STREAK / GAMIFICATION ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-amber-100 mb-4">
                <Flame className="h-4 w-4 mr-1.5" />Stay Motivated
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Keep Your Learning Streak Alive</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Build daily learning habits with our gamification system and earn rewards</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Calendar, title: 'Daily Streaks', desc: 'Learn every day to maintain your streak and earn bonus points', color: 'from-orange-500 to-red-500' },
                { icon: Medal, title: 'Achievement Badges', desc: 'Unlock badges for completing courses, milestones, and challenges', color: 'from-yellow-500 to-amber-600' },
                { icon: Target, title: 'Learning Goals', desc: 'Set daily and weekly goals to stay on track with your learning', color: 'from-green-500 to-emerald-600' },
                { icon: Award, title: 'Leaderboards', desc: 'Compete with peers and climb the rankings as you learn', color: 'from-purple-500 to-pink-600' }
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-white border border-amber-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${item.color} mb-4`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 21. FAQ ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-28 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100 mb-4">
                <HelpCircle className="h-4 w-4 mr-1.5" />FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-500 mt-4">Find answers to common questions about our platform</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full px-8 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                    <ChevronDown className={`ml-4 h-5 w-5 text-primary-500 flex-shrink-0 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-8 pb-5 animate-fade-down">
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 22. NEWSLETTER ======== */}
      <AnimatedSection>
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <Mail className="h-12 w-12 mx-auto mb-6 text-primary-200" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">Get the latest courses, learning tips, and career advice delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); toast?.success?.('Subscribed! Check your inbox.') }}>
              <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 text-base" required />
              <button type="submit" className="bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all shadow-xl whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-sm text-primary-200 mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 23. FINAL CTA ======== */}
      <AnimatedSection>
        <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <Sparkles className="h-12 w-12 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ students already learning on PrakashEdu. Get started today with a free account and explore hundreds of courses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="bg-gradient-to-r from-primary-500 to-accent-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-primary-600 hover:to-accent-700 transition-all shadow-2xl shadow-primary-500/30 hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Get Started Free
              </Link>
              <Link to="/courses" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Browse Courses
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" />No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" />30-day money-back</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" />Learn at your own pace</span>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ======== 24. FOOTER ======== */}
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PrakashEdu</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">Empowering learners worldwide with expert-led courses, hands-on projects, and recognized certifications.</p>
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <Link key={i} to="#" className="h-10 w-10 rounded-xl bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-all hover:-translate-y-0.5">
                    <Icon className="h-5 w-5 text-gray-400 hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>
            {[
              { title: 'Courses', links: ['Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'Mobile Apps', 'UI/UX Design'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Partners', 'Affiliate'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs', 'Refund Policy', 'Community', 'Status'] },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{col.title}</h3>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; 2026 PrakashEdu. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-gray-300 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home