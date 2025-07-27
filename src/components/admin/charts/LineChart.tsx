import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface LineChartProps {
  title: string;
  data: LineChartData[];
  dataKey?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  strokeWidth?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  dataKey = 'value',
  color = '#3B82F6',
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  showDots = true,
  strokeWidth = 2,
  xAxisLabel,
  yAxisLabel
}) => {
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((item, index: number) => (
            <p key={index} className="text-sm text-gray-600">
              {item.name || yAxisLabel || '값'}: 
              <span className="font-medium ml-1" style={{ color: item.color }}>
                {item.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: { cx?: number; cy?: number; payload?: { value: number } }) => {
    const { cx, cy, payload } = props;
    if (payload && payload.value > 0) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill={color}
          stroke="#fff"
          strokeWidth={2}
          className="hover:r-6 transition-all"
        />
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                📈
              </div>
              <p>표시할 데이터가 없습니다</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 트렌드 계산 (증가/감소/동일)
  const getTrend = () => {
    if (data.length < 2) return null;
    const firstValue = data[0][dataKey];
    const lastValue = data[data.length - 1][dataKey];
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (change > 5) return { type: 'increase', value: change };
    if (change < -5) return { type: 'decrease', value: Math.abs(change) };
    return { type: 'stable', value: change };
  };

  const trend = getTrend();

  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'increase': return '📈';
      case 'decrease': return '📉';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  const getTrendColor = (type: string) => {
    switch (type) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor(trend.type)}`}>
              <span>{getTrendIcon(trend.type)}</span>
              <span>
                {trend.type === 'increase' ? '+' : trend.type === 'decrease' ? '-' : ''}
                {trend.value.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            )}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={{ stroke: '#E5E7EB' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color}
              strokeWidth={strokeWidth}
              dot={showDots ? <CustomDot /> : false}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
              className="drop-shadow-sm"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
        
        {/* 추가 정보 */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            {xAxisLabel && (
              <span>📅 {xAxisLabel}</span>
            )}
          </div>
          <div className="text-right">
            <span>
              평균: {(data.reduce((sum, item) => sum + (item[dataKey] || 0), 0) / data.length).toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;