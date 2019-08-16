<template>
    <div id="list-container">
        <div v-bind:id="selectident"></div>
    </div>
</template>

<script>  
import * as d3 from "d3";
import * as subProcedures from './expand-tree.js';

export default {
    props : ['treenodes','selectident'],
    data() {
        return {
            treedata : [],
        }
    },
    methods:{
        loadTree(){
            let $this = this;   
            if($this.selectident == 'tree-container'){
                $this.treedata = subProcedures.flatToHierarchy( $this.subTreeChildren($this.treenodes) );
                subProcedures.expandTree(d3,$this.treedata,$this.selectident,$this.updateSub,$this.treenodes.length );               
            }else{
                $this.treedata = subProcedures.flatToHierarchy( $this.formTreeChildren($this.treenodes) );
                subProcedures.expandTree(d3,$this.treedata,$this.selectident,$this.updateSub,$this.treenodes.length);               
            }            
        },
        updateSub(step){
            let $this = this;  
            if($this.selectident == 'tree-container'){
                $this.$store.dispatch('updateSteps',step);
            }
        },
        subTreeChildren(steps){
            let all = [];  
            let unfilteredarr =  steps;
            unfilteredarr.forEach(function(item,index) { // prepare tree to assign parent
                let parentid = 0;
                if(index>0){
                    parentid = unfilteredarr[index-1]._id
                }
                let childinfo = { nodeName:item.name,name:item.name,_id:item._id,parentid:parentid,forms:item.forms,description:item.description };
                all.push(childinfo);                    
            });
            return all;
        },
        formTreeChildren(form){
            let all = [];  
            let unfilteredarr =  form;
            unfilteredarr.forEach(function(item,index) { // prepare tree to assign parent
                let parentid = 0;
                if(index>0){
                    parentid = unfilteredarr[index-1]._id
                }
                let childinfo = { nodeName:item.name,name:item.name,_id:item._id,parentid:parentid,all:item };
                all.push(childinfo);                    
            });
            return all;
        },
    
    },
    mounted(){
        this.loadTree();
    },
    components:{
        
    },
    updated(){
        
    },
}     
</script>

<style>

</style>
