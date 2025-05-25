import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import  Navbar  from "../components/landing/Navbar";
import { Timeline } from "../components/ui/timeline";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

const roadmapDetails = [
  {
    id: "1",
    title: "Frontend Development Roadmap",
    description: "Master HTML, CSS, JavaScript, and frameworks like React to build modern web apps.",
    author: { name: "Shreyansh" },
    createdAt: "2025-05-01T00:00:00Z",
    category: "beginner",
    timeline: [
      {
        title: "HTML - 5 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Learn the fundamentals of HTML to structure content on the web.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>HTML tags and attributes</li>
              <li>Semantic HTML5 elements</li>
              <li>Forms and input elements</li>
              <li>Accessibility basics</li>
            </ul>
          </div>
        ),
      },
      {
        title: "CSS - 7 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Style web pages with CSS, including layouts and responsive design.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Selectors and properties</li>
              <li>Flexbox and Grid</li>
              <li>Media queries</li>
              <li>CSS animations</li>
            </ul>
          </div>
        ),
      },
      {
        title: "JavaScript Basics - 10 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Learn core JavaScript concepts for web interactivity.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Variables and data types</li>
              <li>Functions and scope</li>
              <li>Loops and conditionals</li>
              <li>Error handling</li>
            </ul>
          </div>
        ),
      },
      {
        title: "JavaScript Advanced - 10 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Dive into advanced JavaScript for dynamic applications.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>DOM manipulation</li>
              <li>Events and event listeners</li>
              <li>Promises and async/await</li>
              <li>ES6+ features (e.g., arrow functions)</li>
            </ul>
          </div>
        ),
      },
      {
        title: "React Basics - 10 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Start building UIs with React, focusing on components.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>JSX and components</li>
              <li>Props and state</li>
              <li>React hooks (useState, useEffect)</li>
              <li>Conditional rendering</li>
            </ul>
          </div>
        ),
      },
      {
        title: "React Advanced - 10 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Master advanced React concepts for scalable apps.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Routing with React Router</li>
              <li>Context API</li>
              <li>Performance optimization</li>
              <li>API integration</li>
            </ul>
          </div>
        ),
      },
      {
        title: "State Management - 7 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Learn state management tools for complex React apps.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Redux basics</li>
              <li>Redux Toolkit</li>
              <li>Zustand or Recoil</li>
              <li>Managing side effects</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Testing - 5 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Test React applications to ensure reliability.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Unit testing with Jest</li>
              <li>React Testing Library</li>
              <li>Integration testing</li>
              <li>Mocking APIs</li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    id: "2",
    title: "Data Structures & Algorithms",
    description: "Learn arrays, linked lists, trees, and algorithms to ace coding interviews.",
    author: { name: "LeetLabs Team" },
    createdAt: "2025-04-15T00:00:00Z",
    category: "intermediate",
    timeline: [
      {
        title: "Arrays & Strings - 7 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Master array manipulation and string operations.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Array traversal and searching</li>
              <li>Two-pointer techniques</li>
              <li>String manipulation</li>
              <li>Sliding window problems</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Linked Lists - 5 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Understand linked list operations and common problems.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Singly and doubly linked lists</li>
              <li>Reversing a linked list</li>
              <li>Detecting cycles</li>
              <li>Merging lists</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Stacks & Queues - 5 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Learn stack and queue data structures and their applications.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Stack operations (push/pop)</li>
              <li>Queue operations (enqueue/dequeue)</li>
              <li>Monotonic stacks</li>
              <li>Priority queues</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Trees - 7 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Explore binary trees and binary search trees.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Tree traversals (inorder, preorder, postorder)</li>
              <li>Binary Search Trees (BST)</li>
              <li>Balancing trees</li>
              <li>Tree height and diameter</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Graphs - 8 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Understand graph representations and traversal algorithms.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Adjacency lists and matrices</li>
              <li>Depth-First Search (DFS)</li>
              <li>Breadth-First Search (BFS)</li>
              <li>Topological sort</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Dynamic Programming - 10 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Solve problems using dynamic programming techniques.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Memoization</li>
              <li>Tabulation</li>
              <li>Knapsack problems</li>
              <li>Longest common subsequence</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Greedy Algorithms - 6 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Learn greedy approaches for optimization problems.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Activity selection</li>
              <li>Huffman coding</li>
              <li>Minimum spanning tree</li>
              <li>Dijkstra’s algorithm</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Backtracking - 6 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Solve combinatorial problems using backtracking.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>N-Queens problem</li>
              <li>Subset sum</li>
              <li>Permutations and combinations</li>
              <li>Sudoku solver</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Bit Manipulation - 5 Days",
        content: (
          <div>
            <p className="mb-4 text-sm text-neutral-600 satoshi">
              Master bit operations for efficient algorithms.
            </p>
            <ul className="list-disc pl-5 text-sm text-neutral-400 satoshi">
              <li>Bitwise operators</li>
              <li>Bit masking</li>
              <li>Counting set bits</li>
              <li>Bit manipulation tricks</li>
            </ul>
          </div>
        ),
      },
    ],
  },
];

const RoadmapDetailPage = () => {
  const { id } = useParams();
  const roadmap = roadmapDetails.find((r) => r.id === id);

  if (!roadmap) {
    return (
      <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
        <Navbar />
        <div className="container mx-auto px-4 py-12 pt-24 ">
          <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 arp-display">
              Roadmap Under Development
            </h2>
            <p className="text-muted-foreground satoshi">
              The roadmap you’re looking for doesn’t exist. 
              <br />
              Please Check back later
            </p>
            <Button asChild className="mt-4 satoshi">
              <Link to="/roadmaps">Back to Roadmaps</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background text-foreground satoshi")}>
      <Navbar />
      <motion.div
        className="container mx-auto px-4 py-12 pt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold arp-display mb-4">
            {roadmap.title}
          </h1>
          <p className="text-sm md:text-base text-gray-400 mb-6 satoshi max-w-md">
            {roadmap.description}
          </p>
          <div className="flex items-center text-sm text-muted-foreground mb-8 satoshi">
            <span>By {roadmap.author.name}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(roadmap.createdAt), "PPP")}</span>
          </div>
          <div className="h-1 w-full bg-gray-700"></div>
          {/* Timeline */}
          <div className="relative w-full">
            <Timeline data={roadmap.timeline} />
          </div>
          {/* Back Button */}
          <Button asChild variant="outline" className="mt-8 satoshi">
            <Link to="/roadmaps">Back to Roadmaps</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoadmapDetailPage;