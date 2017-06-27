/**
 * Created by cloud.wong on 2017/6/26.
 */
import {
  SAVED_ADDRESS
} from './mutation-types'

export default {
  async saveAddress({
    commit,
    state
  }){
    if(state.deleteAddress.length > 0){
      return;
    }
    let address = await fetch();
    commit(SAVED_ADDRESS,address);
  }
}
