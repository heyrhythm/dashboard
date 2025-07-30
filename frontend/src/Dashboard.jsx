  import React, { useState, useEffect, useMemo } from 'react';
  import { Filter, TrendingUp, Globe, Users, Zap } from 'lucide-react';
  import {ReactTyped} from 'react-typed';

  import {
    Line,
    Bar,
    Pie,
    Scatter
  } from 'react-chartjs-2';
  import { Chart, CategoryScale, LinearScale, PointElement, BarElement, LineElement, ArcElement, Tooltip, Legend as ChartLegend } from 'chart.js';
  import './index.css';

  // === STYLE CONSTANTS ===
  const MAIN_BG = 'linear-gradient(120deg, #fcfcfc 0%, #f5f6fa 100%)';
  const HEADER_COLOR = '#222B39'; // main heading
  const SUBTEXT_COLOR = '#868f9a'; // subheader
  const ACCENT = '#101317'; // dark, for button/text
  const FONT = "'Inter', 'Montserrat', 'Segoe UI', Arial, sans-serif";

  // Chart color palette
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
    '#00ff00', '#ff00ff', '#00ffff', '#ff0000',
    '#3949ab', '#d500f9', '#64dd17', '#ffd600',
    '#ff5252', '#00b8d4', '#a1887f', '#c51162',
    '#4e342e', '#1de9b6', '#607d8b'
  ];

  // Register Chart.js components
  Chart.register(
    CategoryScale, LinearScale, PointElement, BarElement, LineElement, ArcElement, Tooltip, ChartLegend
  );

  const Dashboard = () => {
    const [rawData, setRawData] = useState([]);
    const [filters, setFilters] = useState({
      end_year: 'all', topic: 'all', sector: 'all', region: 'all',
      pestle: 'all', source: 'all', swot: 'all', country: 'all', city: 'all'
    });

    useEffect(() => {
      fetch('/api/data')
        .then(res => res.json())
        .then(data => setRawData(data))
        .catch(console.error);
    }, []);

    const handleFilterChange = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
      setFilters({
        end_year: 'all', topic: 'all', sector: 'all', region: 'all',
        pestle: 'all', source: 'all', swot: 'all', country: 'all', city: 'all'
      });
    };

    const getUniqueValues = field => {
      return [...new Set(rawData.map(item => item[field]).filter(Boolean))].sort();
    };

    const filteredData = useMemo(() => rawData.filter(item => (
      Object.entries(filters).every(([key, value]) => value === 'all' || item[key]?.toString() === value)
    )), [rawData, filters]);

    // 1. Line Chart: Avg Intensity by Start Year
    const intensityByYear = useMemo(() => {
      const grouped = {};
      filteredData.forEach(({ start_year, intensity }) => {
        const year = start_year || 'Unknown';
        if (!grouped[year]) grouped[year] = { year, total: 0, count: 0 };
        grouped[year].total += intensity;
        grouped[year].count += 1;
      });
      return Object.values(grouped).map(({ year, total, count }) => ({
        year,
        avgIntensity: +(total / count).toFixed(1)
      }));
    }, [filteredData]);
    const lineChartData = {
      labels: intensityByYear.map(d => d.year),
      datasets: [
        {
          label: 'Avg Intensity',
          data: intensityByYear.map(d => d.avgIntensity),
          fill: false,
          borderColor: '#3949ab',
          backgroundColor: '#3949ab'
        }
      ],
    };

    // 2. Bar Chart: Region Metrics
    const regionStats = useMemo(() => {
      const grouped = {};
      filteredData.forEach(({ region, intensity, relevance, likelihood }) => {
        if (!grouped[region]) grouped[region] = { intensity: 0, relevance: 0, likelihood: 0, count: 0 };
        grouped[region].intensity += intensity;
        grouped[region].relevance += relevance;
        grouped[region].likelihood += likelihood;
        grouped[region].count += 1;
      });
      return Object.entries(grouped).map(([region, data]) => ({
        region,
        intensity: +(data.intensity / data.count).toFixed(1),
        relevance: +(data.relevance / data.count).toFixed(1),
        likelihood: +(data.likelihood / data.count).toFixed(1)
      }));
    }, [filteredData]);
    const barChartData = {
      labels: regionStats.map(d => d.region),
      datasets: [
        {
          label: 'Intensity',
          data: regionStats.map(d => d.intensity),
          backgroundColor: '#3949ab'
        },
        {
          label: 'Relevance',
          data: regionStats.map(d => d.relevance),
          backgroundColor: '#101317'
        },
        {
          label: 'Likelihood',
          data: regionStats.map(d => d.likelihood),
          backgroundColor: '#ff7300'
        }
      ]
    };

    // 3. Pie Chart: Sector Distribution
    const sectorPie = useMemo(() => {
      const grouped = {};
      filteredData.forEach(({ sector }) => {
        if (sector && sector !== 'null' && sector.trim() !== '') {
          grouped[sector] = (grouped[sector] || 0) + 1;
        }
      });
      return Object.entries(grouped).map(([sector, count]) => ({ sector, count }));
    }, [filteredData]);

    const pieChartData = {
      labels: sectorPie.map(d => d.sector),
      datasets: [{
        data: sectorPie.map(d => d.count),
        backgroundColor: sectorPie.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1
      }]
    };

    // 4. Scatter Plot: Intensity vs Likelihood
    const scatterDataArr = useMemo(() =>
      filteredData
        .filter(({ intensity, likelihood }) => intensity != null && likelihood != null)
        .map(({ intensity, likelihood }) => ({ x: intensity, y: likelihood })),
      [filteredData]
    );
    const scatterChartData = {
      datasets: [
        {
          label: 'Points',
          data: scatterDataArr,
          backgroundColor: '#3949ab'
        }
      ]
    };

    return (
      <div
        className="dashboard-root"
        style={{
          height: '100vh',
          background: MAIN_BG,
          fontFamily: FONT,
          color: HEADER_COLOR
        }}
      >
        {/* Nav Bar */}
        <div
          style={{
            flex: 1,
            justifyContent: 'space-between',
            width: '100%',
            height: '55px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
            borderBottom: '1.5px solid #e6e8ee',
            color: ACCENT,
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '0.03em',
            fontFamily: FONT,
            paddingLeft: '18px',
          }}
        >
          <div>
          <span className='fs-5 text-secondary me-3 fw-medium'> The charts are  </span>
          <ReactTyped
                      className="fs-5 fw-bold text-dark text-start"
                      strings={['Avg Intensity by Start Year – A line chart showing the average intensity for each start year', 'Region Metrics – A bar chart displaying average intensity, relevance, and likelihood by region.', 'Sector Distribution – A pie chart showing the distribution of records by sector.','Intensity vs Likelihood – A scatter plot visualizing the relationship between intensity and likelihood for each record.']}
                      typeSpeed={50}
                      backSpeed={20}
                      backDelay={2000}
                      loop={true}
                      style={{ minWidth: '7.5rem' }}
                    />
                    </div>
                    <div className='text-secondary fw-medium me-3 fs-6'> Made by Indranil Chatterjee</div>
        </div>

        <div style={{ display: 'flex', height: 'calc(100vh - 55px)' }}>
          {/* Sidebar */}
          <aside
            style={{
              minWidth: '320px',
              maxWidth: '340px',
              background: '#fff',
              borderRight: '1.5px solid #e6e8ee',
              padding: '24px 16px',
              fontFamily: FONT,
              color: HEADER_COLOR,
              boxShadow: '0 1px 8px rgba(34,43,57,0.03)'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 12 }}>
              Filter Data
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {[
                ['end_year', 'End Year'],
                ['topic', 'Topic'],
                ['sector', 'Sector'],
                ['region', 'Region'],
                ['pestle', 'PESTLE'],
                ['source', 'Source'],
                // ['swot', 'SWOT'],
                ['country', 'Country'],
                ['city', 'City'],
              ].map(([field, label]) => (
                <div key={field} style={{ marginBottom: 15 }}>
                  <label style={{ fontWeight: 600, fontSize: 15, color: SUBTEXT_COLOR, marginBottom: 2 }}>
                    {label}
                  </label>
                  <select
                    className="form-select"
                    style={{
                      width: '100%',
                      marginTop: 3,
                      fontFamily: FONT,
                      background: '#f6f7fa',
                      border: '1.5px solid #e6e8ee',
                      padding: '7px 10px',
                      fontSize: 15,
                      color: HEADER_COLOR,
                      borderRadius: 4
                    }}
                    value={filters[field]}
                    onChange={e => handleFilterChange(field, e.target.value)}
                  >
                    <option value="all">All {label}</option>
                    {getUniqueValues(field).map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button
              onClick={resetFilters}
              style={{
                background: ACCENT,
                color: '#fff',
                fontWeight: 700,
                fontFamily: FONT,
                border: 'none',
                borderRadius: 6,
                padding: '10px 22px',
                fontSize: 16,
                marginTop: 18,
                boxShadow: '0 2px 6px rgba(16,19,23,0.04)',
                cursor: 'pointer'
              }}
            >Reset All</button>
          </aside>

          {/* Main dashboard area */}
          <main
            style={{
              flex: 1,
              background: 'transparent',
              color: HEADER_COLOR,
              fontFamily: FONT,
              padding: '40px 38px 44px 42px',
              overflowY: 'auto'
            }}
          >
            <section>
              {/* Avg Intensity by Start Year */}
              <ChartJsWrapper title="Avg Intensity by Start Year">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { title: { display: true, text: 'Year', color: SUBTEXT_COLOR, font: { family: FONT, weight: 500 } }},
                      y: { title: { display: true, text: 'Avg Intensity', color: SUBTEXT_COLOR, font: { family: FONT, weight: 500 } }},
                    },
                  }}
                  height={400}
                  width={1000}
                />
              </ChartJsWrapper>

              {/* Region Metrics */}
              <ChartJsWrapper title="Region Metrics">
                <Bar data={barChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'top', labels: { color: SUBTEXT_COLOR, font: { family: FONT } } } },
                      scales: {
                        x: { title: { display: true, text: 'Region', color: SUBTEXT_COLOR, font: { family: FONT, weight: 500 } }},
                        y: { title: { display: true, text: 'Avg Value', color: SUBTEXT_COLOR, font: { family: FONT, weight: 500 } }},
                      },
                    }}
                    height={400}
                    width={1000}
                />
              </ChartJsWrapper>

              {/* Sector Distribution */}
              <ChartJsWrapper title="Sector Distribution">
                <Pie data={pieChartData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'right', labels: { color: SUBTEXT_COLOR, font: { family: FONT } } } }
                }}
                height={400}
                width={1000}
                />
              </ChartJsWrapper>

              {/* Intensity vs Likelihood */}
              <ChartJsWrapper title="Intensity vs Likelihood">
                <Scatter data={scatterChartData} options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { title: { display: true, text: 'Intensity', color: SUBTEXT_COLOR, font: { family: FONT, weight: 500 } }},
                    y: { title: { display: true, text: 'Likelihood', color: SUBTEXT_COLOR, font: { family: FONT, weight: 500 } }}
                  }
                }}
                height={400}
                width={1000}
                />
              </ChartJsWrapper>
            </section>

            {/* Data Table */}
            <section className="mt-5 px-3">
              <h3 className="mb-3" style={{ color: HEADER_COLOR, fontWeight: 700, fontSize: 22, fontFamily: FONT }}>
                Detailed Data View
              </h3>
              <div className="table-responsive">
                <table
                  className="table table-striped table-hover align-middle"
                  style={{ background: '#fff', borderRadius: 10, fontFamily: FONT }}
                >
                  <thead>
                    <tr>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Title</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Country</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Region</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Topic</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Sector</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Intensity</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Likelihood</th>
                      <th style={{ color: HEADER_COLOR, fontWeight: 700 }}>Relevance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 10).map((item, index) => (
                      <tr key={index} style={{ fontWeight: 500, color: ACCENT }}>
                        <td>{item.title}</td>
                        <td>{item.country}</td>
                        <td>{item.region}</td>
                        <td>{item.topic}</td>
                        <td>{item.sector}</td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            background: '#3949ab',
                            color: '#fff',
                            borderRadius: '4px',
                            padding: '2px 10px',
                            fontWeight: 600
                          }}>{item.intensity}</span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            background: '#101317',
                            color: '#fff',
                            borderRadius: '4px',
                            padding: '2px 10px',
                            fontWeight: 600
                          }}>{item.likelihood}</span>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            background: '#ff7300',
                            color: '#fff',
                            borderRadius: '4px',
                            padding: '2px 10px',
                            fontWeight: 600
                          }}>{item.relevance}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length > 10 && (
                  <p style={{
                    textAlign: 'center',
                    color: SUBTEXT_COLOR,
                    marginTop: 16
                  }}>
                    Showing 10 of {filteredData.length} records. Apply filters to refine results.
                  </p>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  };

  // === WRAPPER COMPONENT ===
  const ChartJsWrapper = ({ title, children, style }) => (
    <div
      className="mb-4"
      style={{
        width: 1200,
        background: '#fff',
        borderRadius: 18,
        padding: 22,
        boxShadow: '0 4px 16px rgba(34,43,57,0.06)',
        fontFamily: FONT,
        marginBottom: 36,
        ...style
      }}
    >
      <h3 style={{
        color: HEADER_COLOR,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        fontSize: 24,
        fontFamily: FONT,
        marginBottom: 12
      }}>
        {title}
      </h3>
      <div style={{
        width: '100%',
        height: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {children}
      </div>
    </div>
  );

  export default Dashboard;
