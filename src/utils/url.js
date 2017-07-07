/**
 * @author cloud.wong
 */
let baseUrl = document.querySelector('#base') ? document.querySelector('#base').getAttribute('value') : 'http://m.buoumall.com'
let apiUrl = document.querySelector('#api')?document.querySelector('#api').getAttribute('value') : 'http://api.buoumall.com'
let imageUrl = document.querySelector('#imgDomain')?document.querySelector('#imgDomain').getAttribute('value') : 'http://image.buoumall.com/'

export {
  baseUrl,
  apiUrl,
  imageUrl
}
