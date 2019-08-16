<template>
<!-- Column -->
<div class="col-xl-12">
  <!-- Card Shadow -->
  <div class="card shadow mb-4">    
    <!-- Card Body -->
    <div class="card-body">                  
                

      <div class="form-group" v-if="form.type === 'string'">
        <div class="d-flex">
          <span class="p-2 flex-fill" v-text="form.name"></span>
          <span v-if="form.dueDate" class="p-2 flex-fill">Due: {{form.dueDate}}</span> 
          <span class="p-2 flex-fill">
            <small class="form-text text-muted pull-right">
              <a class="help-text" v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
                  <i class="fas fa-info-circle"></i>
              </a>
            </small>
          </span>
        </div>
        <alpha-area :mainObj="form" :field="'value'"></alpha-area>
      </div>

      <div class="form-group" v-if="form.type === 'checkbox'">
        <div class="d-flex">
          <span class="p-2 flex-fill" v-text="form.name"></span>
          <span class="p-2 flex-fill"><input type="checkbox" v-model="form.value"></span>
          <span class="p-2 flex-fill" v-if="form.dueDate">Due: {{form.dueDate}}</span> 
          <span class="p-2 flex-fill">
            <small class="form-text text-muted pull-right">
                <a v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
                  <i class="fas fa-info-circle"></i>
                </a>
            </small>  
          </span>
        </div>
      </div>


      <div v-if="form.type === 'yes-no'">
        <div class="d-flex">
          <span class="p-2 flex-fill" v-text="form.name"></span>
          <span class="p-2 flex-fill" v-if="form.dueDate">Due: {{form.dueDate}}</span> 
          <span class="p-2 flex-fill">
            <small class="form-text text-muted pull-right">
                <a v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
                  <i class="fas fa-info-circle"></i>
                </a>
            </small>  
          </span>
        </div> 
        <div class="d-flex">
          <div class="p-2 flex-fill">
            <div class="form-check form-check-inline">
              <input  class="form-check-input" type="radio" value="yes" v-model="form.value">
              <label class="form-check-label">Yes</label>
            </div>
            <div class="form-check form-check-inline">
              <input  class="form-check-input" type="radio" value="no" v-model="form.value">
              <label class="form-check-label">No</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" value="NA" v-model="form.value">
              <label class="form-check-label" > NA</label>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group" v-if="form.type === 'file'">
        <div class="d-flex bd-highlight">
          <span class="p-2 flex-fill bd-highlight" v-text="form.name"></span> 
          <span class="p-2 flex-fill bd-highlight" v-if="form.dueDate">Due: {{form.dueDate}}</span> 
          <small class="form-text text-muted p-2 flex-fill bd-highlight">
            <a class="pull-right" v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
              <i class="fas fa-info-circle"></i>
            </a>
          </small>
        </div>
        <div class="image-el">
          <p>
            <span :class="{'task-link': form.value}" @click="downloadURI(form.value)" v-text="getFileName(form.value)"></span>
          </p> 
          <div v-show="loading">
             <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <file-upload 
          class="btn btn-primary"
          :events="events" 
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.csv" 
          >
          <i class="fas fa-plus"></i>
          </file-upload>
        </div>
      </div>
 
      <div v-if="form.type === 'date'" class="form-group">
        <div class="d-flex bd-highlight">
          <span class="p-2 flex-fill bd-highlight" v-text="form.name"></span> 
          <span class="p-2 flex-fill bd-highlight" v-if="form.dueDate">Due: {{form.dueDate}}</span> 
          <small class="form-text text-muted p-2 flex-fill bd-highlight">
            <a class="pull-right" v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
              <i class="fas fa-info-circle"></i>
            </a>
          </small>
        </div>
        <input class="form-control" :class="`field-${index}-datepicker`" v-model="form.value">
      </div>

      <div v-if="form.type === 'companies'" class="form-group">
        <div class="d-flex bd-highlight">
          <span class="p-2 flex-fill bd-highlight" v-text="form.name"></span> 
          <span class="p-2 flex-fill bd-highlight" v-if="form.dueDate">Due: {{form.dueDate}}</span> 
          <small class="form-text text-muted p-2 flex-fill bd-highlight">
            <a class="pull-right" v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
              <i class="fas fa-info-circle"></i>
            </a>
          </small>
        </div>
        <div>
          <select class="selectpicker select-button form-field-companies" :class="`field-${index}-companies`" multiple data-actions-box="true" data-live-search="true"></select>
        </div>
      </div>

      <div v-if="form.type === 'licenses'" class="form-group">
        <div class="d-flex bd-highlight">
          <span class="p-2 flex-fill bd-highlight" v-text="form.name"></span> 
          <span class="p-2 flex-fill bd-highlight" v-if="form.dueDate">Due: {{form.dueDate}}</span> 
          <small class="form-text text-muted p-2 flex-fill bd-highlight">
            <a class="pull-right" v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
              <i class="fas fa-info-circle"></i>
            </a>
          </small>
        </div>
        <div>
          <select class="selectpicker select-button form-field-licenses" :class="`field-${index}-licenses`" multiple></select>
        </div>
      </div>

      <div v-if="form.type === 'date-range'" class="form-group">
        <div class="d-flex">
          <span class="p-2 flex-fill" v-text="form.name"></span>
          <span class="p-2 flex-fill bd-highlight" v-if="form.dueDate">Due: {{form.dueDate}}</span>
          <span class="p-2 flex-fill">
            <small class="form-text text-muted pull-right">
                <a v-if="form.help" tabindex="0" data-toggle="popover" data-trigger="hover" :data-content="form.help">
                  <i class="fas fa-info-circle"></i>
                </a>
            </small>  
          </span> 
        </div>
        <div class="row">
          <div class="col">
            <label>From</label>
            <input class="form-control" :class="`field-from-${index}-datepicker`" v-model="form.value.from">
          </div>
          <div class="col">
            <label class="mr-2">To/Now <input type="checkbox" v-model="toNow"></label>
            <input class="form-control" :class="`field-to-${index}-datepicker`" v-model="form.value.to">
          </div>
        </div>
      </div>

      <modal v-if="downloadModal" :width="'600px'" @close="downloadModal = false;">
        <h4 slot="header"></h4>
        <div slot="body" >
          <h4>Your download will finish in a moment, please check your downloads folder for a file named '{{downloadName}}'.</h4>
        </div>
        <div slot="footer">
          <button class="btn btn-default btn-sm" @click="downloadModal = false;">OK</button>
        </div>
      </modal>
    

    </div>
    <!-- End Card Body -->
  </div>
  <!-- End Card Shadow -->
