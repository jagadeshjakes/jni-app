import Ember from 'ember';
import $ from 'jquery';
export default Ember.Component.extend({
  didUpload:false,
  id:null,
  name:null,
  percentage:null,
  isException:false,
  errorRows:null,
  actions:{
    addNew:function(){
      $.ajax({
  			type:"POST",
  			async:false,
  			data:{id:this.get("id"),name:this.get("name"),percentage:this.get("percentage")},
  			url:"/insert",
      }).then(function(data){
        if(data.result){
          var exception="<div class='alert alert-success alert-dismissible fade show' role='alert'>"+
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
          "<strong>Inserted Successfully</strong></div>";
          $('#exception-div').html(exception);
        }
        else{
          var excep="<div class='alert alert-warning alert-dismissible fade show' role='alert'>"+
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
          "<strong>"+data.error+"</strong></div>";
          $('#exception-div').html(excep);
        }
      });
      this.set('id','');
      this.set('name','');
      this.set('percentage','');
    },
    uploadFile:function(){
      var fileName = $("#upfile").val();
      if(fileName){
        var here=this;
        var form = $('#fileUploadForm')[0];
        var data = new FormData(form);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/insertfile",
            data: data,
            async:false,
            processData: false,
            contentType: false,
            cache: false,
        }).then(function(data){
          console.log(data);
          if(data.isException){
            console.log(data);
            here.set('didUpload',false);
            var exception="<div class='alert alert-warning alert-dismissible fade show' role='alert'>"+
            "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
            "<strong>"+data.exception+"</strong></div>";

            $('#exception-div').html(exception);
          }
          else{
            var datas=data;
            var success=(datas.success/datas.total)*100;
            var failure=100-success;
            $('#success').css('width',''+success+'%');
            $('#success').text(datas.success+'/'+datas.total);
            $('#failure').css('width',''+failure+'%');
            $('#failure').text(datas.error+'/'+datas.total);
            //var status="<label class='bg-info text-white'>Total:<span class='badge'>"+datas.total+"</span></label>";
            var status="<br><div class='alert alert-info' role='alert'>Total:<strong>"+datas.total+"</strong></div>"+
            "<div class='alert alert-success' role='alert'>Success:<strong>"+datas.success+"</strong></div>"+
            "<div class='alert alert-danger' role='alert'>Failure:<strong>"+(datas.total-datas.success)+"</strong></div>";
            $('#upload-status').html(status);
            if(failure!==0){
              $('#exception-div').html("");
              here.set('didUpload',true);
              here.set('errorRows',datas.errors);
            }
          }
        });
      }
      else{
        var exception="<div class='alert alert-warning alert-dismissible fade show' role='alert'>"+
        "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
        "<strong>No File Selected</strong></div>";
        $('#exception-div').html(exception);
      }

    },
    hide:function(){
      this.set('didUpload',false);
      location.reload();
    }
  }
});
