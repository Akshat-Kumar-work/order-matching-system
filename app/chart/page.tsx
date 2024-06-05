"use client";

import { useEffect } from "react";
import { getBuyPendingOrders } from "../lib/getBuyPendingOrder";
import { getSellPendingOrders } from "../lib/getSellPendingOrder";
import Chart, { InteractionMode, LinearScale, LogarithmicScale, TimeScale, ChartConfiguration, ScaleType, LinearTickOptions } from "chart.js";


export default function ChartPage() {

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const buyPendingData = await getBuyPendingOrders();
        const sellPendingData = await getSellPendingOrders();
        console.log("sell",sellPendingData)

        //  each order has 'quantity' and 'price'
        const buyQuantities = buyPendingData?.map((order: any) => order.buyQuantity);
        const buyPrices = buyPendingData?.map((order: any) => order.buyPrice);

        const sellQuantities = sellPendingData?.map((order: any) => order.buyQuantity);
        const sellPrices = sellPendingData?.map((order: any) => order.buyPrice);

        // Create labels based on buyQuantities and sellQuantities
        const buyLabels = buyQuantities?.map((quantity: number, index: number) => ` ${index + 1}`)||[];
    
        
        // Merge the labels, avoiding duplicates
        const labels = Array.from(new Set([ ...buyLabels,]));

        const config = {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Buy Quantities",
                backgroundColor: "#3182ce",
                borderColor: "#3182ce",
                data: buyQuantities,
                fill: false,
              },
              {
                label: "Buy Prices",
                backgroundColor: "#63b3ed",
                borderColor: "#63b3ed",
                data: buyPrices,
                fill: false,
              },
              {
                label: "Sell Quantities",
                backgroundColor: "#e53e3e",
                borderColor: "#e53e3e",
                data: sellQuantities,
                fill: false,
              },
              {
                label: "Sell Prices",
                backgroundColor: "#f56565",
                borderColor: "#f56565",
                data: sellPrices,
                fill: false,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "white",
                },
                align: "end",
                position: "bottom",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
              title: {
                display: false,
                text: "Sales Charts",
                color: "white",
              },
            },
            hover: {
              mode: "nearest" as InteractionMode,
              intersect: true,
            },
            // scales: {
            //   x: {
            //     type: 'linear' as ScaleType,
            //     ticks: {
            //       color: "rgba(255,255,255,.7)",
            //     },
            //     display: true,
            //     title: {
            //       display: false,
            //       text: "Orders",
            //       color: "white",
            //     },
            //     grid: {
            //       display: false,
            //       borderDash: [2],
            //       color: "rgba(33, 37, 41, 0.3)",
            //     },
            //   } as LinearScale<LinearTickOptions  & CartesianScaleOptions >,
            //   y: {
            //     type: 'linear' as ScaleType,
            //     ticks: {
            //       color: "rgba(255,255,255,.7)",
            //     },
            //     display: true,
            //     title: {
            //       display: false,
            //       text: "Value",
            //       color: "white",
            //     },
            //     grid: {
            //       borderDash: [3],
            //       color: "rgba(255, 255, 255, 0.15)",
            //     },
            //   } as LinearScale<LinearTickOptions & CartesianScaleOptions>,
            // },
          },
      
        };

        const canvas = document.getElementById("line-chart") as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            new Chart(ctx, config);
          } else {
            console.error("Unable to get 2D context from canvas.");
          }
        } else {
          console.error("Element with id 'line-chart' not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndRenderChart();
  }, []);

  return (
    <>
      <div className=" flex flex-col  min-h-[70%] break-words w-full mb-6 shadow-lg rounded bg-blueGray-700  mt-6">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1  font-semibold text-center text-lg">
                Pending Orders
              </h6>
             
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          
          <div className="relative h-[500px]">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
