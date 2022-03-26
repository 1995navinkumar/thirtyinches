import React from 'react';
import { AppContext, HomeContext } from '../context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getSelectedOrg } from '../redux/user';
import AppHeader from '../components/header';
import Footer from '../components/footer';
import AddOrganisation from '../components/add-organisation';
import { getCardData } from '../utils/api-util';
import Loader from '../components/loader';

var Styles = styled.div`
    .card-container {
        padding : 16px;
    }

    .card {
        background : #FFFFFF;
        border-radius : 8px;
        display : flex;
        flex-direction : column;
        padding : 10px;
        margin-bottom : 16px;
    }

    .card-title {
        font-weight : bold;
        padding : 8px;
    }

    .card-body {
        width : 100%;
        min-height : 240px;
        flex : 1;
        padding : 8px;
        background: var(--background-color);
    }
`

export default function Dashboard() {
    var { getState } = React.useContext(AppContext);
    var selectedOrg = getSelectedOrg(getState());

    return (
        <Styles className="full-height flex-column">
            <AppHeader title={"Dashboard"} />
            <div className="flex-1 hide-scroll">
                {
                    selectedOrg
                        ? <ShowCards selectedOrg={selectedOrg} />
                        : <AddOrganisation />
                }
            </div>
            <Footer selectedRoute='dashboard' />
        </Styles>
    )
}

function ShowCards({ selectedOrg }) {
    return (
        <div className='full-height full-width card-container overflow-scroll'>
            <IncomeVersusExpense orgName={selectedOrg} />
            <SubscriptionCount orgName={selectedOrg} />
            <ExpenseAndAssetCount orgName={selectedOrg} />
        </div>
    )
}



function ExpenseAndAssetCount({ orgName }) {
    var [chartData, setChartData] = React.useState();
    var [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);

        getCardData(orgName, "expenseAndAssetCount", { noOfMonthsBefore: 6 }).then(data => {
            var labels = data.map(d => `${months[d.month]} ${d.year}`);
            var datasets = [];

            // labels = labels.slice(0, 5);

            datasets.push({
                label: "Expense",
                data: data.map(d => d.expenseCount || 0),
                borderColor: CHART_COLORS.red,
                backgroundColor: CHART_COLORS.red
            });

            datasets.push({
                label: "Assets",
                data: data.map(d => d.assetCount || 0),
                borderColor: CHART_COLORS.green,
                backgroundColor: CHART_COLORS.green
            });

            setChartData({
                type: "line",
                data: {
                    labels,
                    datasets
                },
                options: {
                    scales: {
                        y: {
                            grace: "10%"
                        }
                    }
                }
            })
            setLoading(false);

        });
    }, [orgName]);

    return (
        <div>
            <Card loading={loading} chartData={chartData} title={"No.of Assets and Expenses"} />
        </div>
    )
}


function SubscriptionCount({ orgName }) {
    var [chartData, setChartData] = React.useState();
    var [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setLoading(true);
        getCardData(orgName, "subscriptionCount", { noOfMonthsBefore: 6 }).then(data => {
            var labels = data.map(d => `${months[d.month]} ${d.year}`);
            var datasets = [];

            // labels = labels.slice(0, 5);

            datasets.push({
                label: "Subscriptions",
                data: data.map(d => d.subscriptions || 0),
                backgroundColor: CHART_COLORS.blue,
                borderColor: CHART_COLORS.blue
            })

            setChartData({
                type: "line",
                data: {
                    labels,
                    datasets
                },
                options: {
                    scales: {
                        y: {
                            grace: "10%"
                        }
                    }
                }
            })
            setLoading(false);
        });
    }, [orgName]);
    return (
        <div>
            <Card loading={loading} chartData={chartData} title={"No.of Subscriptions"} />
        </div>
    )
}

function IncomeVersusExpense({ orgName }) {
    var [chartData, setChartData] = React.useState();
    var [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);

        getCardData(orgName, "incomeVersusExpense", { noOfMonthsBefore: 6 }).then(data => {
            var labels = data.map(d => `${months[d.month]} ${d.year}`);
            var datasets = [];

            // labels = labels.slice(0, 5);

            var dataSet = data.reduce((a, rec) => {
                a.wage.push(rec.Wage || 0);
                a.income.push(rec.subscriptions || 0);
                a.maintenance.push(rec.Maintenance || 0);
                a.misc.push(rec.Misc || 0);
                return a;
            }, {
                wage: [],
                income: [],
                maintenance: [],
                misc: []
            });

            datasets.push({
                label: "Wage",
                data: dataSet.wage,
                backgroundColor: CHART_COLORS.red,
                stack: "expense"
            });

            datasets.push({
                label: "Maintenance",
                data: dataSet.maintenance,
                backgroundColor: CHART_COLORS.green,
                stack: "expense"
            });

            datasets.push({
                label: "Misc",
                data: dataSet.misc,
                backgroundColor: CHART_COLORS.orange,
                stack: "expense"
            });

            datasets.push({
                label: "Subscriptions",
                data: dataSet.income,
                backgroundColor: CHART_COLORS.blue
            })

            setChartData({
                type: "bar",
                data: {
                    labels,
                    datasets
                }
            })
            setLoading(false);

        });
    }, [orgName]);
    return (
        <div>
            <Card loading={loading} chartData={chartData} title={"Income vs Expense"} />
        </div>
    )

}

function Card({ chartData, title, loading }) {
    var chartRef = React.createRef();

    var renderChart = () => {
        var canvas = chartRef.current;
        new Chart(canvas, chartData);
    }

    React.useEffect(() => {
        if (!loading) {
            renderChart();
        }
    }, [chartData, loading]);

    return (
        <div className='card'>
            <div className='card-title'>
                <p>{title}</p>
            </div>
            <div className='card-body flex-column flex-justify-center'>
                {
                    loading
                        ? <Loader />
                        : <canvas ref={chartRef} height={200}> </canvas>
                }

            </div>
        </div>
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

const COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

export function color(index) {
    return COLORS[index % COLORS.length];
}

export const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};