/**
 * Created by cloud.wong on 2017/6/23.
 */
import fetch from 'whatwg-fetch'

export const getComment = (data)=>fetch('/product/commentList',data);
