// Sample configuration for supported languages
export const supportedLanguages = [
  { id: "JAVASCRIPT", name: "JavaScript", monaco: "javascript" },
  { id: "PYTHON", name: "Python", monaco: "python" },
  { id: "JAVA", name: "Java", monaco: "java" },
  { id: "C++", name: "C++", monaco: "cpp" },
  { id: "GO", name: "Go", monaco: "go" },
];

export const sampledpData = {
  title: "Climbing Stairs",
  description: `
You are climbing a staircase with **n** steps to reach the top. At each step, you can climb either **1** or **2** steps. In how many distinct ways can you climb to the top?

### Problem Statement
Given a positive integer **n** representing the number of steps in a staircase, compute the number of unique ways to reach the top. Each move allows you to advance by either 1 or 2 steps.

### Input
- **n**: A positive integer representing the number of steps (1 <= n <= 45).

### Output
- An integer representing the number of distinct ways to climb to the top.

### Example
**Input**: n = 2  
**Output**: 2  
**Explanation**:  
There are two ways to climb to the top:  
1. 1 step + 1 step  
2. 2 steps

### Notes
- The answer will fit within a 32-bit signed integer.
- Consider optimizing for both time and space complexity, as n can be up to 45.
- This problem is a classic example of dynamic programming, similar to computing Fibonacci numbers.

### Real-World Context
This problem models scenarios like counting possible sequences in decision-making processes (e.g., ways to schedule tasks with 1 or 2 time units) or paths in recursive systems.
  `.trim(),
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization", "Fibonacci"],
  constraints: `
- 1 <= n <= 45
- Input is a positive integer.
- The output must fit within a 32-bit signed integer.
- Time complexity should be O(n) or better.
- Space complexity should be O(1) or O(n) depending on the approach.
  `.trim(),
  hints: `
1. **Basic Approach**: To reach step n, you can arrive from step (n-1) by taking 1 step or from step (n-2) by taking 2 steps. How can you combine these possibilities?
2. **Recursive Insight**: The number of ways to reach step n is the sum of ways to reach step (n-1) and step (n-2). Does this resemble a known sequence?
3. **Optimization**: A naive recursive solution may be slow for large n. Consider storing intermediate results (memoization) or using a bottom-up approach.
4. **Space Efficiency**: Can you solve it using only a few variables instead of an array to store all steps?
  `.trim(),
  editorial: `
## Editorial: Climbing Stairs

### Problem Recap
The task is to compute the number of distinct ways to climb a staircase of **n** steps, where each move is either 1 or 2 steps. This is a classic dynamic programming problem due to its recursive structure and overlapping subproblems.

### Intuition
To reach step **n**, you must come from:
- **Step (n-1)** by taking 1 step, or
- **Step (n-2)** by taking 2 steps.

Thus, the number of ways to reach step **n** is the sum of ways to reach step **(n-1)** and step **(n-2)**. This forms a recursive relation:  
**ways(n) = ways(n-1) + ways(n-2)**  
With base cases:  
- **ways(1) = 1** (one way: 1 step)
- **ways(2) = 2** (two ways: 1+1, 2)

This resembles the Fibonacci sequence, where each number is the sum of the two preceding ones.

### Approaches

#### 1. Dynamic Programming (Bottom-Up, Array-Based)
- **Idea**: Use an array 'dp' where 'dp[i]' stores the number of ways to reach step **i**.
- **Steps**:
  1. Initialize 'dp[1] = 1', 'dp[2] = 2'.
  2. For each step 'i' from 3 to n, compute 'dp[i] = dp[i-1] + dp[i-2]'.
  3. Return 'dp[n]'.
- **Time Complexity**: O(n) for iterating from 3 to n.
- **Space Complexity**: O(n) for the 'dp' array.
- **Pros**: Simple and clear.
- **Cons**: Uses O(n) space, which can be optimized.

#### 2. Dynamic Programming (Constant Space)
- **Idea**: Since we only need the last two values ('ways(n-1)' and 'ways(n-2)'), use two variables instead of an array.
- **Steps**:
  1. Initialize 'a = 1' (ways for 1 step), 'b = 2' (ways for 2 steps).
  2. For each step 'i' from 3 to n:
     - Compute 'temp = a + b'.
     - Update 'a = b', 'b = temp'.
  3. Return 'b' (or 'a' if n = 1).
- **Time Complexity**: O(n) for the loop.
- **Space Complexity**: O(1) since only two variables are used.
- **Pros**: Optimal space usage.
- **Cons**: Slightly less intuitive for beginners.

#### 3. Memoized Recursion (Top-Down)
- **Idea**: Use recursion with a cache to store computed results.
- **Steps**:
  1. Define a recursive function 'ways(n)' that returns 'ways(n-1) + ways(n-2)'.
  2. Use a cache (e.g., array or map) to store results for each n.
  3. Base cases: 'ways(1) = 1', 'ways(2) = 2'.
- **Time Complexity**: O(n) as each n is computed once.
- **Space Complexity**: O(n) for the cache.
- **Pros**: Intuitive for recursive thinkers.
- **Cons**: Overhead of recursion and cache management.

### Recommended Solution
The constant-space dynamic programming approach is recommended for its simplicity and efficiency (O(n) time, O(1) space). It avoids unnecessary memory allocation while remaining easy to understand.

### Complexity Analysis
- **Time Complexity**: O(n) for iterating through steps 3 to n.
- **Space Complexity**: O(1) using only two variables.
- **Constraints Handling**: For n <= 45, the output (Fibonacci-like) fits within a 32-bit integer (e.g., ways(45) ≈ 1.83 billion).

### Edge Cases
- **n = 1**: Only one way (1 step).
- **n = 2**: Two ways (1+1, 2).
- **n = 45**: Large input, requires efficient computation to avoid timeouts.
- **Invalid Inputs**: Not applicable, as constraints guarantee 1 <= n <= 45.

### Implementation Notes
- Ensure the solution handles n = 1 correctly (return 1, not b).
- Use integer types to avoid overflow (safe for n <= 45).
- In practice, validate inputs if the platform allows non-constrained inputs.

### Visual Explanation
For n = 4:
- Ways to reach step 4:
  - From step 3 (1 step): ways(3) = 3
  - From step 2 (2 steps): ways(2) = 2
  - Total: ways(4) = 3 + 2 = 5
- Paths: [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]

This problem teaches dynamic programming fundamentals and optimization techniques, making it an excellent learning exercise for beginners and intermediate coders.
  `.trim(),
  testCases: [
    { id: "tc1", input: "1", output: "1", isHidden: false, explanation: "Only one way to climb 1 step: [1]." },
    { id: "tc2", input: "2", output: "2", isHidden: false, explanation: "Two ways: [1,1], [2]." },
    { id: "tc3", input: "3", output: "3", isHidden: false, explanation: "Three ways: [1,1,1], [1,2], [2,1]." },
    { id: "tc4", input: "4", output: "5", isHidden: false, explanation: "Five ways: [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]." },
    { id: "tc5", input: "10", output: "89", isHidden: true, explanation: "Larger input to test efficiency." },
    { id: "tc6", input: "45", output: "1836311903", isHidden: true, explanation: "Maximum input to ensure 32-bit integer handling." },
  ],
  languages: supportedLanguages.map((lang) => ({
    language: lang.id,
    example: {
      input: lang.id === "JAVASCRIPT" || lang.id === "PYTHON" || lang.id === "JAVA" ? `n = 3` : `Sample ${lang.name} input`,
      output: lang.id === "JAVASCRIPT" || lang.id === "PYTHON" || lang.id === "JAVA" ? "3" : "Sample output",
      explanation: `
There are three distinct ways to climb a staircase with 3 steps:
1. [1,1,1]: Take 1 step three times.
2. [1,2]: Take 1 step, then 2 steps.
3. [2,1]: Take 2 steps, then 1 step.

**Visual Path**:
- Step 0 -> Step 1 -> Step 2 -> Step 3 (1,1,1)
- Step 0 -> Step 1 -> Step 3 (1,2)
- Step 0 -> Step 2 -> Step 3 (2,1)
      `.trim(),
    },
    codeSnippet: {
      JAVASCRIPT: `
/**
 * Computes the number of distinct ways to climb n steps, taking 1 or 2 steps at a time.
 * @param {number} n - Number of steps (1 <= n <= 45)
 * @return {number} - Number of distinct ways
 */
function climbStairs(n) {
    // Write your code here
}

// Input handling
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", (line) => {
    const n = parseInt(line.trim());
    const result = climbStairs(n);
    console.log(result);
    rl.close();
});
      `.trim(),
      PYTHON: `
class Solution:
    def climbStairs(self, n):
        """
        Computes the number of distinct ways to climb n steps, taking 1 or 2 steps at a time.
        :param n: Number of steps (1 <= n <= 45)
        :return: Number of distinct ways
        """
        # Write your code here
        pass

# Input handling
if __name__ == "__main__":
    import sys
    n = int(sys.stdin.readline().strip())
    sol = Solution()
    result = sol.climbStairs(n)
    print(result)
      `.trim(),
      JAVA: `
import java.util.Scanner;

public class Main {
    /**
     * Computes the number of distinct ways to climb n steps, taking 1 or 2 steps at a time.
     * @param n Number of steps (1 <= n <= 45)
     * @return Number of distinct ways
     */
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Main main = new Main();
        int result = main.climbStairs(n);
        System.out.println(result);
        scanner.close();
    }
}
      `.trim(),
      "C++": `
#include <iostream>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
};

int main() {
    int n;
    cin >> n;
    Solution sol;
    cout << sol.climbStairs(n) << endl;
    return 0;
}
      `.trim(),
      GO: `
package main

import "fmt"

func climbStairs(n int) int {
    // Write your code here
    return 0
}

func main() {
    var n int
    fmt.Scan(&n)
    result := climbStairs(n)
    fmt.Println(result)
}
      `.trim(),
    }[lang.id],
    referenceSolution: {
      JAVASCRIPT: `
/**
 * Computes the number of distinct ways to climb n steps, taking 1 or 2 steps at a time.
 * @param {number} n - Number of steps (1 <= n <= 45)
 * @return {number} - Number of distinct ways
 */
function climbStairs(n) {
    // Handle base cases
    if (n <= 2) return n;
    
    // Use two variables to track ways for previous two steps
    let prev1 = 1; // Ways to climb 1 step
    let prev2 = 2; // Ways to climb 2 steps
    
    // Iterate from step 3 to n
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2; // Ways to reach current step
        prev1 = prev2; // Shift for next iteration
        prev2 = current;
    }
    
    return prev2;
}

// Input handling
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", (line) => {
    const n = parseInt(line.trim());
    const result = climbStairs(n);
    console.log(result);
    rl.close();
});
      `.trim(),
      PYTHON: `
class Solution:
    def climbStairs(self, n):
        """
        Computes the number of distinct ways to climb n steps, taking 1 or 2 steps at a time.
        :param n: Number of steps (1 <= n <= 45)
        :return: Number of distinct ways
        """
        # Handle base cases
        if n <= 2:
            return n
        
        # Use two variables to track ways for previous two steps
        prev1, prev2 = 1, 2  # Ways for 1 and 2 steps
        
        # Iterate from step 3 to n
        for i in range(3, n + 1):
            current = prev1 + prev2  # Ways to reach current step
            prev1, prev2 = prev2, current  # Shift for next iteration
        
        return prev2

# Input handling
if __name__ == "__main__":
    import sys
    n = int(sys.stdin.readline().strip())
    sol = Solution()
    result = sol.climbStairs(n)
    print(result)
      `.trim(),
      JAVA: `
import java.util.Scanner;

public class Main {
    /**
     * Computes the number of distinct ways to climb n steps, taking 1 or 2 steps at a time.
     * @param n Number of steps (1 <= n <= 45)
     * @return Number of distinct ways
     */
    public int climbStairs(int n) {
        // Handle base cases
        if (n <= 2) {
            return n;
        }
        
        // Use two variables to track ways for previous two steps
        int prev1 = 1; // Ways to climb 1 step
        int prev2 = 2; // Ways to climb 2 steps
        
        // Iterate from step 3 to n
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2; // Ways to reach current step
            prev1 = prev2; // Shift for next iteration
            prev2 = current;
        }
        
        return prev2;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Main main = new Main();
        int result = main.climbStairs(n);
        System.out.println(result);
        scanner.close();
    }
}
      `.trim(),
      "C++": `
#include <iostream>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev1 = 1, prev2 = 2;
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev1 = prev2;
            prev2 = current;
        }
        return prev2;
    }
};

int main() {
    int n;
    cin >> n;
    Solution sol;
    cout << sol.climbStairs(n) << endl;
    return 0;
}
      `.trim(),
      GO: `
package main

import "fmt"

func climbStairs(n int) int {
    if n <= 2 {
        return n
    }
    prev1, prev2 := 1, 2
    for i := 3; i <= n; i++ {
        current := prev1 + prev2
        prev1, prev2 = prev2, current
    }
    return prev2
}

func main() {
    var n int
    fmt.Scan(&n)
    result := climbStairs(n)
    fmt.Println(result)
}
      `.trim(),
    }[lang.id],
  })),
};

