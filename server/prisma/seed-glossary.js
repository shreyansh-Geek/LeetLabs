import { PrismaClient } from '../src/generated/prisma/index.js';
import dotenv from 'dotenv';

// Load environment variables from server/.env
dotenv.config({ path: '../server/.env' });

const prisma = new PrismaClient();

async function main() {
  // Seed Glossary Terms
  const glossaryTerms = [
    // A
    {
      id: '1',
      term: 'Array',
      details: {
        definition: 'A data structure consisting of a collection of elements, each identified by at least one array index or key.',
        example: 'In JavaScript, `let arr = [1, 2, 3]` creates an array. Accessing `arr[1]` returns 2.',
        whyItMatters: 'Arrays are fundamental for storing and manipulating ordered data efficiently.',
        commonPitfalls: 'Accessing out-of-bounds indices can lead to errors; e.g., `arr[10]` in a 3-element array.',
      },
      category: 'Data Structure',
    },
    {
      id: '2',
      term: 'Asynchronous Programming',
      details: {
        definition: 'A programming paradigm that allows operations to run independently of the main thread, improving responsiveness.',
        example: 'In JavaScript, using `async/await` to fetch data: `const data = await fetch(url).then(res => res.json())`.',
        whyItMatters: 'Enables non-blocking operations, crucial for I/O-bound tasks like API calls.',
        commonPitfalls: 'Not handling errors in promises can lead to uncaught exceptions.',
      },
      category: 'Programming Paradigm',
    },
    // B
    {
      id: '3',
      term: 'Big O Notation',
      details: {
        definition: 'A mathematical notation to describe the upper bound of an algorithm’s time or space complexity.',
        example: 'An algorithm with a nested loop over `n` elements has O(n^2) time complexity, e.g., bubble sort.',
        whyItMatters: 'Helps evaluate and compare algorithm efficiency for scalability.',
        commonPitfalls: 'Ignoring constant factors or lower-order terms, which can matter in practical scenarios.',
      },
      category: 'Complexity',
    },
    {
      id: '4',
      term: 'Binary Search',
      details: {
        definition: 'An efficient algorithm for finding an element in a sorted array by repeatedly dividing the search interval in half.',
        example: 'Given a sorted array `[1, 3, 5, 7, 9]`, searching for 7 results in O(log n) time by halving the array each step.',
        whyItMatters: 'Extremely efficient for large sorted datasets compared to linear search.',
        commonPitfalls: 'Forgetting to ensure the array is sorted, leading to incorrect results.',
      },
      category: 'Algorithm',
    },
    // C
    {
      id: '5',
      term: 'Cache',
      details: {
        definition: 'A hardware or software component that stores data to serve future requests faster.',
        example: 'A browser cache stores website assets to reduce load times on revisits.',
        whyItMatters: 'Improves performance by reducing redundant computations or data retrieval.',
        commonPitfalls: 'Cache invalidation issues, such as serving stale data.',
      },
      category: 'System Design',
    },
    {
      id: '6',
      term: 'Concurrency',
      details: {
        definition: 'The ability of a system to manage multiple tasks that can be executed independently and possibly simultaneously.',
        example: 'Using threads in Java to handle multiple user requests in a web server.',
        whyItMatters: 'Maximizes resource utilization in multi-core systems.',
        commonPitfalls: 'Race conditions when multiple threads access shared resources without proper synchronization.',
      },
      category: 'Programming Paradigm',
    },
    // D
    {
      id: '7',
      term: 'Dynamic Programming',
      details: {
        definition: 'A method used in programming to solve problems by breaking them down into smaller overlapping subproblems and storing results to avoid redundant work.',
        example: 'The Fibonacci sequence can be optimized using DP to avoid repeated calculations. Without DP: `fib(n) = fib(n-1) + fib(n-2)` leads to O(2^n) time. With DP: Store results in an array, reducing time to O(n).',
        whyItMatters: 'Use DP when a problem has optimal substructure and overlapping subproblems, like in optimization problems.',
        commonPitfalls: 'Confusing DP with divide and conquer, or not storing intermediate results properly, leading to inefficiencies.',
      },
      category: 'Algorithm',
    },
    {
      id: '8',
      term: 'Depth-First Search',
      details: {
        definition: 'An algorithm for traversing or searching tree or graph data structures by exploring as far as possible along each branch before backtracking.',
        example: 'Using DFS to find a path in a maze by exploring each path to its end before trying another.',
        whyItMatters: 'Useful for topological sorting, cycle detection, and pathfinding in graphs.',
        commonPitfalls: 'Can lead to stack overflow in deep graphs if not implemented iteratively.',
      },
      category: 'Algorithm',
    },
    // E
    {
      id: '9',
      term: 'Encapsulation',
      details: {
        definition: 'An object-oriented programming principle that bundles data and methods operating on that data within a single unit, restricting direct access.',
        example: 'In Java, using private fields with public getters/setters: `private int age; public int getAge() { return age; }`.',
        whyItMatters: 'Protects object integrity by controlling access and modification.',
        commonPitfalls: 'Overusing getters/setters can break encapsulation if they expose too much.',
      },
      category: 'OOP',
    },
    {
      id: '10',
      term: 'Event Loop',
      details: {
        definition: 'A programming construct that handles asynchronous operations by continuously monitoring the call stack and task queue.',
        example: 'In JavaScript, the event loop processes `setTimeout` callbacks after the main thread is free.',
        whyItMatters: 'Enables asynchronous programming in single-threaded environments like JavaScript.',
        commonPitfalls: 'Blocking the event loop with heavy synchronous tasks can freeze the application.',
      },
      category: 'Programming Paradigm',
    },
    // F
    {
      id: '11',
      term: 'Fibonacci Sequence',
      details: {
        definition: 'A series of numbers where each number is the sum of the two preceding ones, starting from 0 and 1.',
        example: 'Sequence: 0, 1, 1, 2, 3, 5, 8... Computed as `fib(n) = fib(n-1) + fib(n-2)`.',
        whyItMatters: 'Used in algorithm optimization problems to demonstrate recursion and dynamic programming.',
        commonPitfalls: 'Naive recursive solutions have exponential time complexity O(2^n).',
      },
      category: 'Algorithm',
    },
    {
      id: '12',
      term: 'Functional Programming',
      details: {
        definition: 'A programming paradigm that treats computation as the evaluation of mathematical functions, avoiding mutable data and side effects.',
        example: 'In JavaScript, using `map` to transform an array: `[1, 2, 3].map(x => x * 2)` returns `[2, 4, 6]`.',
        whyItMatters: 'Promotes immutability and predictability, reducing bugs in concurrent systems.',
        commonPitfalls: 'Overusing pure functions can lead to performance overhead for large datasets.',
      },
      category: 'Programming Paradigm',
    },
    // G
    {
      id: '13',
      term: 'Graph',
      details: {
        definition: 'A data structure consisting of nodes (vertices) connected by edges, used to represent relationships.',
        example: 'Social networks can be modeled as graphs where users are nodes and friendships are edges.',
        whyItMatters: 'Essential for solving problems like shortest paths, network flow, and recommendation systems.',
        commonPitfalls: 'Not accounting for cycles in undirected graphs can lead to infinite loops.',
      },
      category: 'Data Structure',
    },
    {
      id: '14',
      term: 'Greedy Algorithm',
      details: {
        definition: 'An algorithmic approach that makes the locally optimal choice at each step to find a global optimum.',
        example: 'In the coin change problem, always picking the largest denomination first to minimize the number of coins.',
        whyItMatters: 'Efficient for problems like minimum spanning trees and scheduling.',
        commonPitfalls: 'Greedy choices don’t always lead to the global optimum (e.g., in the knapsack problem).',
      },
      category: 'Algorithm',
    },
    // H
    {
      id: '15',
      term: 'Hash Table',
      details: {
        definition: 'A data structure that maps keys to values for efficient lookup using a hash function.',
        example: 'In the Two Sum problem, a hash table stores numbers and their indices: `hash[num] = index`, allowing O(1) lookups to find pairs.',
        whyItMatters: 'Provides fast data retrieval, useful in problems requiring quick lookups like Two Sum or caching.',
        commonPitfalls: 'Collisions can degrade performance if not handled (e.g., using chaining or open addressing).',
      },
      category: 'Data Structure',
    },
    {
      id: '16',
      term: 'Heap',
      details: {
        definition: 'A tree-based data structure that satisfies the heap property, often used to implement priority queues.',
        example: 'A min-heap ensures the parent node is smaller than its children, used in Dijkstra’s algorithm.',
        whyItMatters: 'Efficient for priority-based operations like scheduling tasks or finding the smallest/largest elements.',
        commonPitfalls: 'Forgetting to maintain the heap property after insertions or deletions.',
      },
      category: 'Data Structure',
    },
    // I
    {
      id: '17',
      term: 'Inheritance',
      details: {
        definition: 'An OOP principle where a class inherits properties and methods from another class.',
        example: 'In Java, `class Dog extends Animal` inherits `eat()` from `Animal`.',
        whyItMatters: 'Promotes code reuse and establishes a hierarchy of classes.',
        commonPitfalls: 'Overusing inheritance can lead to tight coupling and fragile base class problems.',
      },
      category: 'OOP',
    },
    {
      id: '18',
      term: 'Immutable Data',
      details: {
        definition: 'Data that cannot be modified after creation, often used in functional programming.',
        example: 'In JavaScript, using `const` for arrays prevents reassignment, but elements can still be mutated unless frozen with `Object.freeze()`.',
        whyItMatters: 'Prevents unintended side effects, making code more predictable.',
        commonPitfalls: 'Copying large immutable objects can lead to performance overhead.',
      },
      category: 'Programming Paradigm',
    },
    // J
    {
      id: '19',
      term: 'JSON',
      details: {
        definition: 'A lightweight data-interchange format that is easy for humans to read and write, and for machines to parse and generate.',
        example: 'A JSON object: `{"name": "Alice", "age": 25}` used in API responses.',
        whyItMatters: 'Widely used for data exchange between client and server in web applications.',
        commonPitfalls: 'Not validating JSON data can lead to parsing errors or security issues.',
      },
      category: 'Data Format',
    },
    {
      id: '20',
      term: 'Java Virtual Machine',
      details: {
        definition: 'An abstract machine that provides a runtime environment for executing Java bytecode.',
        example: 'Java code is compiled into bytecode, which the JVM executes on any platform.',
        whyItMatters: 'Enables Java’s “write once, run anywhere” principle.',
        commonPitfalls: 'Misconfiguring JVM memory settings can lead to OutOfMemory errors.',
      },
      category: 'Runtime',
    },
    // K
    {
      id: '21',
      term: 'Knapsack Problem',
      details: {
        definition: 'A combinatorial optimization problem where you select items to maximize value within a weight constraint.',
        example: 'Given items with weights and values, select a subset to maximize value without exceeding a weight limit.',
        whyItMatters: 'Models real-world problems like resource allocation and budgeting.',
        commonPitfalls: 'Assuming a greedy approach works, when dynamic programming is often required.',
      },
      category: 'Algorithm',
    },
    {
      id: '22',
      term: 'Key-Value Store',
      details: {
        definition: 'A type of NoSQL database that uses a simple key-value pair to store data.',
        example: 'Redis stores data as `key: "user1", value: "Alice"`.',
        whyItMatters: 'Provides fast lookups and is scalable for caching and session management.',
        commonPitfalls: 'Not suitable for complex queries or relational data.',
      },
      category: 'Database',
    },
    // L
    {
      id: '23',
      term: 'Linked List',
      details: {
        definition: 'A linear data structure where elements (nodes) are linked using pointers, each containing data and a reference to the next node.',
        example: 'A singly linked list: `Node { data: 1, next: Node { data: 2, next: null } }`.',
        whyItMatters: 'Efficient for dynamic memory allocation and insertions/deletions.',
        commonPitfalls: 'Accessing elements is O(n), unlike arrays which are O(1).',
      },
      category: 'Data Structure',
    },
    {
      id: '24',
      term: 'Load Balancing',
      details: {
        definition: 'The process of distributing network traffic across multiple servers to ensure no single server becomes overwhelmed.',
        example: 'Using a round-robin algorithm to distribute requests across three servers.',
        whyItMatters: 'Improves scalability and reliability of applications.',
        commonPitfalls: 'Sticky sessions can lead to uneven load distribution.',
      },
      category: 'System Design',
    },
    // M
    {
      id: '25',
      term: 'Memoization',
      details: {
        definition: 'A technique to store the results of expensive function calls and reuse them when the same inputs occur again.',
        example: 'In the Fibonacci sequence, memoization stores `fib(n)` results in a hash table to avoid recalculating: `memo[n] = fib(n-1) + fib(n-2)`.',
        whyItMatters: 'Improves performance of recursive algorithms by avoiding redundant computations.',
        commonPitfalls: 'Not handling base cases properly or using excessive memory for large inputs.',
      },
      category: 'Algorithm',
    },
    {
      id: '26',
      term: 'Microservices',
      details: {
        definition: 'An architectural style that structures an application as a collection of loosely coupled services.',
        example: 'A shopping app with separate services for user authentication, product catalog, and payments.',
        whyItMatters: 'Enables independent deployment and scaling of services.',
        commonPitfalls: 'Increased complexity in managing inter-service communication and data consistency.',
      },
      category: 'System Design',
    },
    // N
    {
      id: '27',
      term: 'Node.js',
      details: {
        definition: 'A JavaScript runtime built on Chrome’s V8 engine, used for executing JavaScript code server-side.',
        example: 'Creating a simple server: `const http = require("http"); http.createServer((req, res) => res.end("Hello")).listen(3000);`.',
        whyItMatters: 'Enables full-stack JavaScript development with high performance for I/O-bound tasks.',
        commonPitfalls: 'Blocking the event loop with CPU-intensive tasks can degrade performance.',
      },
      category: 'Runtime',
    },
    {
      id: '28',
      term: 'Normalization',
      details: {
        definition: 'A process in database design that organizes data to reduce redundancy and improve data integrity.',
        example: 'Splitting a table with user and order data into separate `Users` and `Orders` tables.',
        whyItMatters: 'Prevents data anomalies during insertions, updates, and deletions.',
        commonPitfalls: 'Over-normalization can lead to complex queries and performance issues.',
      },
      category: 'Database',
    },
    // O
    {
      id: '29',
      term: 'Object-Oriented Programming',
      details: {
        definition: 'A programming paradigm based on the concept of objects, which can contain data and methods.',
        example: 'In Python, `class Car: def drive(self): print("Driving")` defines a class with a method.',
        whyItMatters: 'Promotes modularity, reusability, and maintainability in code.',
        commonPitfalls: 'Overusing inheritance can lead to complex and rigid codebases.',
      },
      category: 'Programming Paradigm',
    },
    {
      id: '30',
      term: 'Optimization',
      details: {
        definition: 'The process of making a system, algorithm, or program as efficient as possible in terms of time, space, or other resources.',
        example: 'Replacing a linear search (O(n)) with binary search (O(log n)) in a sorted array.',
        whyItMatters: 'Improves performance, especially for large-scale applications.',
        commonPitfalls: 'Premature optimization can lead to complex code without significant gains.',
      },
      category: 'Algorithm',
    },
    // P
    {
      id: '31',
      term: 'Polymorphism',
      details: {
        definition: 'An OOP principle that allows objects of different classes to be treated as objects of a common superclass.',
        example: 'In Java, `Animal animal = new Dog(); animal.makeSound();` calls the `Dog` class’s `makeSound()`.',
        whyItMatters: 'Enables flexibility and extensibility in code design.',
        commonPitfalls: 'Overriding methods incorrectly can break expected behavior.',
      },
      category: 'OOP',
    },
    {
      id: '32',
      term: 'Priority Queue',
      details: {
        definition: 'A data structure where each element has a priority, and elements with higher priority are dequeued before others.',
        example: 'Using a priority queue in Dijkstra’s algorithm to always process the node with the smallest distance first.',
        whyItMatters: 'Efficient for scheduling and graph algorithms.',
        commonPitfalls: 'Not updating priorities correctly after modifications.',
      },
      category: 'Data Structure',
    },
    // Q
    {
      id: '33',
      term: 'Queue',
      details: {
        definition: 'A linear data structure that follows the First In, First Out (FIFO) principle.',
        example: 'A task queue in a job scheduler: `enqueue(task); dequeue()` processes tasks in order.',
        whyItMatters: 'Useful for processing tasks in order, such as in breadth-first search.',
        commonPitfalls: 'Not handling queue overflow in fixed-size implementations.',
      },
      category: 'Data Structure',
    },
    {
      id: '34',
      term: 'Quick Sort',
      details: {
        definition: 'A divide-and-conquer sorting algorithm that selects a pivot and partitions the array around it.',
        example: 'Sorting `[5, 2, 9, 1, 7]` by choosing 5 as pivot, partitioning into `[2, 1]` and `[9, 7]`, then recursing.',
        whyItMatters: 'Efficient average-case time complexity of O(n log n).',
        commonPitfalls: 'Worst-case O(n^2) performance with poor pivot selection (e.g., already sorted arrays).',
      },
      category: 'Algorithm',
    },
    // R
    {
      id: '35',
      term: 'Recursion',
      details: {
        definition: 'A process where a function calls itself to solve smaller instances of the same problem.',
        example: 'Factorial: `function factorial(n) { return n === 0 ? 1 : n * factorial(n-1); }`.',
        whyItMatters: 'Simplifies solutions for problems like tree traversals and divide-and-conquer algorithms.',
        commonPitfalls: 'Missing base cases can lead to infinite recursion and stack overflow.',
      },
      category: 'Algorithm',
    },
    {
      id: '36',
      term: 'REST API',
      details: {
        definition: 'An architectural style for designing networked applications, relying on stateless, client-server communication, typically over HTTP.',
        example: 'A GET request to `/api/users` retrieves a list of users in JSON format.',
        whyItMatters: 'Standardizes communication between client and server, widely used in web development.',
        commonPitfalls: 'Not handling HTTP status codes properly can lead to unclear error responses.',
      },
      category: 'System Design',
    },
    // S
    {
      id: '37',
      term: 'Stack',
      details: {
        definition: 'A linear data structure that follows the Last In, First Out (LIFO) principle.',
        example: 'A call stack in programming: `push(frame); pop()` manages function calls.',
        whyItMatters: 'Useful for backtracking, undo operations, and depth-first search.',
        commonPitfalls: 'Stack overflow in recursive algorithms with deep call stacks.',
      },
      category: 'Data Structure',
    },
    {
      id: '38',
      term: 'SQL',
      details: {
        definition: 'A domain-specific language used for managing and querying relational databases.',
        example: 'Selecting data: `SELECT name FROM users WHERE age > 18;`.',
        whyItMatters: 'Essential for data manipulation and retrieval in relational databases.',
        commonPitfalls: 'Not indexing frequently queried columns can lead to slow queries.',
      },
      category: 'Database',
    },
    // T
    {
      id: '39',
      term: 'Tree',
      details: {
        definition: 'A hierarchical data structure with a root node and child nodes, where each node has at most one parent.',
        example: 'A binary tree where each node has at most two children, used in binary search trees.',
        whyItMatters: 'Efficient for hierarchical data storage and searching, like in file systems.',
        commonPitfalls: 'Unbalanced trees can degrade performance to O(n) instead of O(log n).',
      },
      category: 'Data Structure',
    },
    {
      id: '40',
      term: 'Trie',
      details: {
        definition: 'A tree-like data structure used to store a dynamic set of strings, often for efficient prefix-based searches.',
        example: 'Storing words like "cat" and "car" in a trie to enable fast autocomplete suggestions.',
        whyItMatters: 'Efficient for dictionary implementations and autocomplete features.',
        commonPitfalls: 'High memory usage due to storing many nodes for long strings.',
      },
      category: 'Data Structure',
    },
    // U
    {
      id: '41',
      term: 'Unit Testing',
      details: {
        definition: 'A software testing method where individual units of code are tested to ensure they work as expected.',
        example: 'Using Jest to test a function: `test("adds 1 + 2 to equal 3", () => { expect(add(1, 2)).toBe(3); });`.',
        whyItMatters: 'Catches bugs early and ensures code reliability.',
        commonPitfalls: 'Writing tests that are too tightly coupled to implementation details.',
      },
      category: 'Software Engineering',
    },
    {
      id: '42',
      term: 'Unicode',
      details: {
        definition: 'A standard for encoding, representing, and handling text in most of the world’s writing systems.',
        example: 'The character `A` is represented as `U+0041` in Unicode.',
        whyItMatters: 'Enables consistent text representation across different platforms and languages.',
        commonPitfalls: 'Not handling multi-byte characters correctly can lead to encoding errors.',
      },
      category: 'Data Format',
    },
    // V
    {
      id: '43',
      term: 'Virtual Machine',
      details: {
        definition: 'A software-based emulation of a physical computer that executes programs like a real machine.',
        example: 'Using Docker to run a Linux VM on a Windows host.',
        whyItMatters: 'Enables isolated environments for testing and deployment.',
        commonPitfalls: 'Overhead from virtualization can impact performance.',
      },
      category: 'System Design',
    },
    {
      id: '44',
      term: 'Version Control',
      details: {
        definition: 'A system that records changes to files over time, allowing multiple developers to collaborate.',
        example: 'Using Git: `git commit -m "Add feature"` to save changes.',
        whyItMatters: 'Facilitates collaboration, rollback, and tracking of changes in software projects.',
        commonPitfalls: 'Not committing frequently can lead to large, hard-to-review changes.',
      },
      category: 'Software Engineering',
    },
    // W
    {
      id: '45',
      term: 'Web Socket',
      details: {
        definition: 'A communication protocol that provides full-duplex communication channels over a single TCP connection.',
        example: 'Using WebSockets for a chat app to send real-time messages between client and server.',
        whyItMatters: 'Enables real-time applications like chat, gaming, and live updates.',
        commonPitfalls: 'Not handling connection drops can lead to data loss.',
      },
      category: 'System Design',
    },
    {
      id: '46',
      term: 'Weighted Graph',
      details: {
        definition: 'A graph where edges have associated weights or costs, used in problems like shortest paths.',
        example: 'In a road network, edges represent roads, and weights represent distances.',
        whyItMatters: 'Essential for optimization problems like Dijkstra’s algorithm.',
        commonPitfalls: 'Not handling negative weights correctly in algorithms like Dijkstra’s.',
      },
      category: 'Data Structure',
    },
    // X
    {
      id: '47',
      term: 'XML',
      details: {
        definition: 'A markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable.',
        example: 'An XML document: `<person><name>Alice</name><age>25</age></person>`.',
        whyItMatters: 'Used for data exchange in applications like SOAP APIs.',
        commonPitfalls: 'Verbose syntax can lead to larger file sizes compared to JSON.',
      },
      category: 'Data Format',
    },
    {
      id: '48',
      term: 'XPath',
      details: {
        definition: 'A query language for selecting nodes from an XML document.',
        example: 'Using XPath to select a node: `/person/name` retrieves the name element.',
        whyItMatters: 'Useful for parsing and navigating XML data in applications.',
        commonPitfalls: 'Complex XPath expressions can be hard to debug.',
      },
      category: 'Data Format',
    },
    // Y
    {
      id: '49',
      term: 'Yield',
      details: {
        definition: 'A keyword in some programming languages (like Python) used to return values from a generator function one at a time.',
        example: 'In Python: `def numbers(): for i in range(3): yield i` generates 0, 1, 2.',
        whyItMatters: 'Enables memory-efficient iteration over large datasets.',
        commonPitfalls: 'Not understanding generator behavior can lead to unexpected results.',
      },
      category: 'Programming Paradigm',
    },
    {
      id: '50',
      term: 'YAML',
      details: {
        definition: 'A human-readable data serialization format, often used for configuration files.',
        example: 'A YAML file: `name: Alice\nage: 25`.',
        whyItMatters: 'Simplifies configuration management in DevOps tools like Kubernetes.',
        commonPitfalls: 'Indentation errors can lead to parsing failures.',
      },
      category: 'Data Format',
    },
    // Z
    {
      id: '51',
      term: 'Zero-Based Indexing',
      details: {
        definition: 'A system where the first element of a sequence is accessed with an index of 0.',
        example: 'In Python, `list[0]` accesses the first element of a list.',
        whyItMatters: 'Standard in most programming languages for array and list access.',
        commonPitfalls: 'Off-by-one errors when transitioning between languages with different indexing (e.g., Lua uses 1-based).',
      },
      category: 'Programming Concept',
    },
    {
      id: '52',
      term: 'Zip Function',
      details: {
        definition: 'A function that combines multiple iterables into a single iterable of tuples.',
        example: 'In Python: `list(zip([1, 2], ["a", "b"]))` returns `[(1, "a"), (2, "b")]`.',
        whyItMatters: 'Useful for iterating over multiple lists in parallel.',
        commonPitfalls: 'Unequal-length iterables may truncate to the shortest length.',
      },
      category: 'Programming Concept',
    },
  ];

  console.log('Total terms to seed:', glossaryTerms.length);

  // Upsert Glossary Terms
  for (const term of glossaryTerms) {
    console.log(`Seeding term: ${term.term} (ID: ${term.id})`);
    await prisma.glossaryTerm.upsert({
      where: { id: term.id },
      update: {},
      create: term,
    });
  }

  // Set up relationships for relatedConcepts
  // Connect each term to two other terms (for simplicity, connect to the next two terms, wrapping around)
  for (let i = 0; i < glossaryTerms.length; i++) {
    const term = glossaryTerms[i];
    const related1 = glossaryTerms[(i + 1) % glossaryTerms.length]; // Next term
    const related2 = glossaryTerms[(i + 2) % glossaryTerms.length]; // Term after next
    console.log(`Setting relationships for ${term.term} (ID: ${term.id}) to ${related1.term} (ID: ${related1.id}) and ${related2.term} (ID: ${related2.id})`);
    await prisma.glossaryTerm.update({
      where: { id: term.id },
      data: {
        relatedConcepts: {
          connect: [
            { id: related1.id },
            { id: related2.id },
          ],
        },
      },
    });
  }

  console.log('Glossary terms seeded successfully!');
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });