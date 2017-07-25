/**
 * Created by cloud.wong.
 */
import fetch from 'whatwg-fetch'

export const getComment = (data)=>fetch('/product/commentList',data);
