import { useState, useRef } from 'react'
import { Play, RotateCcw, Copy, Check, Code2, ChevronRight, Lightbulb, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const challenges = [
  {
    title: 'Reverse a String',
    description: 'Write a function that reverses a given string.',
    difficulty: 'Easy',
    starterCode: {
      javascript: 'function reverseString(str) {\n  // Your code here\n  return str;\n}\n\nconsole.log(reverseString("hello"));',
      python: 'def reverse_string(s):\n    # Your code here\n    return s\n\nprint(reverse_string("hello"))',
      java: 'public class Main {\n    public static String reverseString(String str) {\n        // Your code here\n        return str;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(reverseString("hello"));\n    }\n}',
      cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nstring reverseString(string str) {\n    // Your code here\n    return str;\n}\n\nint main() {\n    cout << reverseString("hello") << endl;\n    return 0;\n}'
    }
  },
  {
    title: 'Find the Largest Number',
    description: 'Write a function that returns the largest number from an array.',
    difficulty: 'Easy',
    starterCode: {
      javascript: 'function findLargest(arr) {\n  // Your code here\n  return null;\n}\n\nconsole.log(findLargest([3, 7, 2, 9, 5]));',
      python: 'def find_largest(arr):\n    # Your code here\n    return None\n\nprint(find_largest([3, 7, 2, 9, 5]))',
      java: 'public class Main {\n    public static int findLargest(int[] arr) {\n        // Your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {3, 7, 2, 9, 5};\n        System.out.println(findLargest(arr));\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint findLargest(int arr[], int n) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    int arr[] = {3, 7, 2, 9, 5};\n    cout << findLargest(arr, 5) << endl;\n    return 0;\n}'
    }
  },
  {
    title: 'Check Palindrome',
    description: 'Check if a given string is a palindrome (reads the same forward and backward).',
    difficulty: 'Easy',
    starterCode: {
      javascript: 'function isPalindrome(str) {\n  // Your code here\n  return false;\n}\n\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("hello"));',
      python: 'def is_palindrome(s):\n    # Your code here\n    return False\n\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))',
      java: 'public class Main {\n    public static boolean isPalindrome(String str) {\n        // Your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isPalindrome("racecar"));\n        System.out.println(isPalindrome("hello"));\n    }\n}',
      cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(string str) {\n    // Your code here\n    return false;\n}\n\nint main() {\n    cout << isPalindrome("racecar") << endl;\n    cout << isPalindrome("hello") << endl;\n    return 0;\n}'
    }
  },
  {
    title: 'Fibonacci Sequence',
    description: 'Generate the first N numbers in the Fibonacci sequence.',
    difficulty: 'Medium',
    starterCode: {
      javascript: 'function fibonacci(n) {\n  // Your code here\n  return [];\n}\n\nconsole.log(fibonacci(10));',
      python: 'def fibonacci(n):\n    # Your code here\n    return []\n\nprint(fibonacci(10))',
      java: 'public class Main {\n    public static int[] fibonacci(int n) {\n        // Your code here\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        int[] result = fibonacci(10);\n        for (int num : result) System.out.print(num + " ");\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nvoid fibonacci(int n) {\n    // Your code here\n}\n\nint main() {\n    fibonacci(10);\n    return 0;\n}'
    }
  },
  {
    title: 'Count Vowels',
    description: 'Count the number of vowels (a, e, i, o, u) in a given string.',
    difficulty: 'Easy',
    starterCode: {
      javascript: 'function countVowels(str) {\n  // Your code here\n  return 0;\n}\n\nconsole.log(countVowels("hello world"));',
      python: 'def count_vowels(s):\n    # Your code here\n    return 0\n\nprint(count_vowels("hello world"))',
      java: 'public class Main {\n    public static int countVowels(String str) {\n        // Your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(countVowels("hello world"));\n    }\n}',
      cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint countVowels(string str) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    cout << countVowels("hello world") << endl;\n    return 0;\n}'
    }
  },
  {
    title: 'Two Sum',
    description: 'Find two numbers in an array that add up to a target sum.',
    difficulty: 'Medium',
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));',
      python: 'def two_sum(nums, target):\n    # Your code here\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))',
      java: 'public class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println(result[0] + ", " + result[1]);\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nvoid twoSum(int nums[], int n, int target) {\n    // Your code here\n}\n\nint main() {\n    int nums[] = {2, 7, 11, 15};\n    twoSum(nums, 4, 9);\n    return 0;\n}'
    }
  }
]

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚙️' }
]

const CodingPractice = () => {
  const [language, setLanguage] = useState('javascript')
  const [selectedChallenge, setSelectedChallenge] = useState(0)
  const [code, setCode] = useState(challenges[0].starterCode.javascript)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef(null)

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(challenges[selectedChallenge].starterCode[lang] || '// Write your code here\n')
    setOutput('')
  }

  const handleChallengeSelect = (index) => {
    setSelectedChallenge(index)
    setCode(challenges[index].starterCode[language] || '// Write your code here\n')
    setOutput('')
  }

  const handleRun = () => {
    setOutput('')
    if (language === 'javascript') {
      try {
        const logs = []
        const mockConsole = { log: (...args) => logs.push(args.map(String).join(' ')) }
        const fn = new Function('console', code)
        fn(mockConsole)
        setOutput(logs.join('\n') || 'Code executed successfully (no output)')
      } catch (err) {
        setOutput(`Error: ${err.message}`)
      }
    } else {
      setOutput(`[${language.toUpperCase()}]\nCode submitted for execution.\nNote: Server-side execution is not available in the browser.\nReview your code logic below.\n\n---\n${code}`)
    }
  }

  const handleReset = () => {
    setCode(challenges[selectedChallenge].starterCode[language] || '// Write your code here\n')
    setOutput('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Code2 className="h-8 w-8 mr-3" />
            Coding Practice
          </h1>
          <p className="mt-2 text-primary-100">Sharpen your coding skills with hands-on challenges</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Challenges</h2>
              <div className="space-y-1">
                {challenges.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => handleChallengeSelect(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedChallenge === i
                        ? 'bg-primary-50 text-primary-700 font-medium border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <ChevronRight className={`h-3.5 w-3.5 mr-1.5 ${selectedChallenge === i ? 'text-primary-600' : 'text-gray-300'}`} />
                        {ch.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        ch.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        ch.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {ch.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <h2 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-1.5 text-yellow-500" />
                Hint
              </h2>
              <p className="text-sm text-gray-500">{challenges[selectedChallenge].description}</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        language === lang.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lang.icon} {lang.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={handleReset} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button onClick={handleRun} className="btn-primary py-1.5 px-4 text-sm flex items-center">
                    <Play className="h-4 w-4 mr-1.5" />
                    Run
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="border-r">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
                    spellCheck={false}
                  />
                </div>
                <div className="bg-gray-50">
                  <div className="px-4 py-2 bg-gray-100 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Output
                  </div>
                  <pre className="p-4 font-mono text-sm text-gray-800 h-80 overflow-y-auto whitespace-pre-wrap">
                    {output || 'Click "Run" to execute your code'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Only JavaScript code can be executed in the browser. Python, Java, and C++ code will be displayed for review. Full multi-language execution will be available in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodingPractice
