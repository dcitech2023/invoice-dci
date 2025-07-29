export function numberToWords(num) {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
      'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
      'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    const helper = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + helper(n % 100) : '');
      if (n < 100000) return helper(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + helper(n % 1000) : '');
      if (n < 10000000) return helper(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + helper(n % 100000) : '');
      return helper(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + helper(n % 10000000) : '');
    };
  
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
  
    let words = helper(integerPart) + ' Rupees';
    if (decimalPart > 0) {
      words += ' and ' + helper(decimalPart) + ' Paise';
    }
    return words + ' Only';
  }
  