// src/app/page.tsx
import Link from "next/link";
import {
  CodeIcon,
  SearchIcon,
  CalculatorIcon,
  BrainIcon,
  NetworkIcon,
  BarChartIcon,
} from "lucide-react";

const algorithmCategories = [
  {
    name: "Dynamic Programming",
    description:
      "Solve complex problems by breaking them down into simpler subproblems",
    algorithms: [
      {
        name: "Matrix Chain Multiplication",
        path: "/algorithms/dynamic-programming/matrix-chain-multiplication",
      },
      {
        name: "Backtracking",
        path: "/algorithms/dynamic-programming/backtracking",
      },
    ],
    path: "/algorithms/dynamic-programming",
    icon: CalculatorIcon,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "Search Algorithms",
    description: "Efficient techniques for finding optimal paths and solutions",
    algorithms: [
      { name: "A*", path: "/algorithms/search-algorithms/a-star" },
      {
        name: "Best First Search",
        path: "/algorithms/search-algorithms/best-first-search",
      },
      {
        name: "Branch and Bound",
        path: "/algorithms/search-algorithms/branch-and-bound",
      },
    ],
    path: "/algorithms/search-algorithms",
    icon: SearchIcon,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    name: "Optimization Algorithms",
    description: "Advanced strategies for finding the best possible solution",
    algorithms: [
      { name: "Min-Max", path: "/algorithms/optimization-algorithms/min-max" },
      {
        name: "Alpha-Beta Pruning",
        path: "/algorithms/optimization-algorithms/alpha-beta-pruning",
      },
      {
        name: "Genetic Algorithm",
        path: "/algorithms/optimization-algorithms/genetic-algorithm",
      },
      {
        name: "Tabu Search",
        path: "/algorithms/optimization-algorithms/tabu-search",
      },
    ],
    path: "/algorithms/optimization-algorithms",
    icon: BarChartIcon,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    name: "Symbolic Computation",
    description:
      "Manipulate mathematical expressions and perform symbolic calculations",
    algorithms: [
      {
        name: "Polynomial Manipulation in Lisp",
        path: "/algorithms/symbolic-computation/polynomial-manipulation",
      },
    ],
    path: "/algorithms/symbolic-computation",
    icon: NetworkIcon,
    color: "bg-red-50",
    iconColor: "text-red-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Algorithms Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore, Visualize, and Understand Complex Algorithms
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {algorithmCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                className={`
                  ${category.color} 
                  rounded-xl shadow-lg hover:shadow-xl 
                  transform transition-all duration-300 hover:-translate-y-2
                  border border-opacity-10 overflow-hidden
                  flex flex-col
                `}
              >
                <div
                  className={`
                  ${category.iconColor} 
                  w-full p-4 flex justify-center items-center
                  text-5xl bg-opacity-10 bg-white
                `}
                >
                  <IconComponent size={48} strokeWidth={1.5} />
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {category.description}
                  </p>

                  <div className="space-y-2">
                    {category.algorithms.map((algo) => (
                      <Link
                        key={algo.name}
                        href={algo.path}
                        className={`
                          block px-3 py-2 
                          ${category.color} 
                          ${category.iconColor}
                          hover:bg-opacity-50
                          rounded-md 
                          text-sm font-medium
                          transition-colors duration-200
                          border border-transparent 
                          hover:border-opacity-50
                        `}
                      >
                        {algo.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
