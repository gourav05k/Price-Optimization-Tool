// Demand Forecast Service
class DemandForecastService {
  
  /**
   * Calculate demand forecast for a product based on historical data
   * This is a simplified algorithm - in real world, you'd use ML models
   */
  static calculateDemandForecast(product) {
    const baselineTraffic = 1000; // Base market traffic
    const categoryMultiplier = this.getCategoryMultiplier(product.category);
    const priceImpact = this.getPriceImpact(product.selling_price, product.cost_price);
    const stockInfluence = this.getStockInfluence(product.stock_available);
    const salesMomentum = this.getSalesMomentum(product.units_sold);
    
    // Calculate demand forecast
    const demandForecast = Math.round(
      baselineTraffic * 
      categoryMultiplier * 
      priceImpact * 
      stockInfluence * 
      salesMomentum
    );
    
    return Math.max(100, demandForecast); // Minimum 100 units
  }
  
  /**
   * Generate yearly demand projections for visualization
   */
  static generateYearlyDemandData(product, years = 5) {
    const currentYear = new Date().getFullYear();
    const currentDemand = this.calculateDemandForecast(product);
    const yearlyData = [];
    
    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      
      // Apply growth/decline factors based on category and price trends
      const growthRate = this.getGrowthRate(product.category, i);
      const marketTrend = this.getMarketTrend(product.selling_price, product.cost_price, i);
      
      const demand = Math.round(currentDemand * growthRate * marketTrend);
      
      yearlyData.push({
        year,
        demand: Math.max(50, demand), // Minimum 50 units
        sellingPrice: this.projectPrice(product.selling_price, i)
      });
    }
    
    return yearlyData;
  }
  
  /**
   * Category-based demand multipliers
   */
  static getCategoryMultiplier(category) {
    const multipliers = {
      'Electronics': 2.5,
      'Home Automation': 2.0,
      'Transportation': 1.8,
      'Wearables': 1.6,
      'Outdoor & Sports': 1.4,
      'Stationary': 1.2,
      'Apparel': 1.5,
      'Home & Garden': 1.3,
      'Furniture': 1.1,
      'Books': 0.9
    };
    
    return multipliers[category] || 1.0;
  }
  
  /**
   * Price impact on demand (higher price = lower demand)
   */
  static getPriceImpact(sellingPrice, costPrice) {
    const margin = (sellingPrice - costPrice) / costPrice;
    
    // Higher margins typically mean lower demand
    if (margin < 0.5) return 1.3; // Low margin, high demand
    if (margin < 1.0) return 1.1;
    if (margin < 2.0) return 0.9;
    return 0.7; // High margin, lower demand
  }
  
  /**
   * Stock availability influence
   */
  static getStockInfluence(stockAvailable) {
    if (stockAvailable > 1000) return 1.2;
    if (stockAvailable > 500) return 1.1;
    if (stockAvailable > 100) return 1.0;
    if (stockAvailable > 50) return 0.9;
    return 0.7; // Low stock
  }
  
  /**
   * Sales momentum based on units sold
   */
  static getSalesMomentum(unitsSold) {
    if (unitsSold > 10000) return 1.4;
    if (unitsSold > 1000) return 1.2;
    if (unitsSold > 500) return 1.1;
    if (unitsSold > 100) return 1.0;
    return 0.8; // Low sales
  }
  
  /**
   * Growth rate projection by category and year
   */
  static getGrowthRate(category, yearIndex) {
    const growthRates = {
      'Electronics': [1.0, 1.15, 1.25, 1.30, 1.35],
      'Home Automation': [1.0, 1.20, 1.35, 1.45, 1.55],
      'Transportation': [1.0, 1.10, 1.18, 1.25, 1.30],
      'Wearables': [1.0, 1.12, 1.20, 1.25, 1.28],
      'Outdoor & Sports': [1.0, 1.08, 1.15, 1.20, 1.22],
      'Stationary': [1.0, 0.98, 0.95, 0.92, 0.90],
      'Apparel': [1.0, 1.05, 1.08, 1.10, 1.12],
      'Home & Garden': [1.0, 1.06, 1.10, 1.12, 1.15],
      'Furniture': [1.0, 1.03, 1.05, 1.06, 1.08],
      'Books': [1.0, 0.95, 0.90, 0.87, 0.85]
    };
    
    const rates = growthRates[category] || [1.0, 1.02, 1.04, 1.05, 1.06];
    return rates[yearIndex] || rates[rates.length - 1];
  }
  
  /**
   * Market trend impact on demand
   */
  static getMarketTrend(sellingPrice, costPrice, yearIndex) {
    // Simulate market dynamics
    const baseVariation = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
    const yearTrend = 1 + (yearIndex * 0.02); // Slight upward trend
    
    return baseVariation * yearTrend;
  }
  
  /**
   * Project future prices
   */
  static projectPrice(currentPrice, yearIndex) {
    const inflationRate = 0.03; // 3% annual inflation
    return parseFloat((currentPrice * Math.pow(1 + inflationRate, yearIndex)).toFixed(2));
  }
  
  /**
   * Generate chart data for multiple products
   */
  static generateChartData(selectedProducts) {
    const years = [2024, 2025, 2026, 2027, 2028];
    const colors = [
      'rgb(255, 99, 132)',   // Red
      'rgb(54, 162, 235)',   // Blue  
      'rgb(255, 205, 86)',   // Yellow
      'rgb(75, 192, 192)',   // Green
      'rgb(153, 102, 255)',  // Purple
      'rgb(255, 159, 64)',   // Orange
    ];
    
    const datasets = selectedProducts.map((product, index) => {
      const yearlyData = this.generateYearlyDemandData(product);
      
      return {
        label: product.name,
        data: yearlyData.map(item => item.demand),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20', // 20% opacity
        tension: 0.4,
        fill: false
      };
    });
    
    return {
      labels: years,
      datasets
    };
  }
}

export default DemandForecastService;