export const sampleStringProblem = {
  title: "Valid Palindrome",
  description: `
A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters (a-z) and numbers (0-9).

### Problem Statement
Given a string **s**, determine if it is a palindrome after:
1. Converting all uppercase letters to lowercase.
2. Removing all non-alphanumeric characters (e.g., punctuation, spaces, symbols).
Return **true** if the resulting string is a palindrome, **false** otherwise.

### Input
- **s**: A string containing printable ASCII characters (1 <= s.length <= 2 x 10^5).

### Output
- A boolean: **true** if the processed string is a palindrome, **false** otherwise.

### Example
**Input**: s = "A man, a plan, a canal: Panama"  
**Output**: true  
**Explanation**:  
After processing:
- Convert to lowercase: "a man, a plan, a canal: panama"
- Remove non-alphanumeric: "amanaplanacanalpanama"
- This string reads the same forward and backward, so it's a palindrome.

**Input**: s = "race a car"  
**Output**: false  
**Explanation**:  
After processing: "raceacar" is not a palindrome.

### Notes
- The input string may contain spaces, punctuation, or special characters.
- Case sensitivity is ignored (e.g., 'A' equals 'a').
- An empty string or single character is a palindrome.
- Optimize for O(n) time complexity, where n is the string length.
- Consider O(1) extra space (excluding input/output).

### Real-World Context
This problem is relevant in text processing, such as validating symmetric identifiers (e.g., usernames, product codes) or checking data integrity in systems ignoring case and formatting.
  `.trim(),
  difficulty: "EASY",
  tags: ["String", "Two Pointers", "Character Processing"],
  constraints: `
- 1 <= s.length <= 2 x 10^5
- s consists of printable ASCII characters (e.g., letters, numbers, punctuation, spaces).
- Output is a boolean (true/false).
- Time complexity should be O(n) or better, where n is the string length.
- Space complexity should be O(1), excluding input/output storage.
  `.trim(),
  hints: `
1. **Preprocessing**: How can you clean the string to keep only alphanumeric characters and make it case-insensitive?
2. **Palindrome Check**: Consider comparing characters from both ends of the processed string. How would you handle this efficiently?
3. **Two Pointers**: Use two pointers (left and right) moving toward the center. What should you do when characters don't match?
4. **In-Place Check**: Can you check the palindrome property without creating a new string, by skipping non-alphanumeric characters during iteration?
  `.trim(),
  editorial: `
## Editorial: Valid Palindrome

### Problem Recap
The task is to determine if a string is a palindrome after converting it to lowercase and removing non-alphanumeric characters. A palindrome reads the same forward and backward.

### Intuition
To check if a string is a palindrome:
1. **Preprocess**: Convert the string to lowercase and filter out non-alphanumeric characters (e.g., spaces, punctuation).
2. **Verify**: Compare characters from both ends toward the center. If all pairs match, it's a palindrome.

The challenge is to do this efficiently, ideally in O(n) time and O(1) space, while handling edge cases like empty strings or strings with only non-alphanumeric characters.

### Approaches

#### 1. Two Pointers (In-Place)
- **Idea**: Use two pointers (left and right) to scan the string, skipping non-alphanumeric characters and comparing valid characters.
- **Steps**:
  1. Initialize 'left = 0', 'right = s.length - 1'.
  2. While 'left < right':
     - Skip non-alphanumeric characters at 'left' (increment until alphanumeric or 'left >= right').
     - Skip non-alphanumeric characters at 'right' (decrement until alphanumeric or 'left >= right').
     - Compare 's[left].toLowerCase()' and 's[right].toLowerCase()'. If they differ, return 'false'.
     - Move 'left++', 'right--'.
  3. Return 'true' if the loop completes.
- **Time Complexity**: O(n) for one pass through the string.
- **Space Complexity**: O(1) as only pointers are used.
- **Pros**: Most efficient in space and time, no extra string creation.
- **Cons**: Slightly more complex due to in-place skipping.

#### 2. Preprocess and Compare
- **Idea**: Create a new string with only lowercase alphanumeric characters, then check if it's a palindrome.
- **Steps**:
  1. Filter 's' to keep only alphanumeric characters (e.g., using regex or character checks) and convert to lowercase.
  2. Use two pointers or compare the string with its reverse.
- **Time Complexity**: O(n) for preprocessing and checking.
- **Space Complexity**: O(n) for the new string.
- **Pros**: Simpler to implement.
- **Cons**: Uses extra space, less efficient for large strings.

#### 3. Array Reversal
- **Idea**: Similar to preprocessing, but reverse the filtered string and compare it with the original filtered string.
- **Steps**:
  1. Create a filtered string (lowercase, alphanumeric only).
  2. Check if 'filtered === filtered.reverse()'.
- **Time Complexity**: O(n) for preprocessing and reversal.
- **Space Complexity**: O(n) for the new string.
- **Pros**: Very intuitive.
- **Cons**: Inefficient due to string copying and reversal.

### Recommended Solution
The in-place two-pointer approach is recommended for its O(n) time and O(1) space complexity, aligning with the problem's constraints and optimizing performance for large inputs.

### Complexity Analysis
- **Time Complexity**: O(n) for a single pass through the string.
- **Space Complexity**: O(1) using only two pointers.
- **Constraints Handling**: Handles strings up to 2 x 10^5 efficiently and processes all ASCII characters correctly.

### Edge Cases
- **Empty String**: Returns 'true' (empty string is a palindrome).
- **Single Character**: Returns 'true' (single character is a palindrome).
- **Non-Alphanumeric Only**: E.g., "!@#", returns 'true' (empty after filtering).
- **Mixed Case**: E.g., "RaCeCaR", returns 'true' after lowercase conversion.
- **Large Input**: E.g., 2 x 10^5 characters, requires efficient O(n) solution.

### Implementation Notes
- Use language-specific functions to check alphanumeric characters (e.g., 'isalnum()' in Python, 'Character.isLetterOrDigit()' in Java).
- Ensure case-insensitive comparison (e.g., 'toLowerCase()' in JavaScript/Java).
- Handle edge cases explicitly to avoid index out-of-bounds errors.

### Visual Explanation
For s = "A man, a plan, a canal: Panama":
- Processed: "amanaplanacanalpanama"
- Two pointers:
  - left = 'a', right = 'a' -> match
  - left = 'm', right = 'm' -> match
  - Continue until left >= right
- Result: 'true'

This problem teaches string manipulation, two-pointer techniques, and efficient character processing, making it a great exercise for string-handling skills.
  `.trim(),
  testCases: [
    { id: "tc1", input: "A man, a plan, a canal: Panama", output: "true", isHidden: false, explanation: "After processing, 'amanaplanacanalpanama' is a palindrome." },
    { id: "tc2", input: "race a car", output: "false", isHidden: false, explanation: "After processing, 'raceacar' is not a palindrome." },
    { id: "tc3", input: " ", output: "true", isHidden: false, explanation: "Empty string after removing spaces is a palindrome." },
    { id: "tc4", input: "Aa1", output: "false", isHidden: true, explanation: "After processing, 'aa1' is not a palindrome." },
    { id: "tc5", input: "A".repeat(10) + "a".repeat(10), output: "true", isHidden: true, explanation: "Large input to test efficiency, all 'a' after lowercase." },
  ],
  languages: supportedLanguages.map((lang) => ({
    language: lang.id,
    example: {
      input: lang.id === "JAVASCRIPT" || lang.id === "PYTHON" || lang.id === "JAVA" ? `s = "A man, a plan, a canal: Panama"` : `Sample ${lang.name} input`,
      output: lang.id === "JAVASCRIPT" || lang.id === "PYTHON" || lang.id === "JAVA" ? "true" : "Sample output",
      explanation: `
After processing the input:
1. Original: "A man, a plan, a canal: Panama"
2. Lowercase: "a man, a plan, a canal: panama"
3. Remove non-alphanumeric: "amanaplanacanalpanama"
4. Check: Reads the same forward and backward.

**Two-Pointer Process**:
- Compare 'a' (index 0) and 'a' (last index) -> match
- Compare 'm' and 'm' -> match
- Continue until all characters match.
      `.trim(),
    },
    codeSnippet: {
      JAVASCRIPT: `
/**
 * Checks if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.
 * @param {string} s - Input string (1 <= s.length <= 2e5)
 * @return {boolean} - True if palindrome, false otherwise
 */
function isPalindrome(s) {
    // Write your code here
}

// Input handling
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
});
      `.trim(),
      PYTHON: `
class Solution:
    def isPalindrome(self, s):
        """
        Checks if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.
        :param s: Input string (1 <= s.length <= 2e5)
        :return: True if palindrome, false otherwise
        """
        # Write your code here
        pass

# Input handling
if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    sol = Solution()
    result = sol.isPalindrome(s)
    print(str(result).lower())
      `.trim(),
      JAVA: `
import java.util.Scanner;

public class Main {
    /**
     * Checks if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.
     * @param s Input string (1 <= s.length <= 2e5)
     * @return True if palindrome, false otherwise
     */
    public boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        Main main = new Main();
        boolean result = main.isPalindrome(input);
        System.out.println(result ? "true" : "false");
        scanner.close();
    }
}
      `.trim(),
      "C++": `
#include <iostream>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your code here
        return false;
    }
};

int main() {
    string s;
    getline(cin, s);
    Solution sol;
    cout << (sol.isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}
      `.trim(),
      GO: `
package main

import "fmt"

func isPalindrome(s string) bool {
    // Write your code here
    return false
}

func main() {
    var s string
    fmt.Scanln(&s)
    result := isPalindrome(s)
    fmt.Println(result)
}
      `.trim(),
    }[lang.id],
    referenceSolution: {
      JAVASCRIPT: `
/**
 * Checks if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.
 * @param {string} s - Input string (1 <= s.length <= 2e5)
 * @return {boolean} - True if palindrome, false otherwise
 */
function isPalindrome(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Skip non-alphanumeric characters from left
        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) {
            left++;
        }
        // Skip non-alphanumeric characters from right
        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) {
            right--;
        }
        // Compare characters (case-insensitive)
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// Input handling
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
});
      `.trim(),
      PYTHON: `
class Solution:
    def isPalindrome(self, s):
        """
        Checks if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.
        :param s: Input string (1 <= s.length <= 2e5)
        :return: True if palindrome, false otherwise
        """
        left, right = 0, len(s) - 1
        
        while left < right:
            # Skip non-alphanumeric characters from left
            while left < right and not s[left].isalnum():
                left += 1
            # Skip non-alphanumeric characters from right
            while left < right and not s[right].isalnum():
                right -= 1
            # Compare characters (case-insensitive)
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        
        return True

# Input handling
if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    sol = Solution()
    result = sol.isPalindrome(s)
    print(str(result).lower())
      `.trim(),
      JAVA: `
import java.util.Scanner;

public class Main {
    /**
     * Checks if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.
     * @param s Input string (1 <= s.length <= 2e5)
     * @return True if palindrome, false otherwise
     */
    public boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            // Skip non-alphanumeric characters from left
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            // Skip non-alphanumeric characters from right
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            // Compare characters (case-insensitive)
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        Main main = new Main();
        boolean result = main.isPalindrome(input);
        System.out.println(result ? "true" : "false");
        scanner.close();
    }
}
      `.trim(),
      "C++": `
#include <iostream>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
};

int main() {
    string s;
    getline(cin, s);
    Solution sol;
    cout << (sol.isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}
      `.trim(),
      GO: `
package main

import (
    "fmt"
    "strings"
    "unicode"
)

func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        for left < right && !unicode.IsLetter(rune(s[left])) && !unicode.IsDigit(rune(s[left])) {
            left++
        }
        for left < right && !unicode.IsLetter(rune(s[right])) && !unicode.IsDigit(rune(s[right])) {
            right--
        }
        if strings.ToLower(string(s[left])) != strings.ToLower(string(s[right])) {
            return false
        }
        left++
        right--
    }
    return true
}

func main() {
    var s string
    fmt.Scanln(&s)
    result := isPalindrome(s)
    fmt.Println(result)
}
      `.trim(),
    }[lang.id],
  })),
};