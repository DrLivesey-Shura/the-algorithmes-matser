export type Polynomial = number[];

export function parsePolynomial(input: string): Polynomial {
  // Remove spaces and split by '+' or '-'
  const terms = input
    .replace(/\s+/g, "")
    .split(/(?=[-+])/)
    .filter((term) => term !== "");

  const polynomial: Polynomial = new Array(0).fill(0);

  terms.forEach((term) => {
    let coefficient = 1;
    let exponent = 0;

    // Handle coefficient
    if (term.includes("x")) {
      const parts = term.split("x");
      if (parts[0] === "+" || parts[0] === "") {
        coefficient = 1;
      } else if (parts[0] === "-") {
        coefficient = -1;
      } else {
        coefficient = parseFloat(parts[0]);
      }

      // Handle exponent
      if (parts[1]) {
        exponent = parts[1].startsWith("^") ? parseInt(parts[1].slice(1)) : 1;
      } else {
        exponent = 1;
      }
    } else {
      // Constant term
      coefficient = parseFloat(term);
      exponent = 0;
    }

    // Extend polynomial array if needed
    while (polynomial.length <= exponent) {
      polynomial.push(0);
    }

    // Add coefficient to the corresponding exponent
    polynomial[exponent] += coefficient;
  });

  return polynomial;
}

export function addPolynomials(p1: Polynomial, p2: Polynomial): Polynomial {
  const maxLength = Math.max(p1.length, p2.length);
  const result: Polynomial = new Array(maxLength).fill(0);

  for (let i = 0; i < maxLength; i++) {
    result[i] = (p1[i] || 0) + (p2[i] || 0);
  }

  // Trim trailing zeros
  while (result.length > 0 && result[result.length - 1] === 0) {
    result.pop();
  }

  return result;
}

export function multiplyPolynomials(
  p1: Polynomial,
  p2: Polynomial
): Polynomial {
  const result: Polynomial = new Array(p1.length + p2.length - 1).fill(0);

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] += p1[i] * p2[j];
    }
  }

  return result;
}

export function polynomialToString(p: Polynomial): string {
  if (p.length === 0) return "0";

  const terms: string[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    if (p[i] === 0) continue;

    let term = "";
    const coeff = p[i];

    // Handle coefficient sign and value
    if (coeff > 0 && terms.length > 0) term += "+";
    if (coeff === -1 && i > 0) term += "-";
    else if (coeff !== 1 || i === 0) term += coeff.toString();

    // Handle variable and exponent
    if (i > 0) {
      term += "x";
      if (i > 1) term += `^${i}`;
    }

    terms.push(term);
  }

  return terms.length > 0 ? terms.join("") : "0";
}
