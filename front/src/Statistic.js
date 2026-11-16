import { useEffect, useState } from 'react';
import './App.css'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Statistic = (props) => {

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const [statistic, setStatistic] = useState (null)

    useEffect(() => {
        const storageStatistic = localStorage.getItem('statistic')
        if (storageStatistic) {
            const resultStorageStatistic = JSON.parse(storageStatistic)
            const data = [
                {
                    name: 'Победы',
                    value: resultStorageStatistic.win,
                },
                {
                    name: 'Поражения',
                    value: resultStorageStatistic.lose,
                }
            ]
            setStatistic(data)
        }
    }, [])

    return (
        <div>
            <p onClick={() => props.setShow('menu')}>На главную</p>
            {statistic ? <PieChart width={400} height={400}>
            <Pie
                data={statistic}
                cx="50%"
                cy="50%"
                innerRadius={80}   
                outerRadius={120}
                dataKey="value"
                label
            >
                {statistic.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
            </PieChart> : null}
        </div>
    );
};

export default Statistic;