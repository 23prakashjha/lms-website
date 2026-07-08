import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, BookOpen, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@lmsplatform.com', 'help@lmsplatform.com'],
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Fri, 9AM-6PM EST'],
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Learning Street', 'San Francisco, CA 94105'],
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: ['24/7 Online Support', 'Response within 24 hours'],
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ]

  const faqItems = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our course catalog, select a course you\'re interested in, and click the "Enroll" button. For paid courses, you\'ll be redirected to checkout.'
    },
    {
      question: 'Can I access courses on mobile?',
      answer: 'Yes! Our platform is fully responsive and works on all devices. We also have dedicated iOS and Android apps for a better mobile experience.'
    },
    {
      question: 'Do I get a certificate after completing a course?',
      answer: 'Absolutely! Upon completing a course, you\'ll receive a certificate of completion that you can share on LinkedIn or download as PDF.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and various digital payment methods including Razorpay for secure transactions.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with a course, contact us within 30 days for a full refund.'
    }
  ]

  const [expandedFaq, setExpandedFaq] = useState(null)

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-28 lg:py-36">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-accent-400/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-down">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-primary-200 mb-6">
              <MessageCircle className="h-4 w-4" />
              We'd Love to Hear From You
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Get in{' '}
              <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-primary-200 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or just want to say hello? Our team is ready to help you with anything you need.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up">
            <a
              href="mailto:support@lmsplatform.com"
              className="group inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary-900/20"
            >
              <Mail className="h-5 w-5" />
              Email Us
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
            </a>
            <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300">
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-fade-up">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Contact Information</h2>
                <p className="text-lg text-gray-600">
                  Reach out through any of these channels. We typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="group card p-5 flex items-start gap-4 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`${info.iconBg} p-3.5 rounded-xl text-white shadow-lg shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`card p-6 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 animate-fade-up`}>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary-600" />
                  Quick Help Options
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center gap-2.5 p-3.5 bg-white rounded-xl border border-gray-200 hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <MessageCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Live Chat</span>
                  </button>
                  <button className="flex items-center gap-2.5 p-3.5 bg-white rounded-xl border border-gray-200 hover:border-accent-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className="bg-accent-100 p-2 rounded-lg group-hover:bg-accent-200 transition-colors">
                      <BookOpen className="h-4 w-4 text-accent-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-accent-700">Knowledge Base</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="animate-fade-up">
                <form onSubmit={handleSubmit} className="card p-8 lg:p-10 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl text-white">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
                      <p className="text-gray-500 text-sm">All fields marked with * are required</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="input-field resize-none"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">FAQ</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our platform
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="card overflow-hidden border border-gray-100 animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 text-base leading-relaxed pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-primary-600 shrink-0 transition-all duration-300 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-3" />
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/40 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 rounded-3xl p-10 lg:p-16 text-center text-white shadow-2xl shadow-primary-200 animate-fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-primary-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our support team is here to help you 24/7. Don't hesitate to reach out — we're always happy to assist.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:support@lmsplatform.com"
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                <Mail className="h-5 w-5" />
                Email Support
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>
              <button className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300">
                <MessageCircle className="h-5 w-5" />
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fade-up">
              <div className="text-5xl font-extrabold gradient-text mb-2">24/7</div>
              <div className="text-gray-400 font-medium">Always Available</div>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-3" />
            </div>
            <div className="text-center p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <div className="text-5xl font-extrabold gradient-text mb-2">&lt;24h</div>
              <div className="text-gray-400 font-medium">Response Time</div>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-3" />
            </div>
            <div className="text-center p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="text-5xl font-extrabold gradient-text mb-2">100%</div>
              <div className="text-gray-400 font-medium">Satisfaction Rate</div>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto mt-3" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
