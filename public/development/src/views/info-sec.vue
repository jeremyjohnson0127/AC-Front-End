<template>
    <div class="col-xl-9 offset-md-3"  v-if="activeStep.forms">
        <div class="card shadow mb-4">
        <!-- Card Header - Dropdown -->
        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Background & Help</h6>
        </div>
        <!-- Card Body -->
        <div class="card-body" v-if="activeStep.forms">                  
            <span v-text="activeStep.description"></span>
            
        </div>
        </div>
    </div>
</template>

<script>
import Vuex from "vuex";
export default {
    computed:{
        ...Vuex.mapState({
            activeStep: '$activeStep'
        }),
    },
}
</script>

<style>

</style>
