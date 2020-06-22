function asFraction(n) {
  switch (n % 1) {
    case 0.25:
      return `${Math.floor(n)}¼`;
    case 0.5:
      return `${Math.floor(n)}½`;
    case 0.75:
      return `${Math.floor(n)}¾`;
    default:
      return n.toString();
  }
}

export default asFraction;
