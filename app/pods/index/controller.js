import Ember from 'ember';
import $ from 'jquery';
export default Ember.Controller.extend({
  //classNames: ['jni-app'],
  toView:false,
  viewData:null,
  records:null,
  actions:{
    view:function(){
      this.set('toView',true);
      $("#add").attr('class', 'nav-link');
      $("#view").attr('class', 'nav-link active');
    },
    add:function(){
      this.set('toView',false);
      $("#add").attr('class', 'nav-link active');
      $("#view").attr('class', 'nav-link');
    }
  }
});
