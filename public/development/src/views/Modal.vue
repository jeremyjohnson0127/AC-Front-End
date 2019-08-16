<template>
  <div class="modal fade " :id="customId || 'main-modal'" :style="customId ? 'z-index: 9999;' : ''" data-backdrop="static" 
  data-keyboard="false" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document" :style="{'width': width}">
      <div class="modal-content">
        <div class="modal-header">
            <span class="glyphicon glyphicon-remove remove-modal-button" :style="customId ? 'z-index: 9999;' : 'z-index: 9998;'" @click="closeModal"></span>
             <slot name="header">
               default header
             </slot>
        </div>
        <div class="modal-body" :style="{'height': height}">
          <slot name="body">
             default body
           </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
             
           </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      width: '',
      height: '',
      customId: ''
    },
    methods: {
      closeModal
    },
    mounted() {
      let self = this;
      $(self.customId ? `#${self.customId}` : '#main-modal').modal();
    },
    beforeDestroy () {
      document.getElementsByTagName("BODY")[0].removeAttribute("style");
      $('body').removeClass('modal-open'); 
      $('.modal-backdrop').remove();
    }
  }

  function closeModal() {
    let self = this;
    $(self.customId || '#main-modal').modal('hide');  
    setTimeout(function() {
      self.$emit('close')}
    , 300);
  }
</script>

<style >
  /* .modal-content {
    padding: 10px 15px;
  }
  .modal-header {
    border: none;
    margin-bottom: 0;
  }

  .remove-modal-button {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 18px;
    cursor: pointer;
  }

  .remove-modal-button:hover {
    text-decoration: none;
  }


  .modal-header h3 {
    margin-top: 0;
  }

  .modal-body {
    margin: 0 0 10px;
    padding-top: 0;
  }

  .modal-default-button {
    float: right;
  } */
  
</style>
