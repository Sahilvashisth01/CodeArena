export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      notes: [
        "Each input has exactly one solution.",
        "You may not use the same element twice.",
      ],
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i], target ≤ 10⁹",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
}`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> nums = {2,7,11,15};
    int target = 9;
    auto res = twoSum(nums, target);
    cout << "[" << res[0] << "," << res[1] << "]";
}`
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]",
      python: "[0, 1]\n[1, 2]",
      java: "[0, 1]\n[1, 2]",
      cpp: "[0,1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Reverse the input character array in-place.",
      notes: ["Use O(1) extra memory."],
    },
    examples: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
}`,
      python: `def reverseString(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your solution here
}

int main() {
    vector<char> s = {'h','e','l','l','o'};
    reverseString(s);
    for (char c : s) cout << c;
}`
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]',
      python: "['o', 'l', 'l', 'e', 'h']",
      java: "[o, l, l, e, h]",
      cpp: "olleh",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Check if a string is a palindrome considering only alphanumeric characters.",
      notes: [],
    },
    examples: [
      { input: `"A man, a plan, a canal: Panama"`, output: "true" },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
}`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here
    return false;
}

int main() {
    cout << isPalindrome("A man, a plan, a canal: Panama");
}`
    },
    expectedOutput: {
      javascript: "true",
      python: "True",
      java: "true",
      cpp: "1",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • DP",
    description: {
      text: "Find the subarray with the largest sum.",
      notes: [],
    },
    examples: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
}`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums);
}`
    },
    expectedOutput: {
      javascript: "6",
      python: "6",
      java: "6",
      cpp: "6",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "Find two lines that hold the most water.",
      notes: [],
    },
    examples: [
      { input: "[1,8,6,2,5,4,8,3,7]", output: "49" },
    ],
    constraints: ["2 ≤ n ≤ 10⁵"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
}`,
      python: `def maxArea(height):
    # Write your solution here
    pass`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxArea(vector<int>& height) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> h = {1,8,6,2,5,4,8,3,7};
    cout << maxArea(h);
}`
    },
    expectedOutput: {
      javascript: "49",
      python: "49",
      java: "49",
      cpp: "49",
    },
  },
  "trapping-rain-water": {
  id: "trapping-rain-water",
  title: "Trapping Rain Water",
  difficulty: "Hard",
  category: "Array • Two Pointers • Stack",
  description: {
    text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    notes: [
      "Water can only be trapped between higher bars.",
      "The amount of trapped water depends on the minimum of left and right max heights.",
    ],
  },
  examples: [
    {
      input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
      output: "6",
      explanation: "The above elevation map traps 6 units of water.",
    },
    {
      input: "height = [4,2,0,3,2,5]",
      output: "9",
    },
  ],
  constraints: [
    "n == height.length",
    "1 ≤ n ≤ 2 * 10⁴",
    "0 ≤ height[i] ≤ 10⁵",
  ],
  starterCode: {
    javascript: `function trap(height) {
  // Write your solution here
}`,
    python: `def trap(height):
    # Write your solution here
    pass`,
    java: `class Solution {
    public static int trap(int[] height) {
        // Write your solution here
        return 0;
    }
}`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int trap(vector<int>& height) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> h = {0,1,0,2,1,0,1,3,2,1,2,1};
    cout << trap(h);
}`
  },
  expectedOutput: {
    javascript: "6\n9",
    python: "6\n9",
    java: "6\n9",
    cpp: "6",
  },
},

};

export const LANGUAGE_CONFIG = {
  javascript: { name: "JavaScript", icon: "/javascript.png", monacoLang: "javascript" },
  python: { name: "Python", icon: "/python.png", monacoLang: "python" },
  java: { name: "Java", icon: "/java.png", monacoLang: "java" },
  cpp: { name: "C++", icon: "/cpp.png", monacoLang: "cpp" },
};
