import React from 'react';
import ProductTable from './ProductTable';
import './PricingTable.css';

const PricingTable = ({ 
  searchTerm, 
  selectedCategory, 
  onSearchChange, 
  onCategoryChange, 
  categories, 
  onCategoriesUpdate,
  withDemandForecast = false,
  onDemandForecastToggle,
  demandForecastTrigger
}) => {

  return (
    <div className="pricing-table-container">
      <ProductTable
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        categories={categories}
        onCategoriesUpdate={onCategoriesUpdate}
        showDemandForecast={withDemandForecast}
        showOptimizedPrice={true}
        showActions={false}
        showCheckboxes={false}
        onDemandForecastToggle={onDemandForecastToggle}
        demandForecastTrigger={demandForecastTrigger}
      />
    </div>
  );
};

export default PricingTable;
