// alpha-beta-pruning.ts
export interface TreeNode {
  value?: number;
  children?: TreeNode[];
}

export function alphaBetaPruning(
  node: TreeNode,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): number {
  // Base case: if depth is 0 or node is a leaf
  if (depth === 0 || !node.children || node.children.length === 0) {
    return node.value ?? 0;
  }

  if (maximizingPlayer) {
    let maxEval = Number.NEGATIVE_INFINITY;
    for (const child of node.children) {
      const childEval = alphaBetaPruning(child, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, childEval);
      alpha = Math.max(alpha, childEval);

      // Pruning condition
      if (beta <= alpha) {
        break; // Beta cut-off
      }
    }
    return maxEval;
  } else {
    let minEval = Number.POSITIVE_INFINITY;
    for (const child of node.children) {
      const childEval = alphaBetaPruning(child, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, childEval);
      beta = Math.min(beta, childEval);

      // Pruning condition
      if (beta <= alpha) {
        break; // Alpha cut-off
      }
    }
    return minEval;
  }
}

// Function to parse user input into a tree structure
export function parseTreeInput(input: string): TreeNode | null {
  try {
    // Parse the input JSON string into a TreeNode
    const parsedTree = JSON.parse(input);

    // Basic validation
    if (!isValidTreeNode(parsedTree)) {
      throw new Error("Invalid tree structure");
    }

    return parsedTree;
  } catch (error) {
    console.error("Error parsing input:", error);
    return null;
  }
}

// Recursive validation function for tree structure
function isValidTreeNode(node: any): boolean {
  // If node is a leaf (has value)
  if (node.value !== undefined) {
    return typeof node.value === "number";
  }

  // If node has children
  if (node.children) {
    // Must be an array
    if (!Array.isArray(node.children)) {
      return false;
    }

    // Validate each child recursively
    return node.children.every(isValidTreeNode);
  }

  return false;
}
