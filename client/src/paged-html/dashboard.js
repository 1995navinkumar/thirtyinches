const { PagedHTML, components, utils } = require("paged-html");

const { Section, Paragraph, TOC } = components;
const { htmlToElement } = utils;

import { dataStore } from "./data-store";

export function generatePDF() {
    var destinationNode = document.querySelector("#pdf-destination");

    var pdf = document.querySelector("#pdf");

    var templates = [
        {
            component: Section, // we are using in-built Section component
            name: "IncomeVersusExpense",
            displayName: "Income vs Expense",
            templates: [{
                component: ChartTemplate, // custom PDF component to render image. See the implementation part below
                chartName: "IncomeVersusExpense"
            }]
        },
        {
            component: Section, // we are using in-built Section component
            name: "ExpenseAndAssetCount",
            displayName: "No.of Assets and Expenses",
            templates: [{
                component: ChartTemplate, // custom PDF component to render image. See the implementation part below
                chartName: "ExpenseAndAssetCount"
            }]
        },
        {
            component: Section, // we are using in-built Section component
            name: "SubscriptionCount",
            threshold: 400,
            displayName: "No.of Subscriptions",
            templates: [{
                component: ChartTemplate, // custom PDF component to render image. See the implementation part below
                chartName: "SubscriptionCount"
            }]
        },
        {
            component: TOC
        }
    ];

    PagedHTML({
        destinationNode,
        templates
    })

    setTimeout(() => {
        printPage(pdf.innerHTML);
        destinationNode.innerHTML = '';
    }, 0);

}

function ChartTemplate(pagedInstance, { chartName, height = "300px", width = "100%" }) {
    var imageSrc = dataStore[chartName];

    var cardElement = htmlToElement(`<div class="card">
            <div class="card-body flex-column flex-justify-center">
                <img src=${imageSrc} style="height : ${height}; width : ${width}"/>
            </div>
            </div>`)

    function init() {

    }

    function* renderer() {
        var pageContent = pagedInstance.getCurrentPage().contentArea;

        pageContent.appendChild(cardElement);

        yield cardElement;
        /* 
          you need to yield elements that has been appended to the page so as to know when overflow is occuring.
        */
    }

    function onOverflow(overflowedImageElement) {
        pagedInstance.insertNewPage();
        var pageContent = pagedInstance.getCurrentPage().contentArea;
        pageContent.appendChild(overflowedImageElement);

        /*
            Hook for handling overflow content. Not needed in this case since we 
            have already handled the case using init hook
        */

    }

    function onEnd() {


    }

    return {
        init,
        renderer,
        onOverflow,
        onEnd
    }
}



function getStyles() {
    var cssLink = document.createElement("link");
    cssLink.href = "css/paged.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    return cssLink;
}

var title = document.title;

function closePrint() {
    document.body.removeChild(this.__container__);
    document.title = title;
}

function setPrint() {
    this.contentWindow.__container__ = this;
    this.contentWindow.onbeforeunload = closePrint;
    this.contentWindow.onafterprint = closePrint;
    this.contentWindow.focus(); // Required for IE
    document.title = "Dashboard";
    this.contentWindow.print();
}

function printPage(htmlString) {
    var oHideFrame = document.createElement("iframe");
    oHideFrame.onload = setPrint;
    oHideFrame.style.position = "fixed";
    oHideFrame.style.right = "0";
    oHideFrame.style.bottom = "0";
    oHideFrame.style.width = "0";
    oHideFrame.style.height = "0";
    oHideFrame.style.border = "0";
    oHideFrame.srcdoc = htmlString;
    document.body.appendChild(oHideFrame);
}