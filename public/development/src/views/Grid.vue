<template>
  <div class="table-responsive">
  <table class="table table-hover alpha-table">
    <thead>
      <tr>
        <th v-if="customSelection"><div @click="addCustomSelection('all')">Select All</div></th>
        <th v-for="key in columns">
          <div v-if="!key.labelAction" @click="sortBy(key.path)">
            <span v-if="!key.help">{{ key.title }}</span>
            <span v-if="key.help" v-help="key.help">{{ key.title }}</span>
            </span>
          </div>
          <div class="action-button" v-else @click="cellEvent(key, key.labelAction, limitedData)">
            <span v-if="!key.help">{{ key.title }}</span>
            <span v-if="key.help" v-help="key.help">{{ key.title }}</span>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, ind) in limitedData" v-if="hasValues(entry)" @click="rowEvent(entry, ind)" class="grid-row" :class="{'highlighted': rowHighlighted === ind}">
        <td v-if="customSelection" >
          <div><input @click.stop="addCustomSelection(entry)" type="checkbox" style="font-size:20px;" :checked="selectedTasks.includes(entry._id)"></div>
        </td>
        <td v-for="key in columns" :class="[key.addClass]" class="grid-cell">
          <template v-if="key.title === 'Action' || key.title === 'Actions' || key.title === '操作'">
            <p v-if="key.title === 'Actions' || key.title === '操作'" class="action-button"  style="margin-right: 5px;" v-for="action in key.actions" @click.stop="cellEvent(entry._id || entry, action.name)" v-show="!action.show || entry[action.show]" :class="action.class" v-text="entry.ratification && entry.ratification.status ? 'unratify' : action.name"></p>

            <p class="action-button text-danger" v-if="key.actions.indexOf('remove') >= 0" @click.stop="cellEvent(entry._id || ind, 'remove')">Delete</p>
            <p class="action-button text-primary" v-if="key.actions.indexOf('view') >= 0" @click.stop="cellEvent(entry._id || ind, 'view')">View</p>
            <p class="action-button text-success" v-if="key.actions.indexOf('ratify') >= 0" @click.stop="cellEvent(entry._id, 'ratify')" v-text="entry.ratification && entry.ratification.status ? 'Unratify' : 'Ratify'"></p>
            <a v-if="key.actions.indexOf('download') >= 0" v-bind:href="entry.link" download>Download</a>
            <p class="action-button text-success" v-if="key.actions.indexOf('send') >= 0" @click.stop="cellEvent(entry._id, 'send')">Send</p>
          </template>
          <template v-else>
            <div v-if="key.type === 'html-content'">
              <p v-html="entry[key.path]"></p>
            </div>
            <div v-else-if="key.type === 'dropdown'">
              <div class="dropdown company-dropdown select-button" v-if="checkDisabled(entry, key.disabled)">
                <button class="dropdown-toggle form-control input-sm user-input dropdown-button" type="button" data-toggle="dropdown">
                <p class="dropdowns" v-text="cellText(entry, key.path) || '-'"></p></button>
                <ul class="dropdown-menu">
                <li><a style="cursor: pointer;" v-for="li in key.list" v-on:click="selectDropdownItem(li, entry, key)">{{li}}</a></li>
                </ul>
              </div>
              <span v-else class="disabled">Disabled</span>
            </div>
            <div v-else-if="key.type === 'other'" style="position: relative;">
              <span class="glyphicon glyphicon-option-horizontal other-options" @click.stop="openOptions(ind)"></span>

              <div class="other-options-dropdown" v-if="showOptions === ind" v-click-outside="clickOutside">
                <ul class="alpha-ul">
                  <li v-for="li in key.actions"><div v-if="checkDisabled(entry, li)" :class="li.class || ''" @click.stop="cellEvent(li, entry, key)">{{li.name}}</div></li>
                </ul>
              </div>
            </div>
            <div v-else-if="key.type === 'order'" class="grid-order">
              <span class="glyphicon glyphicon-triangle-top" @click.stop="cellEvent(entry, key.action, 'up')"></span>
              <span class="glyphicon glyphicon-triangle-bottom" @click.stop="cellEvent(entry, key.action, 'down')"></span>
            </div>

            <p v-else-if="key.type === 'link' && entry[key.path]" @click.stop="cellEvent(entry, 'download')" style="font-size: 15px; position: relative;">
              <span v-if="popUp.text && popUp.ind === ind" class="grid-pop-up" v-text="popUp.text"></span>
              <span v-if="!entry.files">
                <a @mouseover="showFileName(entry, ind)" @mouseleave="popUp.text = undefined; popUp.ind = undefined;" target="_blank" :href="cellText(entry, key.path)" download><span class="glyphicon glyphicon-file"></span></a>
              </span>
              <span v-if="entry.files">
                <a v-for="file in entry.files" v-if="file.file" @mouseover="showFileName(file, ind, true)" @mouseleave="popUp.text = undefined; popUp.ind = undefined;" target="_blank" :href="file.file" download><span class="glyphicon glyphicon-file"></span></a>
              </span>
            </p>

            <p v-else-if="key.bool" @click.stop="cellEvent(entry, key.action, key.path)" style="font-size: 15px;"><span v-if="checkBool(entry, key.path) && !checkBool(entry, key.show, true)" class="glyphicon glyphicon-ok text-success"></span><span v-if="!checkBool(entry, key.path) && !checkBool(entry, key.show, true)" class="glyphicon glyphicon-minus" style="color: lightgrey"></span></p>
            <p v-else-if="key.class" :class="key.class ? cellClass(entry, key.class) : ''" @click.stop="cellEvent({path: key.path, ind}, key.action)">{{cellLength(cellText(entry, key.path))}}</p>
            <p v-else-if="key.action" class="action-button text-success" @click.stop="cellEvent(entry, key.action)" >{{cellLength(cellText(entry, key.path))}}</p>
            <p v-else :class="key.customClass ? cellClass(entry, key.customClass) : ''">{{cellLength(cellText(entry, key.path, key.field))}}</p>
          </template>
        </td>
      </tr>
      <tr v-if="isLoading">
        <td :colspan="columns.length" class="text-center noData">
          <i class="fa fa-spinner fa-spin"></i>
        </td>
      </tr>
      <tr v-if="!isLoading && !data.length">
        <td :colspan="columns.length" class="text-center noData">
          <div v-html="emptyTableText"></div>
        </td>
      </tr>
    </tbody>
  </table>
    <div class="row" v-if="noPages.length > 1">
      <div class="text-center">
        <ul class="pagination">
          <li :class="{disabled: (currentPage === 0)}"><a href="#" @click="previous">Previous</a></li>
          <li><a href="#" @click="firstPage">First</a></li>
          <template>
            <li v-for="(page, ind) in noPages" :class="{active: page === currentPage}">
              <a :class="{'last-pagination-achor': ind === noPages.length - 1}" href="#" @click='(e) => {goToPage(page, e)}'>{{page + 1}}</a>
            </li>
          </template>
          <li :class="{disabled: (currentPage + 1 === noPages.length)}"><a href="#" @click="next">Next</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: Array, // Unfiltered table data
      columns: Array, // List of columns ['title', 'description']
      filterKey: String, // String to filter on ''
      customEmptyTableText: '', // optional text override for empty table
      rowsPerPage: Number, // Number of rows per page of results
      isLoading: false,
      customSelection: Boolean,
      selectedTasks: Array,
      highlightOnClick: Boolean,
      returnDataOnPage: Boolean
    },
    data: function () {
      var sortOrders = {}
      this.columns.forEach(function (key) {
        sortOrders[key.path] = 1
      })
      return {
        sortKey: '', popUp: {text: undefined, ind: undefined},
        showOptions: false,
        sortOrders: sortOrders,
        currentPage: 0,
        rowHighlighted: undefined
      }
    },
    watch: {
      'filterKey': function (a, b) { // Reset to page 0 when search changes
        this.currentPage = 0
      },
      'rowsPerPage': function (a, b) { // Reset to page 0 when items per page changes
        this.currentPage = 0
      },
      'noPages': function (a) { // Reset to page 0 when items per page changes
        if (this.currentPage > this.noPages[this.noPages.length - 1]) {
          this.currentPage = this.noPages[this.noPages.length - 1];
        }
      }
    },
    computed: {
      noPages: function () { // No. pages as an array. Used for rendering paginator
        let pages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        pages = [...Array(pages).keys()];
        pages = pages.filter(num => {
          return num < this.currentPage + 10 && num > this.currentPage - 10;
        }); 

        return pages;
      },
      emptyTableText: function () { // Default text shown when there's no data in the table
        if (this.customEmptyTableText) {
          return this.customEmptyTableText
        } else {
          return 'No data to show'
        }
      },
      filteredData: function () { // Data filtered through the local search
        var sortKey = this.sortKey
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        var order = this.sortOrders[sortKey] || 1
        var data = this.data
        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey) { // If sort specified, sort
          if (sortKey.toLowerCase().includes('date')) {
            let noDateArr = data.filter(d => !d[sortKey]);
            data = data.slice().filter(d => d[sortKey]).sort(function (a, b) {
              return (new Date(a[sortKey]) > new Date(b[sortKey]) ? 1 : -1) * order;
            }).concat(noDateArr);
          } else {
            if (sortKey.includes('.')) {
              sortKey = sortKey.split('.');
              data = data.slice().sort(function (a, b) {
                a = a[sortKey[0]] ? a[sortKey[0]][sortKey[1]] : 0;
                b = b[sortKey[0]] ? b[sortKey[0]][sortKey[1]] : 0;
                return (a === b ? 0 : a > b ? 1 : -1) * order
              })
            } else {
              data = data.slice().sort(function (a, b) {
                a = a[sortKey]
                b = b[sortKey]
                return (a === b ? 0 : a > b ? 1 : -1) * order
              })
            }
          }
        }
        return data
      },
      limitedData: function () { // Data limited to a page
        let limitedData = this.filteredData.slice(
          this.currentPage * this.rowsPerPage,
          this.rowsPerPage * (this.currentPage + 1)
        );
        if (this.returnDataOnPage) {
          this.$emit('limitedData', limitedData);
        }
        return limitedData;
      }
    },
    methods: {
      sortBy: function (key) { // header row click handler. Sort by column
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      },
      checkBool: function(entry, path, show) {
        if (show) {
          if (!entry[path]) return false;
          return true;
        } else {
          return entry[path];
        }
      },
      cellLength: function(val) {
        if (!val) return '';
        return val.length > 100 ? val.substring(0, 100) + ' ...' : val;
      },
      cellText: function(entry, path, field) {
        if (path.includes('.')) {
          if (!entry[path.split('.')[0]]) return '';
          if (Object.prototype.toString.call(entry[path.split('.')[0]][path.split('.')[1]]) === '[object Array]') {
            return entry[path.split('.')[0]][path.split('.')[1]].join(", ");
          }
          return entry[path.split('.')[0]][path.split('.')[1]];
        } else if (Object.prototype.toString.call( entry[path] ) === '[object Array]') {
          if (field) {
            return entry[path].map(e => e[field]).join(", ")
          }
          if (!entry[path.split('.')[0]]) return '';
          if (path.includes('.')) {
            return entry[path.split('.')[0]][path.split('.')[1]].join(", ");
          } else {
            return entry[path].join(", ")
          }
        } else {
          return entry[path];
        }
      },
      rowEvent: function (entry, ind) { // Event broadcase from table with clicked element
        if (this.highlightOnClick) {
          this.rowHighlighted = ind;
        }
        this.$emit('clickRow', entry)
      },
      cellEvent: function (entry, action, path, event) { // Event broadcase from table with clicked element
        if (!action) return;
        this.showOptions = undefined;
        this.$emit('clickCell', entry, action, path, event)
      },
      previous: function (e) { // Previous page click handler
        e.preventDefault()
        if (this.currentPage !== 0) {
          --this.currentPage
        }
      },
      next: function (e) { // Next page click handler
        e.preventDefault()
        if (this.currentPage + 1 !== this.noPages.length) {
          ++this.currentPage
        }
      },
      goToPage: function (page, e) { // Go to a specific page click handler
        e.preventDefault();
        this.rowHighlighted = undefined;
        this.currentPage = page;
      },
      firstPage: function(e) {
        e.preventDefault();
        this.currentPage = 0;
      },
      selectDropdownItem: function(li, entry, key) {
        this.cellEvent(entry, key.action, li)
      },
      cellClass: function(entry, path) {
        if (path.includes('.')) {
          if (!entry[path.split('.')[0]]) return '';
          if (Object.prototype.toString.call(entry[path.split('.')[0]][path.split('.')[1]]) === '[object Array]') {
            return entry[path.split('.')[0]][path.split('.')[1]].join(", ");
          }
          return entry[path.split('.')[0]][path.split('.')[1]];
        } else {
          return entry[path];
        }
      },
      openOptions: function(num) {
        if (this.showOptions === num) {
          return this.showOptions = undefined;
        }
        this.showOptions = num;
      },
      clickOutside: function() {
        this.showOptions = false;
      },
      checkDisabled: function(entry, li) {
        if (typeof li === 'string') {
          return !entry[li];
        } else {
          if (li && entry.hasOwnProperty(li.disabled)) {
            return false;
          }
          return true;
        }
      },
      showFileName: function(entry, ind, arr) {
        if (arr) {
          this.popUp.ind = ind;
          this.popUp.text = entry.name || parseName(entry.file); 
        } else {
          this.popUp.ind = ind;
          this.popUp.text = parseName(entry.file || entry.link || entry.image); 
        }

        function parseName(link) {
          if (link.includes('http')) {
            return link.substring(link.lastIndexOf('/') + 1);
          } else {
            return link;
          }
        }
      },
      addCustomSelection: function(entry) {
        if (entry === 'all') {
          this.$emit('selection', this.limitedData.map(e => e._id));
        } else {
          this.$emit('selection', entry._id);
        }
      },
      hasValues: function(entry) {
        return Object.keys(entry).some(k => entry[k]);
      }
    }

  }
