// Pricing Optimization Service
import DemandForecastService from './demandForecastService';

class PricingOptimizationService {
  
  /**
   * Calculate optimized price for a product
   * Uses demand elasticity, competition, and market factors
   */
  static calculateOptimizedPrice(product) {
    const currentPrice = parseFloat(product.selling_price);
    const costPrice = parseFloat(product.cost_price);
    const demandForecast = DemandForecastService.calculateDemandForecast(product);
    
    // Base optimization factors
    const competitiveAdjustment = this.getCompetitiveAdjustment(product.category);
    const demandElasticity = this.getDemandElasticity(product.category);
    const marketCondition = this.getMarketCondition(product.category);
    const inventoryPressure = this.getInventoryPressure(product.stock_available, product.units_sold);
    const profitabilityTarget = this.getProfitabilityTarget(costPrice, currentPrice);
    
    // Calculate price elasticity impact
    const elasticityAdjustment = this.calculateElasticityAdjustment(
      currentPrice, 
      costPrice, 
      demandElasticity, 
      demandForecast
    );
    
    // Apply optimization formula
    let optimizedPrice = currentPrice * 
      competitiveAdjustment * 
      marketCondition * 
      inventoryPressure * 
      profitabilityTarget * 
      elasticityAdjustment;
    
    // Ensure minimum margin (cost + 20%)
    const minimumPrice = costPrice * 1.2;
    optimizedPrice = Math.max(optimizedPrice, minimumPrice);
    
    // Round to 2 decimal places
    return parseFloat(optimizedPrice.toFixed(2));
  }
  
  /**
   * Competitive adjustment based on category
   */
  static getCompetitiveAdjustment(category) {
    const adjustments = {
      'Electronics': 0.95,        // Highly competitive, slight price reduction
      'Home Automation': 1.1,     // Premium category, can charge more
      'Transportation': 1.05,     // Moderate competition
      'Wearables': 1.08,         // Fashion/tech premium
      'Outdoor & Sports': 1.02,  // Seasonal pricing opportunity
      'Stationary': 0.98,        // Commodity pricing
      'Apparel': 1.03,           // Brand/fashion value
      'Home & Garden': 1.01,     // Stable category
      'Furniture': 1.06,         // High-value purchases
      'Books': 0.95              // Price-sensitive market
    };
    
    return adjustments[category] || 1.0;
  }
  
  /**
   * Demand elasticity by category
   */
  static getDemandElasticity(category) {
    const elasticity = {
      'Electronics': -1.5,       // High elasticity (luxury)
      'Home Automation': -1.2,   // Moderate elasticity
      'Transportation': -0.8,    // Low elasticity (necessity)
      'Wearables': -1.3,         // High elasticity
      'Outdoor & Sports': -1.1,  // Moderate elasticity
      'Stationary': -0.6,        // Low elasticity (necessity)
      'Apparel': -1.4,           // High elasticity
      'Home & Garden': -0.9,     // Moderate elasticity
      'Furniture': -1.0,         // Moderate elasticity
      'Books': -1.6              // High elasticity
    };
    
    return elasticity[category] || -1.0;
  }
  
  /**
   * Market condition multiplier
   */
  static getMarketCondition(category) {
    // Simulate market conditions (could be fed from external APIs)
    const conditions = {
      'Electronics': 1.05,       // Growing market
      'Home Automation': 1.15,   // Rapidly growing
      'Transportation': 1.08,    // EV growth
      'Wearables': 1.03,        // Mature growth
      'Outdoor & Sports': 1.06,  // Post-pandemic growth
      'Stationary': 0.95,       // Declining market
      'Apparel': 1.02,          // Steady growth
      'Home & Garden': 1.04,    // Growing interest
      'Furniture': 1.01,        // Stable
      'Books': 0.93             // Digital shift
    };
    
    return conditions[category] || 1.0;
  }
  
  /**
   * Inventory pressure adjustment
   */
  static getInventoryPressure(stockAvailable, unitsSold) {
    if (unitsSold === 0) return 0.9; // High stock, no sales - reduce price
    
    const turnoverRatio = stockAvailable / unitsSold;
    
    if (turnoverRatio > 10) return 0.9;   // Overstocked - reduce price
    if (turnoverRatio > 5) return 0.95;   // High stock - slight reduction
    if (turnoverRatio > 2) return 1.0;    // Normal stock
    if (turnoverRatio > 1) return 1.05;   // Low stock - slight increase
    return 1.1;                           // Very low stock - increase price
  }
  
