import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  headers:["Id","Name","percentage"],
  records:null,
  canView:false,
  viewData:null,
  pages:null,
  page:1,
  size:10,
  init(){
    this._super(...arguments);
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.viewTable();
    });
  },
  viewTable(){
    var here=this;
    $.ajax({
      type:"POST",
      async:false,
      url:"/view",
    }).then(function(data){
      console.log(data);
      if(data.isException){
        $('#error-area').html("<strong>"+data.exception+"</strong>");
      }
      else{
        var datas=data.table;
        here.set('canView',true);
        here.set('records',datas);
        var pages=[];
        var size=10;
        var total;
        if(datas.length%size===0){
          total=Math.floor(datas.length/size);
        }
        else{
          total=Math.floor(datas.length/size)+1;
        }
        for(var i=0;i<total;i++){
          pages.push(i+1);
        }
        here.set('pages',pages);
        here.send('setPage',1);
      }
    });
    /*.fail(function(jqXHR, textStatus, errorThrown,data) {
      alert(JSON.parse(data));
    }).done(function(data, textStatus, jqXHR){
      alert("Success: ");
    });*/

    /*if(datas.isException){
      alert('Exception in native library');
    }
    else{
      this.set('canView',true);
      this.set('records',datas);
      var pages=[];
      var size=10;
      var total;
      if(datas.length%size===0){
        total=Math.floor(datas.length/size);
      }
      else{
        total=Math.floor(datas.length/size)+1;
      }
      for(var i=0;i<total;i++){
        pages.push(i+1);
      }
      this.set('pages',pages);
      this.send('setPage',1);
    }*/
  },
  actions:{
    setPage(page){
      page=Number(page);
      var size=this.get('size');
      var datas=this.get('records');
      var total;
      if(datas.length%size===0){
        total=Math.floor(datas.length/size);
      }
      else{
        total=Math.floor(datas.length/size)+1;
      }
      var viewData=datas.slice((page-1)*size,page*size);
      console.log('total:'+total);
      this.set('page',page);
      this.set('viewData',viewData);
      console.log(total,page);
      if(total===1){
        $('#prev').prop('disabled', true);
        $('#next').prop('disabled', true);
      }
      else if(page===1){
        $('#prev').prop('disabled', true);
        $('#next').prop('disabled', false);
      }
      else if(page===total){
        $('#next').prop('disabled', true);
        $('#prev').prop('disabled', false);
      }
      else{
        $('#prev').prop('disabled', false);
        $('#next').prop('disabled', false);
      }
    },
    setSize(size){
      var pages=[];
      var total;
      var page;
      var datas=this.get('records');
      if(datas.length%size===0){
        total=Math.floor(datas.length/size);
      }
      else{
        total=Math.floor(datas.length/size)+1;
      }
      for(var i=0;i<total;i++){
        pages.push(i+1);
      }
      if(this.get('page')>total){
        this.set('page',total);
        $('#page').val(this.get('page'));
        page=this.get('page');
      }
      else{
        page=this.get('page');
      }
      this.set('pages',pages);
      var viewData=datas.slice((page-1)*size,page*size);
      this.set('size',size);
      this.set('viewData',viewData);
      if(total===1){
        $('#prev').prop('disabled', true);
        $('#next').prop('disabled', true);
      }
      else if(page===1){
        $('#prev').prop('disabled', true);
        $('#next').prop('disabled', false);
      }
      else if(page===total){
        $('#next').prop('disabled', true);
        $('#prev').prop('disabled', false);
      }
      else{
        $('#prev').prop('disabled', false);
        $('#next').prop('disabled', false);
      }
    },
    next(){
      $('#page').val(this.get('page')+1);
      this.send('setPage',this.get('page')+1);
    },
    prev(){
      $('#page').val(this.get('page')-1);
      this.send('setPage',this.get('page')-1);
    },
    exportPDF(){
      var fileName=$('#fileName').val();
      var doc = new jsPDF('p', 'pt', 'a4');
      var columns=["ID","NAME","PERCENTAGE"];
      var rows=this.get('records');
      doc.autoTable(columns, rows);
      if(fileName.length===0){
        doc.save('Report.pdf');
      }
      else{
        doc.save(fileName+'.pdf');
      }

    }
  }
});
