import { ref, computed } from 'vue'

export function useCurrency() {
  const formatNumber = (amount) => {
    if (!amount) return ''
    
    // Remove any non-numeric characters except decimal point
    const numericValue = amount.toString().replace(/[^\d.]/g, '')
    
    // Handle decimal formatting
    const parts = numericValue.split('.')
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    
    // Return with decimal part if it exists
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
  }

  const parseCurrency = (formattedAmount) => {
    if (!formattedAmount) return ''
    
    // Remove commas and spaces, keep decimal point
    return formattedAmount.toString().replace(/[,\s]/g, '')
  }

  return {
    formatNumber,
    parseCurrency
  }
}