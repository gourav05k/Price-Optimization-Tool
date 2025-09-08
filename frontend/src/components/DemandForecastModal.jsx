import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DemandForecastService from '../services/demandForecastService';
import './DemandForecastModal.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DemandForecastModal = ({ isOpen, onClose, selectedProducts }) => {
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedProducts && selectedProducts.length > 0) {
      generateForecastData();
    }
  }, [isOpen, selectedProducts]);

  const generateForecastData = () => {
    setLoading(true);
    try {
      // Generate chart data for visualization
      const chartData = DemandForecastService.generateChartData(selectedProducts);
      setChartData(chartData);

      // Generate table data
      const tableData = selectedProducts.map(product => {
        const yearlyData = DemandForecastService.generateYearlyDemandData(product);
        const demandForecast = DemandForecastService.calculateDemandForecast(product);
        
        return {
          ...product,
          demandForecast,
          yearlyProjections: yearlyData
        };
      });
      setTableData(tableData);
    } catch (error) {
      console.error('Error generating forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    interaction: {
      intersect: false,
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          usePointStyle: true,
          padding: 20
        }
      },
              title: {
          display: true,
          text: 'Demand Forecast by Year',
          color: 'white',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
          color: 'white'
        },
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Projected Demand',
          color: 'white'
        },
        ticks: {
          color: 'white',
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        radius: 5,
        hoverRadius: 8
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="demand-forecast-modal-overlay">
      <div className="demand-forecast-modal">
        <div className="modal-header">
          <h2>Demand Forecast</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

{loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Generating demand forecast...</p>
          </div>
        ) : (
          <>
            {/* Chart Section */}
            <div className="chart-section">
              <div className="chart-container">
                {chartData ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
                    <p>No chart data available</p>
                    <p>Chart data: {chartData ? 'Present' : 'Missing'}</p>
                    <p>Selected products: {selectedProducts?.length || 0}</p>
                  </div>
                )}
              </div>
            </div>

              {/* Table Section */}
              <div className="forecast-table-section">
                <h3>Calculated Demand Forecast</h3>
                <div className="forecast-table-wrapper">
                  <table className="forecast-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Product Category</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Available Stock</th>
                        <th>Units Sold</th>
                        <th>Calculated Demand Forecast</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((product, index) => (
                        <tr key={index}>
                          <td className="product-name">{product.name}</td>
                          <td>{product.category}</td>
                          <td className="price-column">$ {product.cost_price}</td>
                          <td className="price-column">$ {product.selling_price}</td>
                          <td className="stock-column">{product.stock_available?.toLocaleString()}</td>
                          <td className="stock-column">{product.units_sold?.toLocaleString()}</td>
                          <td className="forecast-column">{product.demandForecast.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: 'rgb(75, 192, 192)'}}></span>
                  <span>Product Demand</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: 'rgb(255, 99, 132)'}}></span>
                  <span>Selling Price</span>
                </div>
              </div>
            </>
        )}
      </div>
    </div>
  );
};

export default DemandForecastModal;
