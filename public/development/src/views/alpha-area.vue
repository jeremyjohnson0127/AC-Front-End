<template>
  	<textarea :disabled="contentDisabled" class="form-control" :class="{'shadow-disabled': contentDisabled}" style="white-space: pre-wrap;" rows="1" :placeholder="placeholder || ''" v-model="mainObj[field]"></textarea>
</template>
<script>
export default {
  data() {
    return {
      msg: ''
    }
  },
  mounted() {
    attachAutoHeiht();
    function attachAutoHeiht(argument) {
      let tx = document.getElementsByTagName('textarea');
      for (var i = 0; i < tx.length; i++) {
        tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        tx[i].addEventListener("input", OnInput, false);
        if (tx[i].scrollHeight === 0) {
          setTimeout(function() {
            attachAutoHeiht();
          }, 10);
        }
      }

    }


    function OnInput() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    }
  },
  props: {
  	mainObj: Object,
  	field: String,
  	placeholder: String,
    contentDisabled: Boolean
  }
}


</script>
