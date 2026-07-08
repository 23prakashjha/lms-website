import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, Users, Clock, ChevronDown, SlidersHorizontal, X, BookOpen, GraduationCap, TrendingUp, Sparkles, LayoutGrid, LayoutList, ArrowUpRight, RotateCcw, Globe } from 'lucide-react'
import axios from 'axios'
import { formatPrice } from '../utils/priceFormatter'

const fadeUpStyle = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 400px; }
}
@keyframes slideUp {
  from { opacity: 1; max-height: 400px; }
  to { opacity: 0; max-height: 0; }
}
.animate-fade-up {
  animation: fadeUp 0.5s ease-out forwards;
}
`

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="h-48 shimmer-bg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded-full w-1/3 shimmer-bg" />
      <div className="h-5 bg-gray-200 rounded-full w-3/4 shimmer-bg" />
      <div className="h-4 bg-gray-200 rounded-full w-full shimmer-bg" />
      <div className="h-4 bg-gray-200 rounded-full w-2/3 shimmer-bg" />
      <div className="flex items-center pt-3 border-t border-gray-100">
        <div className="h-8 w-8 bg-gray-200 rounded-full shimmer-bg shrink-0" />
        <div className="ml-3 h-4 bg-gray-200 rounded-full w-1/4 shimmer-bg" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-6 bg-gray-200 rounded-full w-1/4 shimmer-bg" />
        <div className="h-9 bg-gray-200 rounded-full w-1/3 shimmer-bg" />
      </div>
    </div>
  </div>
)

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    sort: 'popular'
  })
  const [showFilters, setShowFilters] = useState(false)
  const filterRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    fetchCourses()
  }, [filters])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.level) params.append('level', filters.level)
      if (filters.price) params.append('price', filters.price)
      if (filters.sort) params.append('sort', filters.sort)

      const { data } = await axios.get(`/api/courses?${params.toString()}`)
      setCourses(data.courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCourses()
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', level: '', price: '', sort: 'popular' })
  }

  const hasActiveFilters = filters.category || filters.level || filters.price

  const categories = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cloud Computing', 'UI/UX Design']
  const levels = ['beginner', 'intermediate', 'advanced']

  const levelColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    advanced: 'bg-red-100 text-red-700 border-red-200'
  }

  const getLevelColor = (level) => levelColors[level?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{fadeUpStyle}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-400/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary-200 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Expand your knowledge with expert-led courses
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Explore{' '}
                <span className="bg-gradient-to-r from-primary-200 to-accent-200 bg-clip-text text-transparent">Courses</span>
              </h1>
              <p className="text-lg lg:text-xl text-primary-100/90 max-w-xl">
                Find the perfect course to learn new skills, advance your career, and achieve your goals
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-card !bg-white/10 !border-white/20 px-6 py-4 flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <BookOpen className="h-5 w-5 text-primary-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{courses.length || 0}</p>
                  <p className="text-sm text-primary-200">courses available</p>
                </div>
              </div>
              <div className="glass-card !bg-white/10 !border-white/20 px-6 py-4 flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <GraduationCap className="h-5 w-5 text-primary-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{courses.reduce((s, c) => s + (c.totalStudents || 0), 0).toLocaleString()}</p>
                  <p className="text-sm text-primary-200">total students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="card p-4 sm:p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-12"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-ghost flex items-center justify-center px-5 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                  showFilters ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-3.5 w-3.5 ml-1.5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>

              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="input-field md:w-48 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </form>

          {/* Filter Panel */}
          <div
            ref={filterRef}
            style={{
              animation: showFilters ? 'slideDown 0.3s ease-out forwards' : 'slideUp 0.2s ease-in forwards',
              overflow: 'hidden'
            }}
            className={showFilters ? '' : 'pointer-events-none'}
          >
            <div className="pt-5 mt-5 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Filter className="h-3.5 w-3.5 inline mr-1.5 text-primary-500" />
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="input-field cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="h-3.5 w-3.5 inline mr-1.5 text-primary-500" />
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    className="input-field cursor-pointer"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="h-3.5 w-3.5 inline mr-1.5 text-primary-500" />
                    Price
                  </label>
                  <select
                    value={filters.price}
                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                    className="input-field cursor-pointer"
                  >
                    <option value="">All Prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 group"
                >
                  <RotateCcw className="h-3.5 w-3.5 group-hover:-rotate-180 transition-transform duration-500" />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="h-12 w-12 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any courses matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button onClick={clearFilters} className="btn-primary inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">{courses.length}</span> result{courses.length !== 1 ? 's' : ''}
              </p>
              <div className="flex sm:hidden items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={gridRef}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
                  : 'grid grid-cols-1 gap-5'
              }
            >
              {courses.map((course, index) => (
                <div
                  key={course._id}
                  className={`group card card-hover overflow-hidden border border-gray-100 ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                  style={{ animation: `fadeUp 0.5s ease-out ${index * 0.08}s forwards`, opacity: 0 }}
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className={`relative overflow-hidden block ${viewMode === 'list' ? 'sm:w-72 shrink-0' : ''}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'h-48 sm:h-full min-h-[200px]' : 'h-52'}`}>
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {course.discountPrice && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                          {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {course.language && (
                          <div className="px-3 py-1 rounded-lg text-xs font-semibold shadow-lg border bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {course.language}
                          </div>
                        )}
                        {course.level && (
                          <div className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize shadow-lg border ${getLevelColor(course.level)}`}>
                            {course.level}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <span className="bg-white/90 backdrop-blur-sm text-primary-600 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xl hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center gap-2">
                          View Details
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className={`p-6 flex flex-col flex-1 ${viewMode === 'list' ? 'sm:py-4' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                        {course.category}
                      </span>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.round(course.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                        <span className="text-xs font-semibold text-gray-700 ml-1.5">{course.averageRating || '0.0'}</span>
                        <span className="text-xs text-gray-400 ml-1">({course.totalRatings || 0})</span>
                      </div>
                    </div>

                    <Link to={`/courses/${course.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                        {course.title}
                      </h3>
                    </Link>

                    <p className={`text-sm text-gray-500 mb-4 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'}`}>
                      {course.description}
                    </p>

                    <div className={`flex items-center ${viewMode === 'list' ? 'mb-3' : 'mb-4 pb-4 border-b border-gray-100'}`}>
                      <img
                        src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor'}
                        alt={course.instructor?.name}
                        className="h-7 w-7 rounded-full mr-2 ring-2 ring-gray-100"
                      />
                      <span className="text-sm text-gray-600 font-medium truncate">{course.instructor?.name || 'Instructor'}</span>
                    </div>

                    {viewMode === 'list' && <div className="border-b border-gray-100 mb-4" />}

                    <div className={`flex items-center justify-between mt-auto ${viewMode === 'list' ? '' : ''}`}>
                      <div>
                        {course.discountPrice ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(course.discountPrice)}</span>
                            <span className="text-sm text-gray-400 line-through">{formatPrice(course.price)}</span>
                          </div>
                        ) : course.price === 0 ? (
                          <span className="text-2xl font-bold text-green-600">Free</span>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{course.totalStudents?.toLocaleString() || 0}</span>
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="mt-4 w-full bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 group/btn border border-gray-200 hover:border-transparent"
                    >
                      View Course
                      <TrendingUp className="h-4 w-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
