import React from 'react';
import { AppContext, HomeContext } from '../context';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getSelectedOrg } from '../redux/user';
import AppHeader from '../components/header';
import Footer from '../components/footer';
import AddOrganisation from '../components/add-organisation';
import { getCardData } from '../utils/api-util';

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

function ShowCards({ selectedOrg, cards }) {
    return (
        <div className='full-height full-width card-container overflow-scroll'>
            <IncomeVersusExpense />
        </div>
    )
}

function IncomeVersusExpense({ orgName }) {
    var [chartData, setChartData] = React.useState();
    React.useEffect(() => {
        getCardData("incomeVersusExpense", { noOfMonthsBefore: 6 }).then(data => {
            var currentMonth = data[data.length - 1].month;

            var totalMonths = data.length;

            var neededMonths = generateMonths(currentMonth + 1, totalMonths);

            var labels = neededMonths.map(m => months[m]).slice(5);


            var datasets = [];

            var wage = data.map(rec => rec.Wage || 0).reverse();
            var income = data.map(rec => rec.subscriptions || 0).reverse();
            var maintenance = data.map(rec => rec.Maintenance || 0).reverse();
            var misc = data.map(rec => rec.Misc || 0).reverse();

            datasets.push({
                label: "Wage",
                data: wage,
                backgroundColor: CHART_COLORS.red,
                stack: "expense"
            });

            datasets.push({
                label: "Maintenance",
                data: maintenance,
                backgroundColor: CHART_COLORS.green,
                stack: "expense"
            });

            datasets.push({
                label: "Misc",
                data: misc,
                backgroundColor: CHART_COLORS.orange,
                stack: "expense"
            });

            datasets.push({
                label: "Subscriptions",
                data: income,
                backgroundColor: CHART_COLORS.blue
            })

            setChartData({
                type: "bar",
                data: {
                    labels,
                    datasets
                }
            })
        });
    }, []);
    return (
        <div>
            {
                chartData
                    ? <Card chartData={chartData} title={"Income vs Expense"} />
                    : "loading"
            }
        </div>
    )

}

function generateMonths(currentMonth, totalMonths) {
    console.log(currentMonth, totalMonths);
    var months = [];
    for (let i = 0; i < totalMonths; i++) {
        currentMonth = currentMonth - 1 == 0 ? 12 : currentMonth - 1;
        months.unshift(currentMonth);
    }
    return months;
}

function Card({ chartData, title }) {
    var chartRef = React.createRef();
    var [chartObj, setChartObj] = React.useState();

    var renderChart = () => {
        var canvas = chartRef.current;
        console.log(chartData);
        var chartInstance = new Chart(canvas, chartData);
        setChartObj(chartInstance);
    }

    React.useEffect(() => {
        renderChart();
    }, [chartData]);

    return (
        <div className='card'>
            <div className='card-title'>
                <p>{title}</p>
            </div>
            <div className='card-body'>
                <canvas ref={chartRef} height={180}>

                </canvas>
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