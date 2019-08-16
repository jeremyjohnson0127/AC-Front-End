<template>
  <div v-click-outside="clickOutsideLinks" id="record-links">
    <div class="relative">
        <div class="d-flex flex-row bd-highlight mb-3">
          <div class="p-2 bd-highlight">
            Display Compliance Records 
          </div>
          <div class="ml-auto p-2 bd-highlight">
            <div class="pull-right">
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" 
                id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Add
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" v-for="record in recordTypes" @click="addRecord(record.name)" v-text="record.readableName"></a>
                </div>
              </div>
            </div>
          </div>
        </div>      
      <grid v-if="step.recordLinks" class="grid"
        :data="step.recordLinks"
        @clickCell="cellClick"
        :columns="headers1"
        :rowsPerPage="10">
      </grid>
    </div>

    <modal v-if="recordsModal" @close="recordsModal = false;">
      <h3 slot="header">{{getReadableActiveType()}}</h3>
      <div slot="body" >
        <div class="d-flex justify-content-center">
          <div v-show="!records">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
        <div v-if="records" class="flex">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" 
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span v-text="chosenCompany || '-'"></span>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" v-for="company in companyNames" @click="chosenCompany = company;">{{company}}</a>
            </div>
          </div>
          <div class="form-group mt-3">
            <input type="text" name="searchQuery" class="form-control" placeholder="SEARCH" v-model="searchQuery">
          </div>
        </div>

        <grid v-if="records" class="grid"
          :data="recordsFiltered"
          @clickCell="cellClick"
          :columns="headers"
          :rowsPerPage="10">
        </grid>
      </div>
      <div slot="footer" v-show="records">
        <button class="btn btn-sm btn-success" @click="recordsModal = false;">OK</button>
      </div>
    </modal>


  </div>
</template>
<script>
import ClickOutside from 'vue-click-outside'
import modal from './Modal.vue';
import { dataService } from './dataService.js';
import grid from './Grid.vue';
import axios from 'axios';
import Vuex from "vuex";

export default {
  data() {
    return {
      records: undefined, chosenCompany: 'Select Company', searchQuery: '',
      showRecordsWindow: false,
      recordsModal: false,
      recordTypes: [
        {readableName: 'Constitutionals', name: 'constitutionals'},
        {readableName: 'Resolutions', name: 'resolutions'},
        {readableName: 'Agreements', name: 'agreements'},
        {readableName: 'Business Plans', name: 'businessplans'},
        {readableName: 'Companies Registry Forms', name: 'registryforms'},
        {readableName: 'Registers', name: 'members-directors'},
        {readableName: 'Policies & Procedures', name: 'policies-procedures'},
        {readableName: 'Compliance Plans', name: 'compliance-plans'},
        {readableName: 'Compliance Reviews', name: 'compliance-reviews'},
        {readableName: 'Compliance Records', name: 'compliance-records'},
        {readableName: 'SFC Correspondences', name: 'correspondences'},
      ],
      headers: [
        {
          title: 'Name',
          path: 'name'
        },{
          title: 'Company Name',
          path: 'companyname'
        }, {
          title: 'Date',
          path: 'date'
        },
        {
          title: 'Note',
          path: 'note'
        }, {
          title: 'Image',
          type: 'link',
          path: 'image'
        },
        {
          title: 'Added',
          path: 'added',
          bool: true
        },
        {title: 'Actions',actions: [{name: 'Add', class: 'text-success', show: 'showAdd'},{name: 'Remove', class: 'text-danger', show: 'showRemove'}]}
      ],
      headers1: [
        {
          title: 'Type',
          path: 'readableType'
        },{
          title: 'Name',
          path: 'name'
        }, {
          title: 'Date',
          path: 'date'
        }, {
          title: 'Image',
          type: 'link',
          path: 'image'
        },
        {
          title: 'Note',
          path: 'note'
        },
        {title: 'Actions',actions: [{name: 'Remove', class: 'text-danger'}]}
      ]
    }
  },
  methods: {
    addRecord, clickOutsideLinks, getReadableActiveType, cellClick,
    'Add': addItem,
    'Remove': removeItem,
    'download': download
  },
  props: {
    step: Object
  },
  computed: {
    recordsFiltered: function() {
      let r = this.records;
      if (this.searchQuery) {
        r = r.filter(r => r.name.toLowerCase().includes(this.searchQuery) || r.companyname.toLowerCase().includes(this.searchQuery));
      }
      if (this.chosenCompany && this.chosenCompany !== 'Select Company') {
        r = r.filter(r => r.companyname === this.chosenCompany);
      }

      return r;
    },
    ...Vuex.mapState({
            stageurl : 'stageurl'
    }),
  },
  components: {
    modal, grid
  },
  directives: {
    ClickOutside
  }
}

function download() {
  return;
}

function removeItem(id) {
  let self = this;
  self.step.recordLinks.splice(self.step.recordLinks.map(s => s._id).indexOf(id), 1);
  let itemToAdd = self.records.find(r => r._id === id);
  itemToAdd.added = !itemToAdd.added;
  itemToAdd.showAdd = !itemToAdd.added;
  itemToAdd.showRemove = itemToAdd.added;
}
function cellClick(id, action) {
  if (!id) return;
  this[action](id);
}

function addItem(id) {
  let itemToAdd = this.records.find(r => r._id === id);
  itemToAdd.added = !itemToAdd.added;
  itemToAdd.showAdd = !itemToAdd.added;
  itemToAdd.showRemove = itemToAdd.added;
  let i = {'type': this.activeType, 'readableType': this.getReadableActiveType(this.activeType), 'name': itemToAdd.name, '_id': itemToAdd._id, 'date': itemToAdd.date, note: itemToAdd.note, 'image': itemToAdd.image};
  if (this.step.hasOwnProperty('recordLinks')) {
    this.step.recordLinks.push(i);
  } else {
    this.$set(this.step, 'recordLinks', [i]);
  }
}

function getReadableActiveType() {
  return this.recordTypes.find(r => r.name === this.activeType).readableName;
}

function clickOutsideLinks() {
  this.$nextTick(() => {
    this.showRecordsWindow = false;
  });
}

function addRecord(type) {
  this.activeType = type;
  this.records = undefined;
  this.recordsModal = true;
  this.showRecordsWindow = false;
  if (!this.step.recordLinks) this.$set(this.step, 'recordLinks', []);
  axios.get(`${this.stageurl}/${type}`).then(
    resp => {
        resp.data.content = resp.data.content.filter(r => r.company);
        resp.data.content.forEach(r => {
          r.added = this.step.recordLinks.map(l => l._id).includes(r._id);
          r.companyname = r.company.name;
          r.showAdd = !r.added;
          r.showRemove = r.added;
        });
        this.records = resp.data.content;
        this.companyNames = this.records.map(r => r.companyname).filter((c, ind, arr) => arr.indexOf(c) === ind).sort((a, b) => a.localeCompare(b));
  }, (error)=>  {
      console.log("Unable to fetch data, give error on page");
  });

}

</script>
<style type="text/css">
  #record-links .forms-window {
    top: 20px;
    left: 30px;
    right: unset;
  }
</style>