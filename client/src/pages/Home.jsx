import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Play, Star, Users, Clock, Award, CheckCircle, ChevronRight, ChevronLeft, BookOpen, Code, Palette, TrendingUp, Database, Shield, Cloud, Smartphone, Zap, Globe, Heart, ArrowRight, MessageCircle, GraduationCap, Briefcase } from 'lucide-react'
import axios from 'axios'
import { formatPrice } from '../utils/priceFormatter'

const Home = () => {
  const navigate = useNavigate()
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchFeaturedCourses()
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const fetchFeaturedCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses?featured=true&limit=6')
      setFeaturedCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setFeaturedCourses(sampleCourses)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/courses/categories')
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'This platform transformed my career. The courses are well-structured and the instructors are amazing. I went from junior developer to senior engineer in just 8 months!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist at Netflix',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      content: 'The machine learning courses here are top-notch. The hands-on projects helped me build a portfolio that impressed interviewers at top tech companies.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer at Airbnb',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content: 'I love the flexibility of learning at my own pace. The UI/UX design courses helped me transition from graphic design to product design seamlessly.',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Full Stack Developer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      content: 'Best investment I ever made. The MERN stack course gave me all the skills I needed to build my own startup. Highly recommend!',
      rating: 5
    }
  ]

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Students' },
    { icon: BookOpen, value: '500+', label: 'Expert Courses' },
    { icon: Award, value: '25K+', label: 'Certificates Issued' },
    { icon: Star, value: '4.9', label: 'Average Rating' }
  ]

  const features = [
    {
      icon: GraduationCap,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: Clock,
      title: 'Learn Anytime',
      description: 'Access courses 24/7 at your own pace from anywhere'
    },
    {
      icon: Award,
      title: 'Recognized Certificates',
      description: 'Earn certificates that are valued by top employers'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Develop skills that directly impact your career advancement'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with learners and instructors from around the world'
    },
    {
      icon: Zap,
      title: 'Latest Technologies',
      description: 'Stay updated with cutting-edge tools and frameworks'
    }
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Choose Your Course',
      description: 'Browse our extensive catalog and select courses that match your goals'
    },
    {
      step: '02',
      title: 'Learn at Your Pace',
      description: 'Watch video lessons, complete assignments, and track your progress'
    },
    {
      step: '03',
      title: 'Practice & Apply',
      description: 'Work on real-world projects and build your portfolio'
    },
    {
      step: '04',
      title: 'Get Certified',
      description: 'Earn certificates and showcase your achievements'
    }
  ]

  const sampleCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp 2024',
      slug: 'web-development-bootcamp',
      description: 'Become a full-stack developer with HTML, CSS, JavaScript, React, Node.js and more',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
      price: 7499,
      discountPrice: 4499,
      category: 'Web Development',
      level: 'beginner',
      instructor: { name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
      averageRating: 4.8,
      totalRatings: 2547,
      totalStudents: 15420,
      isFeatured: true
    },
    {
      _id: '2',
      title: 'Python for Data Science & Machine Learning',
      slug: 'python-data-science',
      description: 'Master Python for data analysis, visualization, and ML algorithms',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
      price: 8999,
      discountPrice: 5499,
      category: 'Data Science',
      level: 'intermediate',
      instructor: { name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
      averageRating: 4.9,
      totalRatings: 3210,
      totalStudents: 21500,
      isFeatured: true
    },
    {
      _id: '3',
      title: 'React Native - Build Mobile Apps',
      slug: 'react-native-mobile',
      description: 'Create cross-platform mobile applications with React Native',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
      price: 6499,
      discountPrice: 3999,
      category: 'Mobile Development',
      level: 'intermediate',
      instructor: { name: 'Alex Chen', avatar: 'https://ui-avatars.com/api/?name=Alex+Chen' },
      averageRating: 4.7,
      totalRatings: 1890,
      totalStudents: 11200,
      isFeatured: true
    },
    {
      _id: '4',
      title: 'UI/UX Design Masterclass',
      slug: 'ui-ux-design',
      description: 'Design beautiful interfaces and user experiences from scratch',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
      price: 5499,
      discountPrice: 3499,
      category: 'Design',
      level: 'beginner',
      instructor: { name: 'Sarah Wilson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson' },
      averageRating: 4.8,
      totalRatings: 2150,
      totalStudents: 18500,
      isFeatured: true
    },
    {
      _id: '5',
      title: 'AWS Cloud Practitioner Certification',
      slug: 'aws-cloud',
      description: 'Prepare for AWS certification and master cloud computing',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
      price: 10999,
      discountPrice: 6999,
      category: 'Cloud Computing',
      level: 'advanced',
      instructor: { name: 'Mike Johnson', avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson' },
      averageRating: 4.9,
      totalRatings: 1450,
      totalStudents: 9800,
      isFeatured: true
    },
    {
      _id: '6',
      title: 'Cybersecurity Fundamentals',
      slug: 'cybersecurity',
      description: 'Learn ethical hacking, network security, and protection',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
      price: 7499,
      discountPrice: 4499,
      category: 'Cybersecurity',
      level: 'beginner',
      instructor: { name: 'Lisa Brown', avatar: 'https://ui-avatars.com/api/?name=Lisa+Brown' },
      averageRating: 4.6,
      totalRatings: 1680,
      totalStudents: 12300,
      isFeatured: true
    }
  ]

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our catalog, select a course, and click "Enroll". For free courses, you get instant access. For paid courses, you\'ll complete the checkout process and gain immediate access to all course materials.'
    },
    {
      question: 'Can I access courses on mobile?',
      answer: 'Absolutely! Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, and computers. Learn anywhere, anytime.'
    },
    {
      question: 'Do I get a certificate after completion?',
      answer: 'Yes! Upon completing a course, you\'ll receive a certificate of completion that you can share on LinkedIn, add to your resume, or showcase to potential employers.'
    },
    {
      question: 'What if I\'m not satisfied with a course?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied with a course, contact our support team within 30 days for a full refund.'
    },
    {
      question: 'Are the courses updated regularly?',
      answer: 'Yes! Our instructors regularly update course content to reflect the latest industry trends, tools, and best practices. You\'ll always have access to the most current material.'
    }
  ]

  const [expandedFaq, setExpandedFaq] = useState(null)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="bg-green-400 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm">Join 50,000+ learners worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Unlock Your Potential with{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Expert-Led Learning
                </span>
              </h1>
              
              <p className="text-xl text-primary-100 leading-relaxed">
                Transform your career with industry-leading courses. Learn from experts, build real projects, and earn certificates that matter.
              </p>

              <form onSubmit={handleSearch} className="relative max-w-xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-6 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-32 py-5 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-2xl"
                  />
                  <button type="submit" className="absolute right-2 bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-all hover:scale-105">
                    Search
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/courses" className="group bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-primary-50 transition-all flex items-center">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/register" className="group bg-primary-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-700 transition-all flex items-center border-2 border-white/20">
                  <Play className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-4">
                  {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop'
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-12 h-12 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-primary-200">Trusted by 50K+ students</p>
                </div>
              </div>
            </div>

            <div className={`hidden lg:block relative transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=700&fit=crop"
                  alt="Students learning"
                  className="rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Course Completed!</p>
                      <p className="text-sm text-gray-500">Web Development</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <Award className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Certificate</p>
                      <p className="text-sm text-gray-500">Ready to download</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold">
              FEATURED COURSES
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-6 mb-4">
              Popular Courses for You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most loved courses handpicked by experts to accelerate your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredCourses.length > 0 ? featuredCourses : sampleCourses).map((course, index) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-900 capitalize">
                      {course.level}
                    </span>
                  </div>
                  {course.discountPrice && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/courses/${course.slug}`}
                      className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      View Course
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-primary-600 font-medium">{course.category}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{course.averageRating || 0}</span>
                      <span className="text-sm text-gray-500 ml-1">({course.totalRatings || 0})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <img
                        src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor'}
                        alt={course.instructor?.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{course.instructor?.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {course.totalStudents?.toLocaleString() || 0}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {course.discountPrice ? (
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-gray-900">{formatPrice(course.discountPrice)}</span>
                          <span className="text-lg text-gray-400 line-through ml-2">{formatPrice(course.price)}</span>
                        </div>
                      ) : course.price === 0 ? (
                        <span className="text-2xl font-bold text-green-600">Free</span>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105"
            >
              View All Courses
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-6 mb-4">
              Start Learning in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your journey from beginner to expert starts here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-6xl font-bold text-primary-200 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-primary-600 px-4 py-2 rounded-full text-sm font-semibold">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl font-bold mt-6 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We provide all the tools and resources you need to achieve your learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 group"
              >
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-6 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful learners who transformed their careers
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <div className="flex justify-center mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                />
              </div>
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-xl text-gray-700 text-center mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </p>
              
              <div className="text-center">
                <p className="font-bold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>

            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-primary-50 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-primary-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-primary-50 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-6 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                  <span className={`ml-4 text-primary-600 transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Stay Updated with Latest Courses
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Subscribe to our newsletter and get exclusive access to new courses, special offers, and learning tips.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                  <span>Free weekly courses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                  <span>Exclusive discounts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                  <span>Learning tips</span>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button
                  type="button"
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
              <p className="text-sm text-primary-200 mt-4 text-center sm:text-left">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their careers with our expert-led courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-primary-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary-700 transition-all hover:scale-105 flex items-center"
            >
              <GraduationCap className="mr-3 h-6 w-6" />
              Get Started for Free
            </Link>
            <Link
              to="/courses"
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all flex items-center"
            >
              <BookOpen className="mr-3 h-6 w-6" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
