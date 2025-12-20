// ===========================================
// CLIENT/src/components/dashboard/StatisticsChart.jsx
// ===========================================
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

const StatisticsChart = ({ data, type = 'bar' }) => {
    const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#8b5cf6'];

    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(data[0] || {})
                        .filter((key) => key !== 'name')
                        .map((key, index) => (
                            <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                        ))}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (type === 'pie') {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    if (type === 'line') {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(data[0] || {})
                        .filter((key) => key !== 'name')
                        .map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                            />
                        ))}
                </LineChart>
            </ResponsiveContainer>
        );
    }

    return null;
};

export default StatisticsChart;