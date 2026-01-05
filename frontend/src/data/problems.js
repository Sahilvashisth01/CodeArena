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
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i], target ≤ 10⁹"],
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
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]",
      python: "[0, 1]\n[1, 2]",
      java: "[0, 1]\n[1, 2]",
      cpp: "[0,1]",
    },
  },

  // ✅ FIXED PROBLEM
  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Reverse the input character array in-place.",
      notes: ["Use O(1) extra memory."],
    },
    examples: [{ input: '["h","e","l","l","o"]', output: "olleh" }],
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
}`,
    },

    // ✅ KEY FIX
    expectedOutput: {
      javascript: "olleh",
      python: "olleh",
      java: "olleh",
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
    examples: [{ input: `"A man, a plan, a canal: Panama"`, output: "true" }],
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
}`,
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
    examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
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
}`,
    },
    expectedOutput: {
      javascript: "6",
      python: "6",
      java: "6",
      cpp: "6",
    },
  },
  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String • Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: [
        "A substring is a contiguous sequence of characters.",
        "Use sliding window technique.",
      ],
    },
    examples: [
      { input: `"abcabcbb"`, output: "3" },
      { input: `"bbbbb"`, output: "1" },
      { input: `"pwwkew"`, output: "3" },
    ],
    constraints: [
      "0 ≤ s.length ≤ 10⁵",
      "s consists of English letters, digits, symbols and spaces",
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`,
      python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Write your solution here
    return 0;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb");
}`,
    },
    expectedOutput: {
      javascript: "3",
      python: "3",
      java: "3",
      cpp: "3",
    },
  },
  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array • Two Pointers • Stack",
    description: {
      text: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
      notes: [
        "Water is trapped between higher bars.",
        "Use two pointers or stack approach.",
      ],
    },
    examples: [
      {
        input: "[0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
      },
      {
        input: "[4,2,0,3,2,5]",
        output: "9",
      },
    ],
    constraints: ["1 ≤ height.length ≤ 2 * 10⁴", "0 ≤ height[i] ≤ 10⁵"],
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
}`,
    },
    expectedOutput: {
      javascript: "6",
      python: "6",
      java: "6",
      cpp: "6",
    },
  },
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: { name: "Python", icon: "/python.png", monacoLang: "python" },
  java: { name: "Java", icon: "/java.png", monacoLang: "java" },
  cpp: { name: "C++", icon: "/cpp.png", monacoLang: "cpp" },
};
