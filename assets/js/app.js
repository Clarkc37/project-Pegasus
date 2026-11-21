// Global Guide Racing — app.js
// Shared utilities and date helpers

/**
 * Format a date as YYYY-MM-DD
 */
function formatDate(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Get date offset by days from today
 */
function getDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return formatDate(date);
}

/**
 * Format odds for display
 */
function formatOdds(odds) {
  if (!odds) return 'N/A';
  return odds;
}

/**
 * Format currency (GBP)
 */
function formatGBP(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.floor(value));
}