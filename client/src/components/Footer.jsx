import { Link } from 'react-router-dom'
import { BookOpen, Github, Twitter, Linkedin, Mail, MapPin, Phone, Clock, Heart, Send, Sparkles } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Instructors', path: '/instructor' },
  ]

  const resources = [
    { name: 'AI Assistant', path: '/ai-assistant' },
    { name: 'Coding Practice', path: '/coding-practice' },
    { name: 'Projects', path: '/projects' },
    { name: 'Quizzes', path: '/quizzes' },
    { name: 'Certificates', path: '/certificates' },
  ]

  const legal = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Refund Policy', path: '/refund' },
  ]

  const categories = [
    { name: 'Web Development', path: '/courses?category=Web Development' },
    { name: 'Data Science', path: '/courses?category=Data Science' },
    { name: 'Mobile Development', path: '/courses?category=Mobile Development' },
    { name: 'UI/UX Design', path: '/courses?category=UI/UX Design' },
    { name: 'Cloud Computing', path: '/courses?category=Cloud Computing' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500" />
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2.5 rounded-2xl group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">PrakashEdu</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm max-w-sm">
              Empowering learners worldwide with quality education and skill development. 
              Join thousands of students transforming their careers every day.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">123 Learning Street, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@prakashedu.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">24/7 Online Support</span>
              </div>
            </div>

            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: 'https://twitter.com', hover: 'hover:bg-primary-600' },
                { icon: Github, href: 'https://github.com', hover: 'hover:bg-gray-600' },
                { icon: Linkedin, href: 'https://linkedin.com', hover: 'hover:bg-blue-600' },
                { icon: Mail, href: 'mailto:support@prakashedu.com', hover: 'hover:bg-red-600' },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                  className={`bg-gray-800 p-3 rounded-2xl ${social.hover} hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg border border-gray-700/50`}>
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-base mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary-500 transition-all duration-200 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-base mb-6 relative inline-block">
              Resources
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-pink-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-accent-500 transition-all duration-200 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-base mb-6 relative inline-block">
              Categories
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-pink-500 transition-all duration-200 text-sm flex items-center group">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} <span className="text-primary-500 font-semibold">PrakashEdu</span>. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
              {legal.map((link) => (
                <Link key={link.name} to={link.path} className="text-gray-500 hover:text-primary-500 text-xs transition-colors duration-200">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="text-center lg:text-right">
              <p className="text-gray-500 text-sm flex items-center justify-center lg:justify-end">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by PrakashEdu Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