</div>
<!-- End Column -->
</template>
<script>
import FileUpload from 'vue-upload-component';
import { dataService } from './dataService.js';
import alphaArea from './alpha-area.vue';
import modal from './Modal.vue';
import axios from 'axios';
import Vuex from "vuex";

export default {
  data() {
    return {
      downloadModal: false,
      toNow: this.form.value.to && this.form.value.to === 'Now' ? true : false,
      loading: false,
      showInfoText: false,
      licenses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      events: {
        add
      }
    }
  },
  methods: {
    downloadURI, getFileName, attachDatepicker, attachCompanies, attachLicenses
  },
  props: {
    form: Object,
    companies: Array,
    index: Number
  },
  watch: {
    'companies': function(nVal) {
      if (nVal && this.form.type === 'companies') {
        this.attachCompanies(nVal, `.field-${this.index}-companies`, this.form.value);
      }
    },
    'toNow': function(nVal) {
      if (nVal && nVal !== 'initial') {
        this.form.value.to = 'Now';
      }
    },
    'form.value.to': function(nVal) {
      if (nVal !== 'Now') this.toNow = false;
    }
  },
  mounted() {
    //initialize pop ups
    $('[data-toggle="popover"]').popover();
    
    if (this.form.type === 'date') {
      this.attachDatepicker(`.field-${this.index}-datepicker`);
    }

    if (this.form.type === 'date-range') {
      if (!this.form.value || typeof this.form.value === 'string' || !this.form.value.from) {
        this.form.value = {'from': '', 'to': ''};
      }

      this.attachDatepicker(`.field-from-${this.index}-datepicker`, 'from');
      this.attachDatepicker(`.field-to-${this.index}-datepicker`, 'to');
    }

    if (this.form.type === 'companies') {
      console.log('this fires');
      if (!this.form.value || typeof this.form.value === 'string') {
        this.form.value = [];
      }
      if (this.companies) {
        console.log('this fires1');
        this.attachCompanies(this.companies, `.field-${this.index}-companies`, this.form.value);
      }
    }

    if (this.form.type === 'licenses') {
      if (!this.form.value || typeof this.form.value === 'string') {
        this.form.value = [];
      }
      this.attachLicenses(this.licenses.map(l => `Type ${l}`), `.field-${this.index}-licenses`, this.form.value);
    }
  },
  components: {
    FileUpload, modal, alphaArea
  },
  computed:{
    ...Vuex.mapState({
        stageurl : 'stageurl'
    }),
  },
}
function attachCompanies(companies, sel, selected) {
  let self = this;
  this.$nextTick(() => {
    if ($(sel).find('option').length < 1) {
      companies.forEach(function(company) {
        $(sel).append('<option value="'+company._id+'">'+company.name+'</option>');
      });
    }
    if (selected) $(sel).val(selected);
    $(sel).selectpicker('refresh').on('change', (ev) => {
      let companiesChosen = [];
      $(ev.target).find("option:selected").each(function(ind, i) {
        companiesChosen.push($(i).val());
      });
      self.form.value = companiesChosen; 
    });
  });
}

