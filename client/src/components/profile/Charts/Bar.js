import { Bar } from 'vue-chartjs'

export default {
    extends: Bar,
    props: ['chartData'],
    data(){
        return {
            options: {
                legend: {
                    display: false,
                },
                animation: {
                    duration: 1,
                },
                scales: {
                   yAxes: [{
                       gridLines:{
                           display: true,
                           lineWidth: 2,
                       },
                       ticks: {
                           min: 0,
                           maxTicksLimit: 5,
                           fontSize: '13',
                           fontColor: 'lavender',
                           fontFamily: 'Montserrat',
                      }
                   }],
                   xAxes: [{
                       gridLines:{
                           display: false,
                       },
                       ticks: {
                           fontSize: '14',
                           fontColor: 'lavender',
                           fontFamily: 'Montserrat',
                       }
                    }],
                },
                tooltips: {
                    titleFontFamily: 'Montserrat',
                    titleFontSize: 14,
                    bodyFontSize: 14,
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        }
    },
    watch:{
        chartData(){
            this.chartData.datasets.forEach(val => val.backgroundColor = this.calcColors)
            this.renderChart(this.chartData, this.options);
        }
    },
    mounted() {
        this.chartData.datasets.forEach(val => val.backgroundColor = this.calcColors)
        this.renderChart(this.chartData, this.options);
    },
    methods: {
        calcColors(ctx){
            const index = ctx.dataIndex;
            const relativeVolume = ctx.dataset.data[index] / ctx.dataset.data[0];
            const sample = 0.9;
            return `rgba(6, 165, 27, ${sample * relativeVolume})`
        },
    }
}