</script>

<style scoped>
  /* .alpha-table {
    margin-top: 10px;
  }
  .grid-row {
    cursor: pointer;
    background-color: #f9f9f9;
    font-size: 14px;
  }
  .grid-row:hover .grid-order {
    display: flex;
  }
  .grid-cell {
    padding: 7px;
    position: relative !important;
  }
  .grid-cell > p {
    margin: 0;
  }
  th {
    cursor: pointer;
    border: none !important;
    font-size: 12px;
    font-weight: 500;
    padding: 3px !important;
  }
  th.act {
    color: grey;
  }
  th.act .arrow {
    opacity: 1;
  }
  th > div {
    padding: 3px;
  }
  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }
  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #fff;
  }
  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
  }
  .action-button {
    cursor: pointer;
    display: inline-block;
  }
  .action-button:hover {
    text-decoration: underline;
  }
  .highlighted {
    background-color: #efefef !important;
  }
  .other-options {
    font-size: 16px;
  }
  .other-options:hover {
    color: #DAA520;
  }
  .other-options-dropdown {
    position: absolute;
    top: 20px;
    left: -100px;
    z-index: 9999;
    background-color: #fff;
  }
  .other-options-dropdown ul {
    padding: 5px;
    box-shadow: 3px 3px 11px 1px #ccc;
    min-width: 150px;
  }
  .other-options-dropdown ul li {
    padding: 0px 5px;
  }
  .other-options-dropdown ul li:hover {
    background-color: #efefef;
  }
  .grid-order {
    display: none;
    flex-direction: column;
    max-height: 15px;
    margin-top: -5px;
    font-size: 16px;
  }
  .grid-order span {
    max-width: 18px;
  }
  .grid-order span:first-child {
    margin-bottom: -5px;
  }
  .grid-order span:hover {
    color: #337ab7;
  }
  .disabled {
    color: #aba8a8;
  }
  .grid-pop-up {
    position: absolute;
    top: -30px;
    left: -40px;
    border-radius: 4px;
    padding: 5px;
    border: 1px solid lightgray;
    background-color: #efefef;
    width: auto;
    white-space: nowrap;
  } */
</style>