<template>
    <div class="col-xl-6">      
        <!-- Column -->
        <div class="col-xl-12" v-if="activeStep.forms">
            <!-- Card Shadow -->
            <div class="card shadow mb-4">    
            <!-- Card Body -->
                <div class="card-body">                  
                    <record-links :step="activeStep"></record-links>   
                </div>
            </div>
        </div>

        <div v-for="(form, ind) in activeStep.forms" :key="form._id" :class="`size-${form.size || 'M'}`">
                <form-field v-if="companies" :form="form" :companies="companies" :index="ind"></form-field>
        </div>

    </div>
</template>

<script>
import formField from './form-field.vue';
import recordLinks from './record-links.vue';
import Vuex from "vuex";

export default {
    computed:{
        ...Vuex.mapState({
            stageurl : 'stageurl',activeStep: '$activeStep',companies: '$companies'
        }),
    },
    components: {
        formField, recordLinks
    }
}
</script>

<style>

</style>