  /**
   * Profitability target adjustment
   */
  static getProfitabilityTarget(costPrice, currentPrice) {
    const currentMargin = (currentPrice - costPrice) / costPrice;
    
    // Target different margins based on current margin
    if (currentMargin < 0.3) return 1.15;    // Low margin - increase significantly
    if (currentMargin < 0.5) return 1.08;    // Below target - increase
    if (currentMargin < 1.0) return 1.02;    // Good margin - slight increase
    if (currentMargin < 2.0) return 1.0;     // High margin - maintain
    return 0.95;                              // Very high margin - slight decrease
  }
  
  /**
   * Calculate elasticity-based price adjustment
   */
  static calculateElasticityAdjustment(currentPrice, costPrice, elasticity, demandForecast) {
    // Higher demand forecast suggests room for price increase
    const demandFactor = Math.min(demandForecast / 1000, 2.0); // Cap at 2x
    
    // Use elasticity to determine price sensitivity
    // More elastic (negative elasticity closer to -2) = more price sensitive
    const elasticityFactor = Math.abs(elasticity);
    
    if (elasticityFactor > 1.4) {
      // High elasticity - be conservative with price increases
      return 0.98 + (demandFactor * 0.02);
    } else if (elasticityFactor > 1.0) {
      // Moderate elasticity
      return 0.97 + (demandFactor * 0.05);
    } else {
      // Low elasticity - can increase prices more aggressively
      return 0.95 + (demandFactor * 0.08);
    }
  }
  
  /**
   * Calculate revenue impact of optimization
   */
  static calculateRevenueImpact(product) {
    const currentPrice = parseFloat(product.selling_price);
    const optimizedPrice = this.calculateOptimizedPrice(product);
    const demandForecast = DemandForecastService.calculateDemandForecast(product);
    
    const currentRevenue = currentPrice * demandForecast;
    const optimizedRevenue = optimizedPrice * demandForecast;
    
    const revenueIncrease = optimizedRevenue - currentRevenue;
    const percentageIncrease = ((optimizedRevenue / currentRevenue) - 1) * 100;
    
    return {
      currentRevenue,
      optimizedRevenue,
      revenueIncrease,
      percentageIncrease: parseFloat(percentageIncrease.toFixed(2))
    };
  }
  
  /**
   * Generate optimization summary for multiple products
   */
  static generateOptimizationSummary(products) {
    let totalCurrentRevenue = 0;
    let totalOptimizedRevenue = 0;
    let optimizedProducts = [];
    
    products.forEach(product => {
      const optimizedPrice = this.calculateOptimizedPrice(product);
      const revenueImpact = this.calculateRevenueImpact(product);
      
      optimizedProducts.push({
        ...product,
        optimizedPrice,
        ...revenueImpact
      });
      
      totalCurrentRevenue += revenueImpact.currentRevenue;
      totalOptimizedRevenue += revenueImpact.optimizedRevenue;
    });
    
    const totalRevenueIncrease = totalOptimizedRevenue - totalCurrentRevenue;
    const totalPercentageIncrease = ((totalOptimizedRevenue / totalCurrentRevenue) - 1) * 100;
    
    return {
      products: optimizedProducts,
      summary: {
        totalCurrentRevenue,
        totalOptimizedRevenue,
        totalRevenueIncrease,
        totalPercentageIncrease: parseFloat(totalPercentageIncrease.toFixed(2)),
        averagePriceIncrease: optimizedProducts.reduce((acc, p) => {
          const increase = ((p.optimizedPrice / p.selling_price) - 1) * 100;
          return acc + increase;
        }, 0) / optimizedProducts.length
      }
    };
  }
  
  /**
   * Get pricing recommendations
   */
  static getPricingRecommendations(product) {
    const currentPrice = parseFloat(product.selling_price);
    const optimizedPrice = this.calculateOptimizedPrice(product);
    const difference = optimizedPrice - currentPrice;
    const percentageChange = ((optimizedPrice / currentPrice) - 1) * 100;
    
    let recommendation = '';
    let priority = 'medium';
    
    if (Math.abs(percentageChange) < 2) {
      recommendation = 'Current pricing is optimal. Consider minor adjustments based on market conditions.';
      priority = 'low';
    } else if (percentageChange > 10) {
      recommendation = 'Significant price increase recommended. Monitor demand response carefully.';
      priority = 'high';
    } else if (percentageChange > 5) {
      recommendation = 'Moderate price increase recommended. Good opportunity for margin improvement.';
      priority = 'high';
    } else if (percentageChange > 2) {
      recommendation = 'Small price increase recommended. Low risk, moderate gain.';
      priority = 'medium';
    } else if (percentageChange < -5) {
      recommendation = 'Consider price reduction to stimulate demand and compete effectively.';
      priority = 'high';
    } else {
      recommendation = 'Minor price adjustment recommended.';
      priority = 'low';
    }
    
    return {
      currentPrice,
      optimizedPrice,
      difference: parseFloat(difference.toFixed(2)),
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      recommendation,
      priority
    };
  }
}

export default PricingOptimizationService;
