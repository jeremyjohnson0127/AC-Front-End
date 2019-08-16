<template>
    <div class="col-xl-3">
        <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div v-if="activeProject.name" class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary" v-text="activeProject.name">Procedures</h6>
        </div>
        <!-- Card Body -->
        <div class="card-body">
            <div v-show="!activeProject.steps">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>                
            </div>
            <div v-if="activeProject.steps != undefined">
                <chart-tree v-bind:key="activeProject._id" v-bind:treenodes="activeProject.steps" v-bind:selectident="'tree-container'"></chart-tree>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import Vuex from "vuex";
// import processList from './process-list.vue';
import chartTree from './chart-tree';

export default {
    mounted(){ 
        
    },
    computed:{
        ...Vuex.mapState({
            stageurl : 'stageurl',activeProject: '$activeProject'
        }),
    },
    components: {
        chartTree
    }

}
</script>

<style>

</style>
