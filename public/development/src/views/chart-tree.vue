<template>
    <div>
        <GChart
            type="OrgChart"
            :settings="{ packages: ['orgchart'] }"
            :options="chartOptions"    
            :events="chartEvents"    
            @ready="onChartReady" 
            :data="chartData"
        />
    </div>
</template>

<script>
import Vuex from "vuex";
import { GChart } from 'vue-google-charts'
export default {
    props : ['treenodes','selectident'],
    data() {
        return {
            treedata : [],
            chartData : [],
            chartOptions: {
                allowHtml : true,
                // allowCollapse : true,
                nodeClass : "w-auto p-3 bg-gradient-info rounded",
                selectedNodeClass : "bg-gradient-warning",
                size : "large",
            },     
            chartEvents: {
                'select': () => {
                    this.updateSteps();
                },
                'onmouseover' : (row) =>{
                    this.updateSelect(row);
                },
            },
            selectedNode : 0  
        }
    },
    components: {
        GChart
    },
    mounted(){
        this.treedata = this.subTreeChildren;
    },
    computed:{
        subTreeChildren(){
            let steps = this.treenodes;
            let all = [];  
            let unfilteredarr =  steps;
            unfilteredarr.forEach(function(item,index) { // prepare tree to assign parent
                let parentid = "";
                if(index>0){
                    parentid = unfilteredarr[index-1]._id
                }
                let childinfo = [ { v:item._id, f:item.name }, parentid, item.name ];
                all.push(childinfo);                    
            });
            return all;
        }
    },
    methods: {
        updateSteps(){
            let $this = this;
            if($this.selectident == 'tree-container'){
                $this.$store.dispatch('updateSteps',$this.treenodes[$this.selectedNode]);
            }
        },
        updateSelect(val){
            this.selectedNode = val.row;
        },
        onChartReady(){
           let $this = this;
           var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('string', 'Parent');
            data.addColumn('string', 'ToolTip');
            // For each orgchart box, provide the name, parent, and tooltip to show.
            data.addRows($this.treedata);
            $this.chartData = data;
        }
    }

}
</script>

<style>
  
</style>
