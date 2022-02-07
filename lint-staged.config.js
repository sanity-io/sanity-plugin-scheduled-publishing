module.exports = {
  '**/*.{js,jsx}': ['npm run lint'],
  '**/*.{ts,tsx}': ['npm run lint', () => 'tsc --noEmit'],
}
