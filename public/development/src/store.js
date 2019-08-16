import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stageurl: "https://staging.compliancedepartment.online/",
    $projectTemplates: [],
    $activeProject: [],
    $activeStep: [],
    $companies: []
  },
  mutations: {
    // commited from loaddata
    SET_DATA(state, response) {
      state.$projectTemplates = response;
    },
    SET_ACTIVE(state, response) {
      state.$activeProject = response;
    },
    SET_STEPS(state, response) {
      state.$activeStep = response;
    },
    SET_COMPANIES(state, response) {
      state.$companies = response;
    }
  },
  actions: {
    // dispatched from home vue mount()
    loaddata({ commit, state }) {
      axios.get(`${state.stageurl}/tasks/publish`).then(
        response => {
          if (response.data != undefined) {
            commit("SET_DATA", response.data);
            commit("SET_ACTIVE", response.data[0].project);
          }
          console.log("response", response);
      }, (error)=>  {
          console.log("Unable to fetch data, give error on page");
      });
      axios.get(`${state.stageurl}/companies`).then(
        response => {
          if (response.data != undefined) {
            commit("SET_COMPANIES", response.data);
          }
          console.log("Companies response", response);
      }, (error)=>  {
          console.log("Unable to fetch data, give error on page");
      });
    },
    updateSteps({ commit }, step) {
      commit("SET_STEPS", step);
    }
  }
});
