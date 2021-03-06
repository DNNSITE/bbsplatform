﻿/*
 * Project: BBS.MoneyInput
 * Version: 1.1
 * Author: dnn.site
 * Website: http://dnn.site
*/
(function($){    
    var defaults={
         localzRes:{placeholderText:'Select item...'}
        ,dVal:null
        ,modId:''
        ,minCurrResultsForSearch:7
        ,enabled:true
        ,readOnly:false
        ,isReq:false
        ,currListData:[]
        ,defCurrId:null        
        ,onChange:function(){}
        }
        ,methods={
            init:function(options){
                var settings={};
                return this.each(function(){
                    settings=$.extend(true,{},defaults,options);                    
                    $(this).data("settings",settings);                
                    initWidget(this);
                });
        } 
        ,getValue:function(){return getValue(this);}
        ,getDataValue:function(){return getDataValue(this);}
        ,setValue:function(v){this.each(function(e){setValue(this,v);});}
        ,setDataValue:function(d){this.each(function(e){setDataValue(this,d);});}
    };

    var getSettings=function($this){return $($this).data("settings");}
    ,initWidget=function($this){
        var settings=getSettings($this),paneId=$($this).attr('id'),html='',pObj=$('#'+paneId),dVal=settings.dVal,strArrVal='',dVal_prc='',dVal_cur='';
        if(dVal!=null){strArrVal='['+dVal.replace(/\|/g,',')+']';if($.isArray(eval(strArrVal))){dVal_prc=eval(strArrVal)[0];dVal_cur=eval(strArrVal)[1];}else{strArrVal='';}}
        html+='<div class="form-group money-input">';
        html+='<div class="input input-group'+(settings.enabled==false?' state-disabled':'')+(settings.isReq?' reqInd':'')+'">';        
        html+='<input type="text" id="frmVal_money'+settings.modId+'_price" name="frmVal_money'+settings.modId+'_price"'+(settings.readOnly?' readonly="readonly"':'')+(settings.enabled==false?' disabled="disabled"':'')+(dVal_prc?' value="'+dVal_prc+'"':'')+(settings.placeholderText?' placeholder="' +settings.placeholderText+'"':'')+' maxlength="15" style="border-right:none;"/>';                
        html+='</div>';
        html+='<div class="select2 select2-group">';
        html+='<select id="frmVal_money'+settings.modId+'_curid" name="frmVal_money'+settings.modId+'_curid"'+' class="select2-single">';        
        $.each(settings.currListData,function(i,itm){html+='<option value="'+itm.id+'"'+(dVal_cur==itm.id?' selected="selected"':'')+(itm.hasOwnProperty('icncss')?' data-icn="'+itm.icncss+'"':'')+'>'+itm.title+'</option>';});
        html+='</select>';
        html+='</div>';
        html+='</div>';        
        html+='</label>';        
        pObj.append(html);   
        $('#frmVal_money'+settings.modId+'_price').mask('# ##0',{reverse:true});
        $('#frmVal_money'+settings.modId+'_curid').select2({
            theme:'bootstrap'
            ,hideSelectionFromResult:function(selectedObject){return false;}
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minCurrResultsForSearch
            ,templateResult:getSelTemp
            ,templateSelection:getSelTemp
            ,allowClear:false
        });        
        $('#frmVal_money'+settings.modId+'_curid').on('change.bbsmoneyinput'+settings.modId,function(){
            var v=getValue($this);settings.onChange.call($this,v);
        });        
    }
    ,getSelTemp=function(s){        
        if(!s.id){return s.text;}        
        var icn=$(s.element).data('icn'),v=$(s.element).attr('value'),t=$(s.element).html();         
        var m='<div class="select2-result-repository"><div class="select2-result-repository__cssicn"><i class="'+icn+'"></i></div><div class="select2-result-repository__meta"><div class="select2-result-repository__title"> ('+t+')</div></div></div>';
        return m;
    }
    ,getValue=function($this){
        var settings=getSettings($this),v='',p=$('#frmVal_money'+settings.modId+'_price').val(),c=$('#frmVal_money'+settings.modId+'_curid').val();
        p=p.replace(/ /g,'');if(isNaN(p)!=false){p='';}if(p!=''&&c!=''){v=p+'|'+c;}return v;
    }
    ,getDataValue=function($this){
        var settings=getSettings($this),v=null,p=$('#frmVal_money'+settings.modId+'_price').val(),c=$('#frmVal_money'+settings.modId+'_curid').val();
        p=p.replace(/ /g,'');if(isNaN(p)!=false){p='';}if(p!=''&&c!=''){v={"cur":c,"val":p};}return v;
    }  
    ,setDataValue=function($this,d){
        var settings=getSettings($this);
        console.log('settings: ',settings)
        if(d==null||typeof d!='object'){return;}if(d.length==0){return;}
        $('#frmVal_money'+settings.modId+'_price').val(d.val);
        $('#frmVal_money'+settings.modId+'_curid').val(d.cur).trigger('change.select2');
    }
    ,setValue=function($this,v){
        var settings=getSettings($this),strArrVal='',c='',p='';
        if(v!=''){strArrVal='['+v.replace(/\|/g,',')+']';if($.isArray(eval(strArrVal))){p=eval(strArrVal)[0];c=eval(strArrVal)[1];}}
        $('#frmVal_money'+settings.modId+'_price').val(p);
        $('#frmVal_money'+settings.modId+'_curid').val(c).trigger('change.select2');
    };
    $.fn.bbsMoneyInput=function(methodOrOptions){
        if(methods[methodOrOptions]){return methods[methodOrOptions].apply(this,Array.prototype.slice.call(arguments,1));}
        else if(typeof methodOrOptions==='object'||!methodOrOptions){return methods.init.apply(this,arguments);}
        else{$.error('Method '+methodOrOptions+' does not exist on jQuery.bbsMoneyInput');}
    };
})(jQuery);