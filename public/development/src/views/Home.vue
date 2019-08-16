<template>
  <div id="page-top">
    
  <!-- Page Wrapper -->
  <div id="wrapper">

    <!-- Sidebar -->
    <side-bar></side-bar>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

        <!-- Topbar -->
        <top-bar></top-bar>
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid">
          <div class="row">
              <sub-list></sub-list>
              <step-list></step-list>
              <form-sec></form-sec>
          </div><!-- /.row -->

          <div class="row">
            <info-sec></info-sec>
          </div><!-- /.row -->

        </div>
        <!-- /.container-fluid -->

      </div>
      <!-- End of Main Content -->

      <!-- Footer -->
      <footer-sec></footer-sec>
      <!-- End of Footer -->

    </div>
    <!-- End of Content Wrapper -->

  </div>
  <!-- End of Page Wrapper -->

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
  <!-- End of Scroll to Top Button-->
  
  </div>
</template>

<script>
import Vuex from "vuex";
import subList from './sub-list.vue';
import stepList from './step-list.vue';
import formSec from './form-sec.vue';
import infoSec from './info-sec.vue';
import sideBar from './side-bar.vue';
import topBar from './top-bar.vue';
import footerSec from './footer-sec.vue';

export default {
  name: "home",
  mounted(){ 
    this.$store.dispatch('loaddata');
    this.$nextTick( ()=>{
      (function($) {
        "use strict";   
        // Default sidebar is collapsed    
        $(".sidebar").toggleClass("toggled");
        // Toggle the side navigation
        $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
          $("body").toggleClass("sidebar-toggled");
          $(".sidebar").toggleClass("toggled");
          if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
          };
        });      
        // Close any open menu accordions when window is resized below 768px
        $(window).resize(function() {
          if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
          };
        });      
        // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
        $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
          if ($(window).width() > 768) {
            var e0 = e.originalEvent,
              delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
          }
        });      
        // Scroll to top button appear
        $(document).on('scroll', function() {
          var scrollDistance = $(this).scrollTop();
          if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
          } else {
            $('.scroll-to-top').fadeOut();
          }
        });      
        // Smooth scrolling using jQuery easing
        $(document).on('click', 'a.scroll-to-top', function(e) {
          var $anchor = $(this);
          $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
          }, 1000, 'easeInOutExpo');
          e.preventDefault();
        });      
      })(jQuery); // End of use strict
    });

  },
  components: {
    subList,stepList,formSec,infoSec,sideBar,topBar,footerSec
  },
  methods :{
    
  },
  computed:{
      ...Vuex.mapState({
          stageurl : 'stageurl', activeProject : '$activeProject'
        }),
  },
  created(){

  }
};
</script>
<style lang="css">
@import '../../static/css/layout.css';
</style>

<style lang="css">
@import '../../static/fontawesome/css/all.min.css';
</style>