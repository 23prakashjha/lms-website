import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, Clock, Target, Heart, Zap, Shield, Globe } from 'lucide-react'

const About = () => {
  const stats = [
    { icon: Users, label: 'Students Enrolled', value: '50,000+' },
    { icon: BookOpen, label: 'Courses', value: '500+' },
    { icon: Award, label: 'Certificates Issued', value: '25,000+' },
    { icon: Clock, label: 'Learning Hours', value: '1M+' }
  ]

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make quality education accessible to everyone, anywhere in the world. We believe learning should be unlimited and available to all.'
    },
    {
      icon: Heart,
      title: 'Student First',
      description: 'Every decision we make starts with our students. Their success is our success, and we measure our achievements by theirs.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform and methods to provide the best learning experience using cutting-edge technology.'
    },
    {
      icon: Shield,
      title: 'Trust & Quality',
      description: 'We maintain the highest standards of content quality and platform reliability to ensure a safe learning environment.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
      bio: 'Former Stanford professor with 15 years in education technology.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff',
      bio: 'Ex-Google engineer passionate about scalable learning platforms.'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Education',
      image: 'https://ui-avatars.com/api/?name=Emily+Davis&background=8b5cf6&color=fff',
      bio: 'Curriculum expert ensuring top-quality course content.'
    },
    {
      name: 'James Wilson',
      role: 'Head of Product',
      image: 'https://ui-avatars.com/api/?name=James+Wilson&background=f59e0b&color=fff',
      bio: 'Product leader focused on user experience and engagement.'
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About LMS Platform</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Empowering learners worldwide with accessible, affordable, and high-quality education since 2020.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Transforming Education for the Digital Age</h2>
              <p className="text-lg text-gray-600 mb-6">
                LMS Platform was founded with a simple yet powerful vision: to democratize education and make it accessible to everyone, regardless of their location or background.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that learning should have no barriers. Our platform connects passionate instructors with eager learners from around the world, creating a global community of knowledge sharing and skill development.
              </p>
              <p className="text-lg text-gray-600">
                From programming to design, business to personal development, we offer courses that help individuals achieve their goals and advance their careers.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">4+</div>
                <div className="text-primary-100">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Numbers that reflect our commitment to education</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start p-6 bg-gray-50 rounded-xl">
                <div className="bg-primary-100 p-4 rounded-xl mr-6 flex-shrink-0">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Globe className="h-16 w-16 text-primary-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Join Our Global Community</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Over 50,000 students from 120+ countries are learning on our platform. Become part of our growing community today.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Start Learning Today
            </Link>
            <Link to="/courses" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The people behind LMS Platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 mb-8">
            From a small startup to a global learning platform, here's how we've grown
          </p>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold mr-6">2020</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Platform Launch</h3>
                <p className="text-gray-600">Started with 10 courses and 500 students</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold mr-6">2021</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Global Expansion</h3>
                <p className="text-gray-600">Reached 10,000 students from 50 countries</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold mr-6">2022</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Mobile App Launch</h3>
                <p className="text-gray-600">Introduced iOS and Android apps</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold mr-6">2023</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Enterprise Solution</h3>
                <p className="text-gray-600">Launched corporate training platform</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold mr-6">2024</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">50K+ Students</h3>
                <p className="text-gray-600">Celebrated reaching 50,000 active learners</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
