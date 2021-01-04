//导入vue
import Vue from 'vue'
// 局部导入（Toast）轻提示插件
import {Toast} from 'vant'
// //局部注册插件
Vue.use(Toast)

//表单验证
class ValidForm{

    constructor(){}

    valid(o){
         
        
        //验证格式是否正确
       for(let key in o){
            if(!o[key].reg.test(o[key].value)){
                
                //提示信息
                Toast(o[key].errorMsg)

                //验证不通过时
                return false;

            }
       }
        return true;
    }
}


export const validForm = new ValidForm();