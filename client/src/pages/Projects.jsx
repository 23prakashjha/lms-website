import { useState } from 'react'
import { Code2, ExternalLink, Star, GitFork, Clock, Filter, Search } from 'lucide-react'

const projectData = [
  {
    language: 'JavaScript',
    icon: '🟨',
    color: 'from-yellow-400 to-orange-500',
    projects: [
      { title: 'To-Do List App', description: 'A drag-and-drop to-do list with local storage persistence.', difficulty: 'Beginner', time: '1-2 hours', featured: true },
      { title: 'Weather Dashboard', description: 'Fetch and display weather data from a public API with charts.', difficulty: 'Intermediate', time: '3-4 hours', featured: true },
      { title: 'Memory Card Game', description: 'Classic memory matching game with timer and score tracking.', difficulty: 'Beginner', time: '2-3 hours' },
      { title: 'Chat Application', description: 'Real-time chat room using Socket.io with user authentication.', difficulty: 'Advanced', time: '6-8 hours', featured: true },
      { title: 'Calculator', description: 'Scientific calculator with history and keyboard support.', difficulty: 'Beginner', time: '1-2 hours' },
      { title: 'Markdown Previewer', description: 'Live markdown editor with rendered HTML preview.', difficulty: 'Intermediate', time: '2-3 hours' },
      { title: 'Expense Tracker', description: 'Track income and expenses with charts and local storage.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'Pomodoro Timer', description: 'Productivity timer with customizable work/break intervals and notifications.', difficulty: 'Beginner', time: '1-2 hours' }
    ]
  },
  {
    language: 'Python',
    icon: '🐍',
    color: 'from-green-500 to-emerald-600',
    projects: [
      { title: 'Web Scraper', description: 'Extract and analyze data from websites using BeautifulSoup.', difficulty: 'Intermediate', time: '3-4 hours', featured: true },
      { title: 'Password Generator', description: 'Generate secure random passwords with configurable options.', difficulty: 'Beginner', time: '1 hour' },
      { title: 'File Organizer', description: 'Automatically organize files into folders by type and date.', difficulty: 'Beginner', time: '1-2 hours' },
      { title: 'Quiz App', description: 'Command-line quiz with score tracking and question bank.', difficulty: 'Beginner', time: '2-3 hours' },
      { title: 'Snake Game', description: 'Classic snake game using Pygame with score and levels.', difficulty: 'Intermediate', time: '4-5 hours', featured: true },
      { title: 'URL Shortener', description: 'Shorten URLs with a Flask web app and SQLite database.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'Sudoku Solver', description: 'Solve Sudoku puzzles using backtracking algorithm with GUI.', difficulty: 'Advanced', time: '4-6 hours' },
      { title: 'Weather CLI', description: 'Command-line weather app fetching data from OpenWeatherMap API.', difficulty: 'Beginner', time: '1-2 hours' }
    ]
  },
  {
    language: 'Java',
    icon: '☕',
    color: 'from-red-500 to-rose-600',
    projects: [
      { title: 'Library Management', description: 'Console-based library system with book CRUD and member management.', difficulty: 'Intermediate', time: '4-5 hours', featured: true },
      { title: 'Banking System', description: 'Simple banking app with deposits, withdrawals, and transaction history.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'Tic Tac Toe', description: 'Two-player Tic Tac Toe with a simple AI opponent.', difficulty: 'Beginner', time: '2-3 hours' },
      { title: 'Student Grade Tracker', description: 'Track and calculate student grades with subject-wise analysis.', difficulty: 'Beginner', time: '2-3 hours' },
      { title: 'Contact Manager', description: 'Store and manage contacts with search and sort functionality.', difficulty: 'Beginner', time: '2-3 hours' },
      { title: 'Hangman Game', description: 'Word guessing game with category selection and score tracking.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'E-commerce Cart', description: 'Shopping cart system with product catalog and checkout flow.', difficulty: 'Advanced', time: '5-7 hours', featured: true },
      { title: 'Chat Server', description: 'Multi-client chat server using Java sockets and threading.', difficulty: 'Advanced', time: '6-8 hours' }
    ]
  },
  {
    language: 'C++',
    icon: '⚙️',
    color: 'from-blue-500 to-indigo-600',
    projects: [
      { title: 'Student Database', description: 'CRUD operations on student records using file handling.', difficulty: 'Intermediate', time: '3-4 hours', featured: true },
      { title: 'Number Guessing Game', description: 'Guess the number with hints and attempt tracking.', difficulty: 'Beginner', time: '1 hour' },
      { title: 'Sorting Visualizer', description: 'Visualize sorting algorithms (bubble, merge, quick) with animations.', difficulty: 'Advanced', time: '5-6 hours', featured: true },
      { title: 'Calculator (CLI)', description: 'Advanced command-line calculator with expression parsing.', difficulty: 'Intermediate', time: '2-3 hours' },
      { title: 'Inventory System', description: 'Manage product inventory with stock alerts and reporting.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'Minesweeper', description: 'Classic Minesweeper game in the console with grid reveal logic.', difficulty: 'Advanced', time: '4-5 hours' },
      { title: 'Matrix Calculator', description: 'Perform matrix operations (addition, multiplication, transpose).', difficulty: 'Intermediate', time: '2-3 hours' },
      { title: 'Text Editor', description: 'Simple text editor with file open/save and basic formatting.', difficulty: 'Advanced', time: '5-7 hours' }
    ]
  },
  {
    language: 'HTML & CSS',
    icon: '🌐',
    color: 'from-orange-400 to-pink-500',
    projects: [
      { title: 'Portfolio Website', description: 'Personal portfolio with responsive design and animations.', difficulty: 'Beginner', time: '2-3 hours', featured: true },
      { title: 'Landing Page', description: 'Product landing page with hero section and call-to-action.', difficulty: 'Beginner', time: '1-2 hours' },
      { title: 'CSS Art', description: 'Create artwork using only HTML and CSS (no JS/images).', difficulty: 'Intermediate', time: '2-4 hours' },
      { title: 'Pricing Table', description: 'Responsive pricing cards with hover effects.', difficulty: 'Beginner', time: '1 hour' },
      { title: 'Photo Gallery', description: 'Image gallery with lightbox and filter categories.', difficulty: 'Intermediate', time: '2-3 hours' },
      { title: 'Survey Form', description: 'Styled survey form with validation and progress bar.', difficulty: 'Beginner', time: '1-2 hours' },
      { title: 'Restaurant Menu', description: 'Digital menu with categories, prices, and ratings.', difficulty: 'Intermediate', time: '2-3 hours' },
      { title: 'CSS Animations', description: 'Collection of CSS animations and keyframe effects.', difficulty: 'Intermediate', time: '2-3 hours' }
    ]
  },
  {
    language: 'React',
    icon: '⚛️',
    color: 'from-cyan-500 to-blue-600',
    projects: [
      { title: 'Movie Search App', description: 'Search movies from TMDB API with filters and favorites.', difficulty: 'Intermediate', time: '4-5 hours', featured: true },
      { title: 'Notes Application', description: 'CRUD notes app with markdown support and categories.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'Github Profile Finder', description: 'Search GitHub users and display profile with repos.', difficulty: 'Beginner', time: '2-3 hours' },
      { title: 'Recipe App', description: 'Browse and search recipes with meal categories and details.', difficulty: 'Intermediate', time: '3-4 hours' },
      { title: 'E-commerce Storefront', description: 'Product listing with cart, filters, and checkout flow.', difficulty: 'Advanced', time: '8-10 hours', featured: true },
      { title: 'Blog Platform', description: 'Create and manage blog posts with rich text editor.', difficulty: 'Advanced', time: '6-8 hours' },
      { title: 'Task Board (Kanban)', description: 'Drag-and-drop task management board with columns.', difficulty: 'Advanced', time: '5-7 hours', featured: true },
      { title: 'Social Media Dashboard', description: 'Analytics dashboard with charts and data visualization.', difficulty: 'Intermediate', time: '4-5 hours' }
    ]
  }
]

const Projects = () => {
  const [activeLang, setActiveLang] = useState('JavaScript')
  const [search, setSearch] = useState('')

  const current = projectData.find(p => p.language === activeLang) || projectData[0]
  const filtered = current.projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Code2 className="h-8 w-8 mr-3" />
            Small Projects
          </h1>
          <p className="mt-2 text-primary-100">Build real-world projects across multiple programming languages</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {projectData.map(lang => (
              <button
                key={lang.language}
                onClick={() => { setActiveLang(lang.language); setSearch('') }}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeLang === lang.language
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{lang.icon}</span>
                {lang.language}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${current.language} projects...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Code2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No projects found</h3>
            <p className="text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
                  {project.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.difficulty}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {project.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-2">How to Use These Projects</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2 font-bold">1.</span>
              Choose a language and project that matches your skill level
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2 font-bold">2.</span>
              Try to build the project from scratch without looking at solutions
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2 font-bold">3.</span>
              Use version control (Git) to track your progress
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2 font-bold">4.</span>
              Share your completed projects on GitHub to build your portfolio
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Projects