function attachLicenses(licenses, sel, selected) {
  let self = this;
  this.$nextTick(() => {
    if ($(sel).find('option').length < 1) {
      licenses.forEach(function(l) {
        $(sel).append(`<option value="${l}">${l}</option>`);
      });
    }
    if (selected) $(sel).val(selected);
    $(sel).selectpicker('refresh').on('change', (ev) => {
      let licensesChosen = [];
      $(ev.target).find("option:selected").each(function(ind, i) {
        licensesChosen.push($(i).val());
      });
      self.form.value = licensesChosen; 
    });
  });
}

function attachDatepicker(el, type) {
  let self = this;
  self.$nextTick(() => {
    $(el).datepicker({dateFormat: 'dd M yy', changeYear: true}).on('change', function (ev) {
      let date = ev.target.value;
      if (!type) {
        self.form.value = date;
      } else {
        self.form.value[type] = date;
      }
    });
  });
}

function getFileName(link) {
  if (!link) {
    return '';
  } else if (link.includes('http')) {
    return link.substring(link.lastIndexOf('/') + 1);
  } else {
    return link;
  }
}

function downloadURI(uri) {
  this.downloadName = this.getFileName(uri);
  this.downloadModal = true;
  if (!uri) return;
  let link = document.createElement("a");
  link.href = uri;
  link.download = this.getFileName(uri);
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function add(file, component) {
  let self = this;
  self.form = new window.FormData();
  for (var key in file.data) {
    if (typeof file.data[key] != 'string') {
      self.form.append(key, JSON.stringify(file.data[key]));
    } else {
      self.form.append(key, file.data[key]);
    }
  }
  self.form.append('file', file.file);
  self.$parent.loading = true;

  axios.post(`${self.stageurl}/subscriptions/upload-html`,
    {
      form : self.form
    }).then(resp => {
    self.$parent.form.value = resp.data;
    self.$parent.loading = false;
    self.$parent.$forceUpdate();
  }, (error)=>  {
      self.$parent.loading = false;
      self.$parent.$parent.msg = 'Error uploading file'
      console.log("Unable to fetch data, give error on page");
  });
}

</script>