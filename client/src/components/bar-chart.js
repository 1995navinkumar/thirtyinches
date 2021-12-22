import React from 'react';
import { getCardData } from '../utils/api-util';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function IncomeVersusExpense() {
    var [cardData, setCardData] = React.useState(null);

    React.useEffect(() => {
        getCardData("incomeVersusExpense", { noOfMonthsBefore: 6 }).then(setCardData);
    }, []);

    return (
        <React.Fragment>

            <div className='card' style={{ height: "300px", width: "100%" }}>
                <p className='card-title'>Income vs Expense</p>
                <div className='card-body'>
                    {
                        cardData
                            ? <Chart data={cardData} />
                            : null
                    }
                </div>
            </div>


        </React.Fragment>
    );
}

function Chart({ data }) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="month" tickFormatter={(label) => `${months[label]}`} tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />

                <Bar dataKey="Maintenance" stackId="a" fill="#8884d8" />
                <Bar dataKey="Asset Purchase" stackId="a" fill="#0994d8" />
                <Bar dataKey="Wage" stackId="a" fill="#82ca9d" />
                <Bar dataKey="subscriptions" fill="#ffc658" />
            </BarChart>
        </ResponsiveContainer>
    )
}

var months = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
}