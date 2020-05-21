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
                    duration: 0,
                },
                title: {
                    text: "hi"
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        }
    },
    watch:{
        chartData(){
            this.renderChart(this.chartData, this.options);
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
}