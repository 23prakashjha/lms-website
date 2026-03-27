import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, Users, Clock, ChevronDown } from 'lucide-react'
import axios from 'axios'
import { formatPrice } from '../utils/priceFormatter'

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    sort: 'popular'
  })
  const [showFilters, setShowFilters] = useState(false)

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

  const categories = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cloud Computing', 'UI/UX Design']
  const levels = ['beginner', 'intermediate', 'advanced']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
          <p className="mt-2 text-gray-600">Find the perfect course to learn new skills</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-12"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center justify-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="input-field md:w-48"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </form>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <select
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">{courses.length} courses found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="card overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    {course.discountPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                      </div>
                    )}
                    {course.level && (
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-xs font-medium capitalize">
                        {course.level}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-primary-600 font-medium">{course.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center mb-4">
                      <img
                        src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor'}
                        alt={course.instructor?.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{course.instructor?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        {course.averageRating || 0} ({course.totalRatings || 0})
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.totalStudents || 0} students
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        {course.discountPrice ? (
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">{formatPrice(course.discountPrice)}</span>
                            <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(course.price)}</span>
                          </div>
                        ) : course.price === 0 ? (
                          <span className="text-2xl font-bold text-green-600">Free</span>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">{formatPrice(course.price)}</span>
                        )}
                      </div>
                      <Link
                        to={`/courses/${course.slug}`}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
