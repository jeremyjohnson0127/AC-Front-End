<template>
    <div class="col-xl-3" v-if="activeStep.forms">
        <div class="card shadow mb-4">
            <!-- Card Header  -->
            <div v-if="activeStep.name" class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary" v-text="activeStep.name"></h6>
            </div>
            <!-- Card Body -->
            <div class="card-body" v-if="activeStep.forms">                 
                <div v-if="activeStep.forms != undefined && activeStep.forms.length>0">
                    <!-- <process-list v-bind:key="activeStep._id" v-bind:treenodes="activeStep.forms" v-bind:selectident="'tree-container2'"></process-list> -->
                    <chart-tree v-bind:key="activeStep._id" v-bind:treenodes="activeStep.forms" v-bind:selectident="'tree-container2'"></chart-tree>
                </div>
                <div class="mt-4" v-else>
                   <span class="alert alert-warning">No steps here</span>
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
    computed:{
        ...Vuex.mapState({
            activeStep: '$activeStep'
        }),
    },
    methods:{

    },
    components: {
        chartTree
    }
}
</script>

<style>

</style>
