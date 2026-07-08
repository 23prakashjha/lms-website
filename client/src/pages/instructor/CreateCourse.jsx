import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Trash2, Star, Upload, Image as ImageIcon } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreateCourse = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const thumbnailInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    level: 'beginner',
    language: 'English',
    price: 0,
    discountPrice: '',
    thumbnail: '',
    previewVideo: '',
    rating: 0,
    requirements: [''],
    whatYouWillLearn: [''],
    projects: [''],
    interviewPrep: [''],
    dsaPractice: [''],
    curriculum: [''],
    tags: ''
  })

  const categories = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cloud Computing', 'UI/UX Design', 'DevOps', 'Cybersecurity']

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingThumbnail(true)
    try {
      const fd = new FormData()
      fd.append('thumbnail', file)
      const { data } = await axios.post('/api/upload/thumbnail', fd)
      setFormData(prev => ({ ...prev, thumbnail: data.url }))
      toast.success('Thumbnail uploaded')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        requirements: formData.requirements.filter(r => r.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(w => w.trim()),
        projects: formData.projects.filter(p => p.trim()),
        interviewPrep: formData.interviewPrep.filter(i => i.trim()),
        dsaPractice: formData.dsaPractice.filter(d => d.trim()),
        curriculum: formData.curriculum.filter(c => c.trim()),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }

      const { data: response } = await axios.post('/api/courses', data)
      toast.success('Course created successfully!')
      if (confirm('Course created! Would you like to add a quiz to this course?')) {
        navigate(`/instructor/quiz/create/${response.course._id}`)
      } else {
        navigate(`/instructor/dashboard`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Complete Web Development Bootcamp"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="A brief summary (displayed in course cards)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="input-field"
                  placeholder="Detailed course description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                    placeholder="Enter price in INR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (₹)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                <div className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                    {formData.thumbnail ? (
                      <img src={formData.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">Course Thumbnail</p>
                    <p className="text-xs text-gray-400 truncate">{formData.thumbnail ? formData.thumbnail.split('/').pop() : 'Upload a course image'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={uploadingThumbnail}
                    className="btn-secondary text-sm px-3 py-2 disabled:opacity-50"
                  >
                    {uploadingThumbnail ? (
                      <div className="h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Upload'
                    )}
                  </button>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="react, javascript, web development"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="e.g. Basic HTML knowledge"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Requirement
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
            <div className="space-y-2">
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="e.g. Build modern web applications"
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('whatYouWillLearn', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="flex items-center text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Learning Outcome
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
            <div className="space-y-2">
              {formData.projects.map((project, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400">•</span>
                  <input type="text" value={project} onChange={(e) => handleArrayChange('projects', index, e.target.value)} className="input-field flex-1" placeholder="e.g. Build a full-stack e-commerce app" />
                  {formData.projects.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('projects', index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('projects')} className="flex items-center text-primary-600 hover:text-primary-700">
                <Plus className="h-5 w-5 mr-1" />Add Project
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Preparation</h2>
            <div className="space-y-2">
              {formData.interviewPrep.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400">•</span>
                  <input type="text" value={topic} onChange={(e) => handleArrayChange('interviewPrep', index, e.target.value)} className="input-field flex-1" placeholder="e.g. Data Structures & Algorithms" />
                  {formData.interviewPrep.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('interviewPrep', index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('interviewPrep')} className="flex items-center text-primary-600 hover:text-primary-700">
                <Plus className="h-5 w-5 mr-1" />Add Topic
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">DSA Practice</h2>
            <div className="space-y-2">
              {formData.dsaPractice.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400">•</span>
                  <input type="text" value={topic} onChange={(e) => handleArrayChange('dsaPractice', index, e.target.value)} className="input-field flex-1" placeholder="e.g. Arrays & Hashing" />
                  {formData.dsaPractice.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('dsaPractice', index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('dsaPractice')} className="flex items-center text-primary-600 hover:text-primary-700">
                <Plus className="h-5 w-5 mr-1" />Add Topic
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Curriculum / Course Modules</h2>
            <div className="space-y-2">
              {formData.curriculum.map((module, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400">{index + 1}.</span>
                  <input type="text" value={module} onChange={(e) => handleArrayChange('curriculum', index, e.target.value)} className="input-field flex-1" placeholder="e.g. Introduction to Web Development" />
                  {formData.curriculum.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('curriculum', index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('curriculum')} className="flex items-center text-primary-600 hover:text-primary-700">
                <Plus className="h-5 w-5 mr-1" />Add Module
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Rating</h2>
            <p className="text-sm text-gray-500 mb-4">Set the default rating for this course</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star === formData.rating ? 0 : star })}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-900">
                {formData.rating > 0 ? `${formData.rating}.0` : 'No rating'}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/instructor/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse
