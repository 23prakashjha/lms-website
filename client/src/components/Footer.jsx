import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Linkedin, Mail, MapPin, Phone, Clock, Heart, Send } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ]

  const resources = [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Community', path: '/community' },
    { name: 'Tutorials', path: '/tutorials' },
    { name: 'Support', path: '/support' },
  ]

  const legal = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Refund Policy', path: '/refund' },
    { name: 'Accessibility', path: '/accessibility' },
  ]

  const categories = [
    { name: 'Web Development', path: '/courses?category=web-development' },
    { name: 'Data Science', path: '/courses?category=data-science' },
    { name: 'Mobile Development', path: '/courses?category=mobile' },
    { name: 'UI/UX Design', path: '/courses?category=design' },
    { name: 'Cloud Computing', path: '/courses?category=cloud' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-10 w-10 text-primary-500" />
              <span className="text-2xl font-bold text-white">LMS Platform</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering learners worldwide with quality education and skill development. 
              Join thousands of students transforming their careers every day.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Learning Street, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">support@lmsplatform.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">24/7 Online Support</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 hover:text-white transition-all duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="bg-gray-800 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:support@lmsplatform.com"
                 className="bg-gray-800 p-3 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 inline-block hover:translate-x-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 inline-block hover:translate-x-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-200 inline-block hover:translate-x-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="text-primary-500 font-semibold">LMS Platform</span>. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="text-gray-500 hover:text-primary-500 text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="text-center lg:text-right hidden lg:block">
              <p className="text-gray-500 text-sm flex items-center justify-end">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by LMS Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
